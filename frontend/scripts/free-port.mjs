import { execSync } from "child_process";

const port = "5173";

function freePort(targetPort) {
  try {
    const output = execSync(`netstat -ano | findstr :${targetPort}`, { encoding: "utf8" });
    const pids = new Set();
    for (const line of output.split("\n")) {
      if (!line.includes("LISTENING")) continue;
      const pid = line.trim().split(/\s+/).pop();
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        console.log(`Freed port ${targetPort} (stopped PID ${pid})`);
      } catch {
        // ignore
      }
    }
  } catch {
    // port not in use
  }
}

freePort(port);
