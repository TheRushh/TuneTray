const mockWebContents = {
  setWindowOpenHandler: jest.fn(),
  isDevToolsOpened: jest.fn(() => false),
  loadURL: jest.fn(),
  session: {},
};

const mockWin = {
  webContents: mockWebContents,
  on: jest.fn(),
  hide: jest.fn(),
  show: jest.fn(),
  focus: jest.fn(),
  isVisible: jest.fn(() => false),
  getBounds: jest.fn(() => ({ x: 0, y: 0, width: 430, height: 860 })),
  setPosition: jest.fn(),
  loadURL: jest.fn(),
};

const mockTray = {
  setTitle: jest.fn(),
  setToolTip: jest.fn(),
  on: jest.fn(),
  getBounds: jest.fn(() => ({ x: 100, y: 0, width: 20, height: 20 })),
  popUpContextMenu: jest.fn(),
};

const BrowserWindow = jest.fn(() => mockWin);
BrowserWindow._mockWin = mockWin;

const Tray = jest.fn(() => mockTray);
Tray._mockTray = mockTray;

const Menu = {
  buildFromTemplate: jest.fn((template) => ({ template })),
};

const nativeImage = {
  createFromDataURL: jest.fn(() => "mock-image"),
};

const shell = {
  openExternal: jest.fn(),
};

const screen = {
  getPrimaryDisplay: jest.fn(() => ({
    workAreaSize: { width: 1440, height: 900 },
  })),
};

const app = {
  quit: jest.fn(),
  dock: { hide: jest.fn() },
  on: jest.fn(),
};

module.exports = { BrowserWindow, Tray, Menu, nativeImage, shell, screen, app };
