# TuneTray

A minimal macOS menu bar app for YouTube Music.

## Features

- Sits quietly in your menu bar (look for the **♫** icon).
- Opens YouTube Music in a mobile view for a compact experience.
- Click the icon to toggle the player.
- Right-click to Quit.

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

## Build for macOS

To create a standalone `.app` application:

1. Run the build script:
   ```bash
   npm run build
   ```
2. This will generate a `TuneTray-darwin-universal` folder containing `TuneTray.app`.
3. You can drag `TuneTray.app` to your Applications folder.

## Notes

- On first launch, you might need to right-click the app and select 'Open' if it's not signed (standard macOS security behavior for unsigned apps).
- The app will appear in your menu bar (top right).
