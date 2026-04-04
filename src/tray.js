const { Tray, Menu, nativeImage, app } = require("electron");

const TRANSPARENT_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

function createTray({ onToggle }) {
  const icon = nativeImage.createFromDataURL(TRANSPARENT_ICON);
  const tray = new Tray(icon);
  tray.setTitle("♫");
  tray.setToolTip("TuneTray");

  tray.on("click", onToggle);

  tray.on("right-click", () => {
    tray.popUpContextMenu(
      Menu.buildFromTemplate([{ label: "Quit TuneTray", click: () => app.quit() }])
    );
  });

  return tray;
}

module.exports = { createTray };
