const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  screen,
  shell,
} = require("electron");
const path = require("path");

let tray = null;
let window = null;

app.on("ready", () => {
  // Hide dock icon
  if (app.dock) app.dock.hide();

  // Create Tray
  // We need an image. Create a simple one from data URL to avoid file dependency for now
  // This is a 1x1 transparent pixel.
  // IMPORTANT: For macOS, the tray icon should ideally be a template image.
  // But using a simple string title '♫' works well too.
  // We pass a transparent image just to satisfy the constructor.
  const icon = nativeImage.createFromDataURL(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
  );
  tray = new Tray(icon);
  tray.setTitle("♫"); // Set a music note as the title
  tray.setToolTip("TuneTray");

  tray.on("click", (event, bounds) => {
    toggleWindow();
  });

  tray.on("right-click", () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Quit TuneTray",
        click: () => {
          app.quit();
        },
      },
    ]);
    tray.popUpContextMenu(contextMenu);
  });

  createWindow();
});

function createWindow() {
  window = new BrowserWindow({
    width: 375, // Mobile-ish width
    height: 600,
    show: false,
    frame: false, // Frameless
    resizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
    skipTaskbar: true,
  });

  // Use a modern Android Chrome user agent to satisfy Google's security checks and force mobile view
  const userAgent = 'Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
  
  window.loadURL('https://music.youtube.com', { userAgent });

  // Open external links in browser (e.g. if user clicks something that shouldn't open inside)
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://music.youtube.com")) {
      return { action: "allow" };
    }
    shell.openExternal(url);
    return { action: "deny" };
  });

  window.on("blur", () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });
}

function toggleWindow() {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
}

function showWindow() {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window below the tray icon
  let x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );
  let y = Math.round(trayBounds.y + trayBounds.height + 4);

  // Adjustment for right side of screen
  const display = screen.getPrimaryDisplay();
  const { width } = display.workAreaSize;

  if (x + windowBounds.width > width) {
    x = width - windowBounds.width - 10;
  }
  if (x < 0) x = 10;

  window.setPosition(x, y, false);
  window.show();
  window.focus();
}
