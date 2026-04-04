const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { app } = require("electron");

const CHROME_COOKIE_PATH = path.join(
  app.getPath("home"),
  "Library/Application Support/Google/Chrome/Default/Cookies"
);

function decryptCookie(encryptedValue, aesKey) {
  if (!encryptedValue || encryptedValue.length < 3) return "";
  const buf = Buffer.from(encryptedValue);
  if (buf.slice(0, 3).toString() !== "v10") return buf.toString();
  const iv = Buffer.alloc(16, " ");
  const decipher = crypto.createDecipheriv("aes-128-cbc", aesKey, iv);
  decipher.setAutoPadding(true);
  try {
    return Buffer.concat([decipher.update(buf.slice(3)), decipher.final()]).toString();
  } catch {
    return "";
  }
}

async function importChromeCookies(session) {
  try {
    const keytar = require("keytar");
    const Database = require("sql.js");

    if (!fs.existsSync(CHROME_COOKIE_PATH)) {
      console.log("[cookies] Chrome Cookies file not found");
      return;
    }

    const encryptedKey = await keytar.getPassword("Chrome Safe Storage", "Chrome");
    if (!encryptedKey) {
      console.log("[cookies] Could not get Chrome Safe Storage key from Keychain");
      return;
    }

    const aesKey = crypto.pbkdf2Sync(encryptedKey, "saltysalt", 1003, 16, "sha1");

    const tmpPath = path.join(app.getPath("temp"), "tunetray-chrome-cookies.db");
    fs.copyFileSync(CHROME_COOKIE_PATH, tmpPath);

    const SQL = await Database();
    const fileBuffer = fs.readFileSync(tmpPath);
    const db = new SQL.Database(fileBuffer);

    const rows = db.exec(
      `SELECT host_key, name, encrypted_value, value, path, expires_utc, is_secure, is_httponly, samesite
       FROM cookies WHERE host_key LIKE '%google.com' OR host_key LIKE '%youtube.com'`
    );
    db.close();
    fs.unlinkSync(tmpPath);

    if (!rows.length) return;

    const cols = rows[0].columns;
    const values = rows[0].values;
    let imported = 0;

    for (const row of values) {
      const r = Object.fromEntries(cols.map((c, i) => [c, row[i]]));
      const encVal = r.encrypted_value;
      const value = encVal?.length > 3
        ? decryptCookie(encVal, aesKey)
        : r.value;
      if (!value) continue;

      const expirationDate = r.expires_utc
        ? (r.expires_utc / 1000000) - 11644473600
        : undefined;

      try {
        await session.cookies.set({
          url: `https://${r.host_key.replace(/^\./, "")}`,
          name: r.name,
          value,
          domain: r.host_key,
          path: r.path || "/",
          secure: !!r.is_secure,
          httpOnly: !!r.is_httponly,
          expirationDate,
          sameSite: ["unspecified", "no_restriction", "lax", "strict"][r.samesite] || "no_restriction",
        });
        imported++;
      } catch {}
    }

    console.log(`[cookies] Imported ${imported} cookies from Chrome`);
  } catch (err) {
    console.error("[cookies] Import failed:", err.message);
  }
}

module.exports = { importChromeCookies };
