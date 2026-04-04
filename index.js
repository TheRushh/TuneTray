const { app } = require("electron");
const { createTray } = require("./src/tray");
const { createWindow, loadYTMusic, toggleWindow } = require("./src/window");
const { importChromeCookies } = require("./src/cookies");

let tray = null;
let win = null;

app.on("ready", async () => {
  if (app.dock) app.dock.hide();

  win = createWindow();

  tray = createTray({
    onToggle: () => toggleWindow(win, tray),
    onSyncCookies: async () => {
      await importChromeCookies(win.webContents.session);
      win.webContents.reload();
    },
  });

  await importChromeCookies(win.webContents.session);
  loadYTMusic(win);
});
