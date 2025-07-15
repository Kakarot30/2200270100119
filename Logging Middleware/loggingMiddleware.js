// logger.js

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuaWt1bmoyNDMwQGdtYWlsLmNvbSIsImV4cCI6MTc1MjU1NzYxNiwiaWF0IjoxNzUyNTU2NzE2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYmRlMWU4NzEtNmI1Mi00YTI4LWIzOGItZmUyMmE5NDgwOTFkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibmlrdW5qIHR5YWdpIiwic3ViIjoiYWJjOWVmMjYtYTExNy00ODViLWI0NWEtMGUyZDlkYjA3ODFhIn0sImVtYWlsIjoibmlrdW5qMjQzMEBnbWFpbC5jb20iLCJuYW1lIjoibmlrdW5qIHR5YWdpIiwicm9sbE5vIjoiMjIwMDI3MDEwMDExOSIsImFjY2Vzc0NvZGUiOiJ1dU1ieVkiLCJjbGllbnRJRCI6ImFiYzllZjI2LWExMTctNDg1Yi1iNDVhLTBlMmQ5ZGIwNzgxYSIsImNsaWVudFNlY3JldCI6IlB4U1hoY3lqTlN6a3dOcmIifQ.CjDG6oJV9CI0rfdAIcRnglNbxzlXasszf4NV2llC_7w";

// Allowed values for validation (optional but good practice)
const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = {
  backend: [
    "cache",
    "controller",
    "cron_job",
    "db",
    "domain",
    "handler",
    "repository",
    "route",
    "service",
  ],
  frontend: ["api"],
  common: ["auth", "config", "middleware", "utils"],
};

// Utility function to validate fields (optional)
function isValidLog(stack, level, pkg) {
  const validStack = VALID_STACKS.includes(stack);
  const validLevel = VALID_LEVELS.includes(level);
  const validPackage =
    VALID_PACKAGES.common.includes(pkg) ||
    (stack === "backend" && VALID_PACKAGES.backend.includes(pkg)) ||
    (stack === "frontend" && VALID_PACKAGES.frontend.includes(pkg));

  return validStack && validLevel && validPackage;
}

// Reusable log function
async function Log(stack, level, pkg, message) {
  if (!isValidLog(stack, level, pkg)) {
    console.error("Invalid log parameters:", { stack, level, pkg });
    return;
  }

  try {
    const res = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Log created: ${data.logID}`);
    } else {
      console.error("❌ Logging failed:", data.message);
    }
  } catch (error) {
    console.error("❌ Error in logging API call:", error.message);
  }
}

module.exports = Log;
