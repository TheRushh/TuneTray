// Dev launcher — watches files and restarts a single Electron process on changes
const { spawn } = require("child_process");
const chokidar = require("chokidar");
const path = require("path");

const electronBin = path.join(__dirname, "node_modules", ".bin", "electron");

let child = null;
let restarting = false;

function start() {
  child = spawn(electronBin, ["."], {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "development" },
  });
  child.on("exit", () => {
    child = null;
    restarting = false;
  });
}

function restart(file) {
  if (restarting) return;
  restarting = true;
  console.log(`[dev] ${file} changed — restarting`);
  if (child) {
    child.once("exit", () => start());
    child.kill();
  } else {
    start();
  }
}

start();

chokidar
  .watch(["index.js", "src/**/*.js"], { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 200 } })
  .on("change", restart);

process.on("SIGINT", () => {
  if (child) child.kill();
  process.exit();
});
