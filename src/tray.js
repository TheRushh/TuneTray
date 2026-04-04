const { Tray, Menu, nativeImage, app } = require("electron");

const TRANSPARENT_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

function createTray({ onToggle, onSyncCookies }) {
  const icon = nativeImage.createFromDataURL(TRANSPARENT_ICON);
  const tray = new Tray(icon);
  tray.setTitle("♫");
  tray.setToolTip("TuneTray");

  tray.on("click", onToggle);

  tray.on("right-click", () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Sync cookies from Chrome",
        click: onSyncCookies,
      },
      { type: "separator" },
      {
        label: "Quit TuneTray",
        click: () => app.quit(),
      },
    ]);
    tray.popUpContextMenu(contextMenu);
  });

  return tray;
}

module.exports = { createTray };
