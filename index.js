const { app } = require("electron");
const { createTray } = require("./src/tray");
const { createWindow, loadYTMusic, toggleWindow } = require("./src/window");

let tray = null;
let win = null;

app.on("ready", () => {
  if (app.dock) app.dock.hide();

  win = createWindow();
  tray = createTray({ onToggle: () => toggleWindow(win, tray) });

  loadYTMusic(win);
});
