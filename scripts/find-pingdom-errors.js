#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function usage() {
  console.log("Usage: node scripts/find-pingdom-errors.js <path-to-har-or-json>");
  process.exit(1);
}

function safeParse(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function getEntries(data) {
  if (Array.isArray(data?.log?.entries)) return data.log.entries;
  if (Array.isArray(data?.entries)) return data.entries;
  if (Array.isArray(data?.requests)) {
    return data.requests.map((request) => ({
      request: { url: request.url || request.request_url || "" },
      response: { status: Number(request.status || request.status_code || 0), statusText: request.statusText || "" },
      time: Number(request.time || request.wait || 0),
      startedDateTime: request.startedDateTime || request.started || "",
    }));
  }
  return [];
}

function getHeaderValue(headers, key) {
  if (!Array.isArray(headers)) return "";
  const match = headers.find((header) => String(header.name || "").toLowerCase() === key.toLowerCase());
  return match?.value || "";
}

function formatEntry(entry) {
  const url = entry?.request?.url || "";
  const status = Number(entry?.response?.status || 0);
  const statusText = entry?.response?.statusText || "";
  const timeMs = Number(entry?.time || 0);
  const started = entry?.startedDateTime || "";
  const referer =
    getHeaderValue(entry?.request?.headers, "referer") ||
    getHeaderValue(entry?.request?.headers, "referrer");

  return { url, status, statusText, timeMs, started, referer };
}

function printList(title, rows) {
  console.log(`\n${title} (${rows.length})`);
  if (!rows.length) {
    console.log("  none");
    return;
  }
  rows.forEach((row, index) => {
    const urlPath = (() => {
      try {
        const parsed = new URL(row.url);
        return `${parsed.origin}${parsed.pathname}`;
      } catch {
        return row.url;
      }
    })();
    const referer = row.referer ? ` | referer: ${row.referer}` : "";
    const started = row.started ? ` | started: ${row.started}` : "";
    console.log(
      `  ${index + 1}. [${row.status}${row.statusText ? ` ${row.statusText}` : ""}] ${urlPath} | ${Math.round(
        row.timeMs
      )}ms${referer}${started}`
    );
  });
}

function main() {
  const input = process.argv[2];
  if (!input) usage();

  const filePath = path.resolve(process.cwd(), input);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const data = safeParse(filePath);
  const entries = getEntries(data).map(formatEntry).filter((entry) => entry.url);

  if (!entries.length) {
    console.error("No request entries found. Export a HAR from browser Network tab or Pingdom JSON.");
    process.exit(1);
  }

  const errors = entries.filter((entry) => entry.status >= 400 || entry.status === 0);
  const redirects308 = entries.filter((entry) => entry.status === 308);
  const otherRedirects = entries.filter((entry) => entry.status >= 300 && entry.status < 400 && entry.status !== 308);

  console.log(`Scanned requests: ${entries.length}`);
  printList("Error requests", errors);
  printList("308 redirects", redirects308);
  printList("Other redirects", otherRedirects);
}

main();
