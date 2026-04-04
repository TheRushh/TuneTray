# TuneTray

A minimal macOS menu bar app for YouTube Music.

## Features

- Sits quietly in your menu bar (look for the **♫** icon).
- Opens YouTube Music in a compact mobile view.
- Click the icon to toggle the player.
- Right-click for options: sync cookies, quit.
- Automatically imports your existing Google sign-in from Chrome on startup.

## Project Structure

```
TuneTray/
├── index.js          — entry point
├── dev.js            — hot-reload dev watcher
├── src/
│   ├── tray.js       — tray icon & context menu
│   ├── window.js     — BrowserWindow creation & positioning
│   └── cookies.js    — Chrome cookie import for sign-in
```

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/TheRushh/TuneTray.git
   cd TuneTray
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm start
   ```

## Development (Hot Reload)

Run with hot reload — the app restarts automatically on any file save:

```bash
npm run dev
```

Changes to any file in `src/` or `index.js` will trigger a clean single-instance restart.

## Sign In

On startup, TuneTray imports Google/YouTube cookies from Chrome so you stay signed in automatically. If you ever get signed out, right-click the **♫** icon and choose **Sync cookies from Chrome**.

> You may see a macOS Keychain prompt on first launch — click **Allow** to grant access.

## Build for macOS

To create a standalone `.app`:

```bash
npm run build
```

This generates a `TuneTray-darwin-universal` folder containing `TuneTray.app`. Drag it to your Applications folder.

## Notes

- On first launch of an unsigned build, right-click the app and select **Open** to bypass Gatekeeper.
- The app hides from the Dock and lives only in the menu bar.
