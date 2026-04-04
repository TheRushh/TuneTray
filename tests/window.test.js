const { BrowserWindow, shell, screen } = require("electron");
const { createWindow, loadYTMusic, toggleWindow } = require("../src/window");

const mockWin = BrowserWindow._mockWin;

beforeEach(() => {
  jest.clearAllMocks();
  // Reset default mock return values
  mockWin.isVisible.mockReturnValue(false);
  mockWin.webContents.isDevToolsOpened.mockReturnValue(false);
  mockWin.getBounds.mockReturnValue({ x: 0, y: 0, width: 430, height: 860 });
});

describe("createWindow", () => {
  test("creates BrowserWindow with correct options", () => {
    createWindow();
    expect(BrowserWindow).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 430,
        height: 860,
        show: false,
        frame: false,
        resizable: false,
        fullscreenable: false,
        skipTaskbar: true,
        webPreferences: expect.objectContaining({
          nodeIntegration: false,
          contextIsolation: true,
          backgroundThrottling: false,
          partition: "persist:tunetray",
        }),
      })
    );
  });

  test("registers setWindowOpenHandler", () => {
    createWindow();
    expect(mockWin.webContents.setWindowOpenHandler).toHaveBeenCalled();
  });

  test("registers blur event listener", () => {
    createWindow();
    expect(mockWin.on).toHaveBeenCalledWith("blur", expect.any(Function));
  });

  test("returns the window instance", () => {
    const win = createWindow();
    expect(win).toBe(mockWin);
  });
});

describe("window open handler", () => {
  let handler;

  beforeEach(() => {
    createWindow();
    handler = mockWin.webContents.setWindowOpenHandler.mock.calls[0][0];
  });

  test("allows popups from music.youtube.com", () => {
    const result = handler({ url: "https://music.youtube.com/watch?v=123" });
    expect(result).toEqual({ action: "allow" });
  });

  test("denies and opens external for other URLs", () => {
    const result = handler({ url: "https://example.com" });
    expect(shell.openExternal).toHaveBeenCalledWith("https://example.com");
    expect(result).toEqual({ action: "deny" });
  });
});

describe("blur handler", () => {
  let blurHandler;

  beforeEach(() => {
    createWindow();
    blurHandler = mockWin.on.mock.calls.find(([event]) => event === "blur")[1];
  });

  test("hides window on blur when DevTools are closed", () => {
    mockWin.webContents.isDevToolsOpened.mockReturnValue(false);
    blurHandler();
    expect(mockWin.hide).toHaveBeenCalled();
  });

  test("does not hide window on blur when DevTools are open", () => {
    mockWin.webContents.isDevToolsOpened.mockReturnValue(true);
    blurHandler();
    expect(mockWin.hide).not.toHaveBeenCalled();
  });
});

describe("loadYTMusic", () => {
  test("loads music.youtube.com with mobile user agent", () => {
    loadYTMusic(mockWin);
    expect(mockWin.loadURL).toHaveBeenCalledWith(
      "https://music.youtube.com",
      expect.objectContaining({ userAgent: expect.stringContaining("Mobile") })
    );
  });
});

describe("toggleWindow", () => {
  const mockTray = { getBounds: jest.fn(() => ({ x: 100, y: 0, width: 20, height: 20 })) };

  test("hides window when it is visible", () => {
    mockWin.isVisible.mockReturnValue(true);
    toggleWindow(mockWin, mockTray);
    expect(mockWin.hide).toHaveBeenCalled();
  });

  test("shows and positions window when it is hidden", () => {
    mockWin.isVisible.mockReturnValue(false);
    toggleWindow(mockWin, mockTray);
    expect(mockWin.setPosition).toHaveBeenCalled();
    expect(mockWin.show).toHaveBeenCalled();
    expect(mockWin.focus).toHaveBeenCalled();
  });

  test("clamps window position to screen width when it would overflow right", () => {
    screen.getPrimaryDisplay.mockReturnValue({ workAreaSize: { width: 500 } });
    mockWin.getBounds.mockReturnValue({ x: 0, y: 0, width: 430, height: 860 });
    mockTray.getBounds.mockReturnValue({ x: 450, y: 0, width: 20, height: 20 });
    mockWin.isVisible.mockReturnValue(false);
    toggleWindow(mockWin, mockTray);
    const [x] = mockWin.setPosition.mock.calls[0];
    expect(x).toBeLessThanOrEqual(500 - 430);
  });

  test("clamps window position to minimum x of 10 when it would overflow left", () => {
    screen.getPrimaryDisplay.mockReturnValue({ workAreaSize: { width: 1440 } });
    mockWin.getBounds.mockReturnValue({ x: 0, y: 0, width: 430, height: 860 });
    mockTray.getBounds.mockReturnValue({ x: 0, y: 0, width: 20, height: 20 });
    mockWin.isVisible.mockReturnValue(false);
    toggleWindow(mockWin, mockTray);
    const [x] = mockWin.setPosition.mock.calls[0];
    expect(x).toBeGreaterThanOrEqual(10);
  });
});
