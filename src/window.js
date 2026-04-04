const { BrowserWindow, screen, shell } = require("electron");

const USER_AGENT =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";

function createWindow() {
  const win = new BrowserWindow({
    width: 430,
    height: 860,
    show: false,
    frame: false,
    resizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
      partition: "persist:tunetray",
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://music.youtube.com")) return { action: "allow" };
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.on("blur", () => {
    if (!win.webContents.isDevToolsOpened()) win.hide();
  });

  return win;
}

function loadYTMusic(win) {
  win.loadURL("https://music.youtube.com", { userAgent: USER_AGENT });
}

function showWindow(win, tray) {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  const winBounds = win.getBounds();
  const trayBounds = tray.getBounds();

  let x = Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2);
  let y = Math.round(trayBounds.y + trayBounds.height + 4);

  if (x + winBounds.width > width) x = width - winBounds.width - 10;
  if (x < 0) x = 10;

  win.setPosition(x, y, false);
  win.show();
  win.focus();
}

function toggleWindow(win, tray) {
  if (win.isVisible()) {
    win.hide();
  } else {
    showWindow(win, tray);
  }
}

module.exports = { createWindow, loadYTMusic, showWindow, toggleWindow };
