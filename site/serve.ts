// LIFECTRL production server — AI-powered personal chief of staff.
// Serves the React SPA + API from a single Bun server on port 3000.
// The platform reverse-proxies the public URL to 0.0.0.0:3000.

const PORT = 3000;
const HOST = "0.0.0.0";

// Free PORT regardless of which user owns the current listener.
const freePort =
  `for _ in $(seq 1 25); do ` +
  `pids=$(lsof -t -iTCP:${String(PORT)} -sTCP:LISTEN 2>/dev/null || true); ` +
  `if [ -z "$pids" ]; then exit 0; fi; ` +
  `kill $pids 2>/dev/null || true; sleep 0.2; ` +
  `done`;

for (let attempt = 1; ; attempt++) {
  await Bun.$`sudo sh -c ${freePort}`.quiet().nothrow();
  try {
    // Import the LIFECTRL server entry point. Bun auto-loads .env from cwd.
    const server = await import("./dist/server/index.js");
    Bun.serve({
      port: PORT,
      hostname: HOST,
      fetch: server.default.fetch,
    });
    break;
  } catch (err) {
    if (attempt >= 10) throw err;
    await Bun.sleep(200);
  }
}

console.log(`LIFECTRL serving on http://${HOST}:${String(PORT)}`);
