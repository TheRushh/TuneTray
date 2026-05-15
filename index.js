const { app, globalShortcut } = require("electron");
const { createTray } = require("./src/tray");
const { createWindow, loadYTMusic, toggleWindow } = require("./src/window");

let tray = null;
let win = null;

function registerNavShortcuts() {
  globalShortcut.register("CommandOrControl+[", () => {
    if (win.webContents.navigationHistory.canGoBack()) {
      win.webContents.navigationHistory.goBack();
    }
  });
  globalShortcut.register("CommandOrControl+]", () => {
    if (win.webContents.navigationHistory.canGoForward()) {
      win.webContents.navigationHistory.goForward();
    }
  });
}

function unregisterNavShortcuts() {
  globalShortcut.unregister("CommandOrControl+[");
  globalShortcut.unregister("CommandOrControl+]");
}

app.on("ready", () => {
  if (app.dock) app.dock.hide();

  win = createWindow();
  tray = createTray({ onToggle: () => toggleWindow(win, tray) });

  loadYTMusic(win);

  win.on("show", registerNavShortcuts);
  win.on("hide", unregisterNavShortcuts);
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
