const { Tray, Menu, app } = require("electron");
const { createTray } = require("../src/tray");

const mockTray = Tray._mockTray;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createTray", () => {
  test("creates tray with correct title and tooltip", () => {
    createTray({ onToggle: jest.fn() });
    expect(mockTray.setTitle).toHaveBeenCalledWith("♫");
    expect(mockTray.setToolTip).toHaveBeenCalledWith("TuneTray");
  });

  test("registers click handler for toggle", () => {
    const onToggle = jest.fn();
    createTray({ onToggle });
    const clickCall = mockTray.on.mock.calls.find(([event]) => event === "click");
    expect(clickCall).toBeDefined();
    clickCall[1]();
    expect(onToggle).toHaveBeenCalled();
  });

  test("registers right-click handler", () => {
    createTray({ onToggle: jest.fn() });
    const rightClickCall = mockTray.on.mock.calls.find(([event]) => event === "right-click");
    expect(rightClickCall).toBeDefined();
  });

  test("right-click menu contains Quit item", () => {
    createTray({ onToggle: jest.fn() });
    const rightClickHandler = mockTray.on.mock.calls.find(([e]) => e === "right-click")[1];
    rightClickHandler();
    const template = Menu.buildFromTemplate.mock.calls[0][0];
    expect(template.some((item) => item.label === "Quit TuneTray")).toBe(true);
  });

  test("Quit menu item calls app.quit", () => {
    createTray({ onToggle: jest.fn() });
    const rightClickHandler = mockTray.on.mock.calls.find(([e]) => e === "right-click")[1];
    rightClickHandler();
    const template = Menu.buildFromTemplate.mock.calls[0][0];
    const quitItem = template.find((item) => item.label === "Quit TuneTray");
    quitItem.click();
    expect(app.quit).toHaveBeenCalled();
  });

  test("returns the tray instance", () => {
    const tray = createTray({ onToggle: jest.fn() });
    expect(tray).toBe(mockTray);
  });
});
