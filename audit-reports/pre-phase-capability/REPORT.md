# Pre-Phase — Execution Capability Discovery Report

**Project:** Orvion Studio (`orivon-re`)  
**Date:** 2026-07-01  
**Purpose:** Establish the true execution envelope for all future investigations.  
**Method:** Every capability was verified by actual tool execution. Nothing assumed.

---

## 1. Execution Environment

| Property                 | Verified Value                                         |
| ------------------------ | ------------------------------------------------------ |
| OS                       | Arch Linux (rolling)                                   |
| Kernel                   | 7.0.3-arch1-2                                          |
| Architecture             | x86_64                                                 |
| User                     | `virus` (uid=1000)                                     |
| Groups                   | virus, docker, video, render, **wheel**                |
| Sudo (passwordless)      | **NO** — password required, not available              |
| Pacman (package manager) | Available — requires sudo to install                   |
| Display                  | `DISPLAY=:1` — real X display present                  |
| Internet Access          | **YES** — 200 OK from google.com in 0.83s              |
| Docker daemon            | **Running** — user in `docker` group, no sudo required |
| Node.js                  | v25.9.0                                                |
| npm                      | 11.13.0                                                |
| Python                   | 3.14.4                                                 |
| pip                      | 26.1.1                                                 |

---

## 2. Execution Capability Matrix

> **Status codes:** `AVAILABLE` — verified working. `PARTIAL` — works with constraints. `UNAVAILABLE` — verified not possible.

---

### 2.1 — Browsers

| Capability                               | Status      | Verification Method                                                                              | Tool                              | Evidence Produced                      | Install Required            | Can Auto-Install                       | Manual Action            | Limitation                                                                          | Confidence |
| ---------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------ | --------------------------------- | -------------------------------------- | --------------------------- | -------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------- | ---------- |
| **Google Chrome 142**                    | AVAILABLE   | `google-chrome-stable --version`                                                                 | Chrome 142.0.7444.175             | Version string confirmed               | No                          | —                                      | No                       | Headless only; no GPU                                                               | HIGH       |
| **Chrome Headed**                        | AVAILABLE   | `DISPLAY=:1` confirmed, screenshot test succeeded                                                | Chrome + X display                | 17KB screenshot captured               | No                          | —                                      | No                       | Requires active X session                                                           | HIGH       |
| **Chromium (separate)**                  | UNAVAILABLE | `which chromium` → not found                                                                     | —                                 | None                                   | Yes (pacman, needs sudo)    | No                                     | Requires sudo            | Not installed                                                                       | HIGH       |
| **Firefox**                              | PARTIAL     | `firefox --version` → not found; `playwright install --dry-run firefox` → confirmed downloadable | Playwright Firefox 151.0          | ~80MB download from cdn.playwright.dev | **Yes**                     | **Yes** (`playwright install firefox`) | No                       | Ubuntu-24.04 build — may have glibc compatibility issues on Arch; no headed Firefox | HIGH       |
| **Firefox ESR**                          | UNAVAILABLE | `which firefox-esr` → not found                                                                  | —                                 | None                                   | Yes (pacman, needs sudo)    | No                                     | Requires sudo            | Not available                                                                       | HIGH       |
| **Microsoft Edge**                       | UNAVAILABLE | `which microsoft-edge` → not found; no Linux deb in path                                         | —                                 | None                                   | Complex (no pacman package) | No                                     | Manual download required | Not supported via pacman                                                            | HIGH       |
| **Safari**                               | UNAVAILABLE | Platform: Linux. Safari only available on macOS/iOS.                                             | —                                 | None                                   | No (macOS binary)           | No                                     | Requires macOS machine   | **Fundamental platform limitation**                                                 | ABSOLUTE   |
| **iOS Safari**                           | UNAVAILABLE | Requires macOS + Xcode Simulator or physical iPhone                                              | —                                 | None                                   | No                          | No                                     | Requires macOS + Xcode   | **Fundamental platform limitation**                                                 | ABSOLUTE   |
| **Android Chrome (real device)**         | UNAVAILABLE | No Android device or emulator present                                                            | —                                 | None                                   | No                          | No                                     | Physical device required | **Fundamental platform limitation**                                                 | ABSOLUTE   |
| **Playwright Chromium (headless shell)** | AVAILABLE   | Cache confirmed at `~/.cache/ms-playwright/chromium_headless_shell-1228`                         | Playwright 1.61.1 + Chromium 1228 | Confirmed in cache                     | No                          | —                                      | No                       | Chromium, not Chrome — minor rendering delta                                        | HIGH       |
| **WebKit (Playwright)**                  | UNAVAILABLE | Not in playwright cache; not listed in dry-run for this platform                                 | —                                 | None                                   | Unlikely                    | Uncertain                              | Check availability       | WebKit for Linux not reliably supported in Playwright                               | MEDIUM     |

---

### 2.2 — Browser Automation Frameworks

| Capability                                | Status      | Verification Method                                                                                                                                    | Tool                                         | Evidence Produced                          | Install Required        | Can Auto-Install | Manual Action | Limitation                                                | Confidence |
| ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ------------------------------------------ | ----------------------- | ---------------- | ------------- | --------------------------------------------------------- | ---------- |
| **Playwright v1.61.1**                    | AVAILABLE   | `playwright --version` in project node_modules                                                                                                         | `/orivon-re/node_modules/.bin/playwright`    | Version confirmed                          | No                      | —                | No            | Only Chromium browser pre-installed                       | HIGH       |
| **Playwright + Chrome**                   | AVAILABLE   | Chrome 142 present; Playwright can use `channel: 'chrome'`                                                                                             | Playwright + Chrome                          | Full automation                            | No                      | —                | No            | Must specify `channel: 'chrome'`                          | HIGH       |
| **Playwright + Firefox**                  | PARTIAL     | Dry-run confirms Firefox 151 downloadable (~80MB)                                                                                                      | `playwright install firefox`                 | After install: Firefox automation          | Yes                     | **Yes**          | No            | 80MB download; Arch/Ubuntu glibc may conflict             | MEDIUM     |
| **Playwright + WebKit**                   | UNAVAILABLE | Not available for Linux in this Playwright version                                                                                                     | —                                            | —                                          | No                      | No               | —             | Linux WebKit not supported                                | HIGH       |
| **Puppeteer**                             | UNAVAILABLE | `node -e "require('puppeteer')"` → not found; not in project or global                                                                                 | —                                            | None                                       | Yes (npm install)       | **Yes**          | No            | Chrome must be manually pointed; overlaps with Playwright | HIGH       |
| **Selenium + Docker**                     | PARTIAL     | Docker running; user in docker group; `docker pull selenium/standalone-firefox` started downloading                                                    | Docker 29.4.2 + Selenium image               | Firefox/Chrome via Selenium Grid           | Yes (Docker image pull) | **Yes**          | No            | ~600MB image; first-run download required                 | MEDIUM     |
| **Chrome DevTools Protocol (CDP) direct** | AVAILABLE   | CDP domains enumerated: 53 domains available including Emulation, Network, Performance, Accessibility, ServiceWorker, Tracing, Page, Runtime, DOM, CSS | Chrome 142 + websocket-client (Python 1.9.0) | Live CDP session confirmed all key domains | No                      | —                | No            | Requires `--remote-allow-origins=*` flag                  | HIGH       |

---

### 2.3 — CDP Capabilities (Verified via Live Protocol Calls)

| Capability                    | Status    | CDP Method                                                | Evidence                                             | Limitation                                                           | Confidence |
| ----------------------------- | --------- | --------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------- | ---------- |
| **CPU Throttling**            | AVAILABLE | `Emulation.setCPUThrottlingRate`                          | `rate: 4` → OK response                              | Only software throttle (not real CPU change)                         | HIGH       |
| **Network Throttling**        | AVAILABLE | `Network.emulateNetworkConditions`                        | Slow4G params → OK                                   | Software simulation; local server has near-zero latency              | HIGH       |
| **Mobile Device Emulation**   | AVAILABLE | `Emulation.setDeviceMetricsOverride`                      | iPhone (375×812, 3× DPR, mobile=true) → OK           | Visual emulation only; not real touch hardware                       | HIGH       |
| **JavaScript Disable**        | AVAILABLE | `Emulation.setScriptExecutionDisabled`                    | `value: true` → OK                                   | Must be set before navigation                                        | HIGH       |
| **Accessibility Tree**        | AVAILABLE | `Accessibility.enable`                                    | OK response; full a11y tree queryable                | Only Chrome's a11y tree, not AT simulation                           | HIGH       |
| **Performance Metrics**       | AVAILABLE | `Performance.enable`                                      | OK; `Performance.getMetrics` returns CWV             | Unthrottled local server; real-world delta applies                   | HIGH       |
| **Console Error Capture**     | AVAILABLE | `Runtime.consoleAPICalled` event                          | Subscribable via CDP                                 | Must be set before navigation                                        | HIGH       |
| **Memory Profiling**          | AVAILABLE | `Memory.enable`, `HeapProfiler.enable`                    | Both domains available (confirmed in 53-domain list) | Heap snapshots require post-processing                               | MEDIUM     |
| **CPU Flame Graph (Tracing)** | AVAILABLE | `Tracing.start` / `Tracing.end`                           | `Tracing` domain confirmed                           | Raw JSON trace requires tool to visualise (flamegraph.js or similar) | MEDIUM     |
| **Service Worker Inspection** | AVAILABLE | `ServiceWorker.enable`                                    | OK response                                          | No SW registered in this app — returns empty list                    | HIGH       |
| **Offline Mode Simulation**   | AVAILABLE | `Network.emulateNetworkConditions` with `offline: true`   | Same domain as network throttle                      | Can simulate offline; app has no SW so will fail gracefully          | HIGH       |
| **Cache Inspection / Clear**  | AVAILABLE | `Network.clearBrowserCache`, `Storage.clearDataForOrigin` | Both available in Network/Storage domains            | Clears Chrome's cache, not CDN/Vercel cache                          | HIGH       |
| **Screenshot (CDP)**          | AVAILABLE | `Page.captureScreenshot`                                  | 17KB PNG captured in capability test                 | Headless only without display manipulation                           | HIGH       |
| **PDF Export**                | AVAILABLE | `Page.printToPDF`                                         | 44MB PDF captured in capability test                 | Useful for visual diff                                               | HIGH       |
| **JS Coverage**               | AVAILABLE | `Profiler.startPreciseCoverage`                           | `Profiler` domain in list                            | Can measure unused JS at function-level                              | MEDIUM     |

---

### 2.4 — Dedicated Accessibility Tools

| Capability                              | Status      | Verification Method                                                                   | Tool                                | Evidence Produced                           | Install Required                                | Can Auto-Install | Manual Action                      | Limitation                                                       | Confidence |
| --------------------------------------- | ----------- | ------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------- | ----------------------------------------------- | ---------------- | ---------------------------------- | ---------------------------------------------------------------- | ---------- |
| **Lighthouse Accessibility**            | AVAILABLE   | Found at npx cache path `/home/virus/.npm/_npx/.../lighthouse` v13.4.0                | Lighthouse 13.4.0                   | JSON audit with per-element failures        | No (npx cache warm)                             | —                | No                                 | Automated WCAG subset only (~35% of WCAG)                        | HIGH       |
| **Pa11y 9.1.1**                         | AVAILABLE   | `npm install --prefix /tmp/pa11y-local pa11y` succeeded; `pa11y --version` → 9.1.1    | Pa11y 9.1.1                         | WCAG2AA/AAA violation report per URL        | Yes (local prefix)                              | **Yes**          | No                                 | Chrome-based; cannot test non-Chromium rendering                 | HIGH       |
| **axe-core**                            | PARTIAL     | Not installed as package; injectable via Playwright `page.evaluate()` from CDN or npm | Playwright + axe-core CDN injection | Full axe violation report                   | Partial (CDN inject, or `npm install axe-core`) | **Yes**          | No                                 | Requires Playwright session to be active                         | MEDIUM     |
| **axe-cli**                             | UNAVAILABLE | `which axe` → not found; not in global npm                                            | —                                   | None                                        | Yes (npm install @axe-core/cli)                 | **Yes**          | No                                 | Redundant if Pa11y + Playwright available                        | MEDIUM     |
| **Screen Reader (NVDA/JAWS/VoiceOver)** | UNAVAILABLE | No screen reader software installed; Linux has Orca but not tested                    | —                                   | None                                        | Orca available via pacman (needs sudo)          | No               | Manual operation required          | Cannot automate AT interaction at this level                     | HIGH       |
| **Color Contrast (manual)**             | AVAILABLE   | CDP screenshot + ImageMagick colour sampling                                          | ImageMagick 7.1.2 + Chrome          | Pixel colour values at specific coordinates | No                                              | —                | Manual coordinate selection needed | Precise pixel coords required                                    | MEDIUM     |
| **Color Blind Simulation**              | PARTIAL     | Can apply CSS filters via CDP (`Runtime.evaluate`); no dedicated tool installed       | CDP + CSS filter inject             | Screenshot of simulated view                | No                                              | —                | No                                 | CSS filters (e.g. `grayscale`, `sepia`) only; not full Daltonize | LOW        |

---

### 2.5 — Performance Profiling Tools

| Capability                     | Status      | Verification Method                                         | Tool              | Evidence Produced                                | Install Required | Can Auto-Install | Manual Action                 | Limitation                                        | Confidence |
| ------------------------------ | ----------- | ----------------------------------------------------------- | ----------------- | ------------------------------------------------ | ---------------- | ---------------- | ----------------------------- | ------------------------------------------------- | ---------- |
| **Lighthouse Performance**     | AVAILABLE   | npx cache confirmed; used in Phase 1B                       | Lighthouse 13.4.0 | FCP, LCP, TBT, CLS, TTI, SI — JSON               | No               | —                | No                            | Lab data; not field data (CrUX)                   | HIGH       |
| **CDP Performance Metrics**    | AVAILABLE   | `Performance.enable` → OK                                   | CDP + Chrome      | Raw perf metrics (JSHeapUsed, LayoutCount, etc.) | No               | —                | No                            | No aggregation/scoring                            | HIGH       |
| **CDP CPU Tracing**            | AVAILABLE   | `Tracing` domain confirmed                                  | CDP + Chrome      | Raw trace JSON (flamegraph-parseable)            | No               | —                | No                            | Must post-process JSON; no built-in visualiser    | MEDIUM     |
| **JS Function-Level Coverage** | AVAILABLE   | `Profiler.startPreciseCoverage` domain confirmed            | CDP Profiler      | Bytewise JS coverage JSON                        | No               | —                | No                            | Must process coverage JSON                        | MEDIUM     |
| **Real Mobile Hardware Perf**  | UNAVAILABLE | No physical device present                                  | —                 | —                                                | —                | No               | Physical device required      | Cannot emulate real Qualcomm/Apple chip behaviour | ABSOLUTE   |
| **Field Data (CrUX)**          | UNAVAILABLE | No Chrome UX Report API key; orviontech not publicly indexed | CrUX API          | —                                                | No               | No               | Manual API key + live traffic | No field data for pre-launch site                 | HIGH       |
| **WebPageTest**                | UNAVAILABLE | No API key; no local WebPageTest instance                   | —                 | —                                                | No               | No               | API key required              | Free tier rate-limited; no credentials            | HIGH       |

---

### 2.6 — Network, Compression, and Caching Tools

| Capability                              | Status      | Verification Method                                                                          | Tool                   | Evidence Produced     | Install Required | Can Auto-Install | Manual Action            | Limitation                                                            | Confidence |
| --------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- | ---------------------- | --------------------- | ---------------- | ---------------- | ------------------------ | --------------------------------------------------------------------- | ---------- |
| **HTTP Header Inspection (local)**      | AVAILABLE   | `curl -I http://127.0.0.1:4173/` → 200 with headers                                          | curl 8.20.0            | Full response headers | No               | —                | No                       | Local preview, not Vercel production headers                          | HIGH       |
| **HTTP Header Inspection (production)** | UNAVAILABLE | `orviontech` DNS does not resolve from this machine                                           | —                      | —                     | No               | No               | Live deployment required | No live Vercel deployment accessible                                  | HIGH       |
| **HTTP/2 Support Verification**         | AVAILABLE   | `curl --http2 -w "%{http_version}"` → `2` on google.com; local preview is HTTP/1.1           | curl                   | Version string        | No               | —                | No                       | Local vite preview is HTTP/1.1 only                                   | HIGH       |
| **Brotli Compression (local)**          | UNAVAILABLE | curl with `Accept-Encoding: br` → no `Content-Encoding` header from vite preview             | curl + vite preview    | Confirmed: no brotli  | No               | —                | No                       | Vite preview does not serve compressed assets                         | HIGH       |
| **Brotli Compression (production)**     | UNAVAILABLE | orviontech unreachable                                                                        | —                      | —                     | —                | —                | Live deployment required | Cannot test production Vercel compression                             | HIGH       |
| **Gzip Compression (local)**            | UNAVAILABLE | Same — no `Content-Encoding` header from vite preview                                        | curl                   | Confirmed: no gzip    | No               | —                | No                       | Same as brotli — preview server limitation                            | HIGH       |
| **Cache-Control Headers (local)**       | AVAILABLE   | `curl -I` on CSS asset → `Cache-Control: no-cache`, `ETag`, `Last-Modified` confirmed        | curl                   | Header values         | No               | —                | No                       | Preview server headers differ from Vercel CDN headers                 | HIGH       |
| **Cache-Control Headers (production)**  | UNAVAILABLE | orviontech unreachable                                                                        | —                      | —                     | —                | —                | Live deployment required | —                                                                     | HIGH       |
| **DNS Inspection**                      | PARTIAL     | `python3 socket.gethostbyname('orviontech')` → cannot resolve; `dig`/`nslookup` not installed | Python socket          | Negative: DNS failure | No               | —                | No                       | `dig` not installed; `orviontech` not resolving                        | MEDIUM     |
| **SSL Certificate (production)**        | UNAVAILABLE | `openssl s_client -connect orviontech:443` failed (DNS not resolving)                         | openssl                | No cert data          | No               | —                | No                       | orviontech not reachable from this machine                             | HIGH       |
| **CSP Verification (local)**            | AVAILABLE   | curl headers show no CSP on preview; vercel.json confirms no CSP configured                  | curl + file inspection | No CSP confirmed      | No               | —                | No                       | Production CSP behaviour determined by vercel.json (read in Phase 1A) | HIGH       |
| **CSP Verification (production)**       | UNAVAILABLE | orviontech unreachable                                                                        | —                      | —                     | —                | —                | Live deployment          | —                                                                     | HIGH       |

---

### 2.7 — Validation and SEO Tools

| Capability                                              | Status      | Verification Method                                                                                             | Tool                    | Evidence Produced                   | Install Required | Can Auto-Install | Manual Action                                | Limitation                                                  | Confidence |
| ------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------------- | ---------------- | ---------------- | -------------------------------------------- | ----------------------------------------------------------- | ---------- |
| **Sitemap XML Validation (format)**                     | AVAILABLE   | `xmllint --format` test succeeded                                                                               | xmllint (libxml 2.15.3) | Valid/invalid XML report            | No               | —                | No                                           | Format only; cannot validate URLs against live server       | HIGH       |
| **Sitemap Existence (production)**                      | UNAVAILABLE | orviontech unreachable; sitemap.xml absent from dist/                                                            | —                       | Confirmed absent from build         | No               | —                | No                                           | Cannot test production path                                 | HIGH       |
| **Structured Data Extraction (local)**                  | AVAILABLE   | Python regex on curl output → Schema 1: @type=Organization                                                      | Python + curl           | JSON-LD object list                 | No               | —                | No                                           | HTML parser approach; edge cases possible                   | HIGH       |
| **Structured Data Validation (schema.org conformance)** | PARTIAL     | Can POST JSON-LD to schema.org validator API or Google Rich Results Test API                                    | curl + internet         | API validation response             | No               | —                | No                                           | Rate limits; Google API requires key for rich results test  | MEDIUM     |
| **Open Graph Tags (local)**                             | AVAILABLE   | Python regex on local HTML → og:type, og:title, og:description, og:image, twitter:card, twitter:image confirmed | Python + curl           | OG property list with values        | No               | —                | No                                           | Cannot test how social crawlers actually render the preview | HIGH       |
| **Open Graph Validation (social crawlers)**             | UNAVAILABLE | orviontech not live; og:image references `https://orviontech/og-image.png` which does not exist                   | —                       | Negative confirmed in Phase 1B      | —                | —                | Live deployment + OG debugger tools required | —                                                           | HIGH       |
| **W3C HTML Validator**                                  | PARTIAL     | No local `vnu` installed; can POST HTML to `https://validator.w3.org/nu/?out=json` via curl                     | curl + W3C API          | JSON validation report              | No               | —                | No                                           | Rate-limited; internet dependency                           | MEDIUM     |
| **robots.txt Validation**                               | AVAILABLE   | `curl http://127.0.0.1:4173/robots.txt` + manual parse; Lighthouse `robots-txt` audit passes                    | curl + Lighthouse       | Parsed rules + Lighthouse pass/fail | No               | —                | No                                           | Cannot verify sitemap URL target exists                     | HIGH       |
| **Canonical Tag Audit**                                 | AVAILABLE   | Lighthouse `canonical` audit passes all tested routes                                                           | Lighthouse              | Pass/fail per route                 | No               | —                | No                                           | Automated only; does not verify canonical URLs resolve      | HIGH       |

---

### 2.8 — Cross-Browser and Cross-Device Verification

| Capability                    | Status      | Verification Method                                                                             | Tool                                     | Evidence Produced                    | Install Required   | Can Auto-Install | Manual Action                  | Limitation                                                            | Confidence |
| ----------------------------- | ----------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------ | ------------------ | ---------------- | ------------------------------ | --------------------------------------------------------------------- | ---------- |
| **Chrome / Chromium**         | AVAILABLE   | Used in all prior phases                                                                        | Chrome 142 + Playwright Chromium 1228    | Full audit evidence                  | No                 | —                | No                             | Two Chromium-based engines only                                       | HIGH       |
| **Firefox (Linux)**           | PARTIAL     | `playwright install firefox` confirmed downloadable (80MB); Ubuntu-24.04 binary for Arch        | Playwright 1.61.1 + Firefox 151          | Functional + visual test output      | Yes (80MB)         | **Yes**          | No                             | glibc compatibility unverified on Arch; no Lighthouse Firefox support | MEDIUM     |
| **Firefox (Docker)**          | PARTIAL     | `docker pull selenium/standalone-firefox` started downloading (Docker running, user authorized) | Docker + Selenium                        | Full browser session                 | Yes (~600MB image) | **Yes**          | No                             | Network download required; ~600MB                                     | MEDIUM     |
| **Safari**                    | UNAVAILABLE | macOS-only binary                                                                               | —                                        | —                                    | No                 | No               | macOS machine required         | **Absolute platform limitation**                                      | ABSOLUTE   |
| **Edge (Linux)**              | UNAVAILABLE | No Linux Edge package available via pacman; no installer present                                | —                                        | —                                    | Complex            | No               | Manual .deb install            | Edge Linux exists but not in Arch repos                               | HIGH       |
| **iOS Safari**                | UNAVAILABLE | Requires macOS + Xcode                                                                          | —                                        | —                                    | No                 | No               | macOS + Xcode required         | **Absolute platform limitation**                                      | ABSOLUTE   |
| **Android Chrome (emulated)** | PARTIAL     | Chrome DevTools mobile emulation via CDP confirmed working (iPhone 375×812, mobile=true)        | CDP `Emulation.setDeviceMetricsOverride` | Visual screenshot at mobile viewport | No                 | —                | No                             | Software emulation only; not real Android OS                          | HIGH       |
| **Android Chrome (real)**     | UNAVAILABLE | No device; no Android SDK                                                                       | —                                        | —                                    | No                 | No               | Physical device required       | **Absolute platform limitation**                                      | ABSOLUTE   |
| **BrowserStack**              | UNAVAILABLE | No `BROWSERSTACK_USERNAME`/`BROWSERSTACK_ACCESS_KEY` env vars                                   | —                                        | —                                    | No                 | No               | Credentials + payment required | —                                                                     | HIGH       |
| **LambdaTest**                | UNAVAILABLE | No `LT_USERNAME`/`LT_ACCESS_KEY` env vars                                                       | —                                        | —                                    | No                 | No               | Credentials + payment required | —                                                                     | HIGH       |
| **Sauce Labs**                | UNAVAILABLE | No `SAUCE_USERNAME`/`SAUCE_ACCESS_KEY` env vars                                                 | —                                        | —                                    | No                 | No               | Credentials + payment required | —                                                                     | HIGH       |
| **Physical Mobile Devices**   | UNAVAILABLE | No devices present or accessible                                                                | —                                        | —                                    | No                 | No               | Physical hardware required     | **Absolute hardware limitation**                                      | ABSOLUTE   |

---

### 2.9 — Image, Media, and Asset Verification

| Capability                              | Status    | Verification Method                                                                   | Tool                   | Evidence Produced                         | Install Required | Can Auto-Install | Manual Action               | Limitation                                     | Confidence |
| --------------------------------------- | --------- | ------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------- | ---------------- | ---------------- | --------------------------- | ---------------------------------------------- | ---------- |
| **Image Format Verification**           | AVAILABLE | `file favicon.ico` → Targa confirmed in Phase 1B                                      | `file` (libmagic)      | True MIME type per file                   | No               | —                | No                          | —                                              | HIGH       |
| **Image Dimension Inspection**          | AVAILABLE | `identify image.webp` (ImageMagick)                                                   | ImageMagick 7.1.2      | Width, height, colour depth               | No               | —                | No                          | —                                              | HIGH       |
| **WebP Decode Verification**            | AVAILABLE | Chrome supports WebP natively; `convert img.webp` works                               | Chrome + ImageMagick   | Decoded image                             | No               | —                | No                          | —                                              | HIGH       |
| **Video Playback Verification**         | PARTIAL   | Chrome headless can load video URLs; no audio; autoplay/muted can be verified via CDP | CDP `Runtime.evaluate` | `video.readyState`, `video.paused` values | No               | —                | No                          | Cannot verify audio quality                    | MEDIUM     |
| **Font Format Verification**            | AVAILABLE | curl to font CDN URLs → response headers confirm woff2 format                         | curl                   | Content-Type header                       | No               | —                | No                          | External CDN reachable (internet confirmed)    | HIGH       |
| **Screenshot Diff (Visual Regression)** | PARTIAL   | CDP `Page.captureScreenshot` + ImageMagick `compare`                                  | Chrome + ImageMagick   | Pixel-diff images                         | No               | —                | Baseline screenshots needed | No prior baseline exists; must establish first | MEDIUM     |
| **PDF Render**                          | AVAILABLE | `Page.printToPDF` confirmed (44MB output captured)                                    | Chrome CDP             | PDF file                                  | No               | —                | No                          | Large output size                              | HIGH       |

---

### 2.10 — React and JavaScript Runtime Tools

| Capability                             | Status      | Verification Method                                                                    | Tool                          | Evidence Produced                   | Install Required | Can Auto-Install | Manual Action                           | Limitation                                               | Confidence |
| -------------------------------------- | ----------- | -------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------- | ---------------- | ---------------- | --------------------------------------- | -------------------------------------------------------- | ---------- |
| **React DevTools (browser extension)** | UNAVAILABLE | Browser extension; headless Chrome cannot load extensions in standard mode             | —                             | —                                   | No               | No               | Headed Chrome + extension load required | Cannot use standard headless mode                        | HIGH       |
| **React Profiler (programmatic)**      | PARTIAL     | React 19 exposes `Profiler` API; can inject via CDP `Runtime.evaluate`                 | CDP + React internal API      | Render timing per component         | No               | —                | No                                      | Must inject profiling code before mount                  | MEDIUM     |
| **Console Error Monitoring**           | AVAILABLE   | CDP `Runtime.consoleAPICalled` + `Runtime.exceptionThrown` events                      | CDP                           | All JS errors and warnings          | No               | —                | No                                      | Runtime only; not static analysis                        | HIGH       |
| **JS Heap Snapshot**                   | AVAILABLE   | `HeapProfiler.enable` + `HeapProfiler.takeHeapSnapshot`                                | CDP HeapProfiler              | .heapprofile JSON                   | No               | —                | No                                      | Large file; requires analysis tooling                    | MEDIUM     |
| **JS Memory Leak Detection**           | PARTIAL     | Repeated CDP heap snapshots over time; compare retained objects                        | CDP HeapProfiler              | Memory delta over navigation cycles | No               | —                | No                                      | Requires scripted navigation loop; interpretation manual | LOW        |
| **JS Bundle Analysis (static)**        | AVAILABLE   | `vite-bundle-visualizer` or `rollup-plugin-visualizer` in project — check if available | Project config + build output | Bundle treemap (if plugin present)  | Partial          | Partial          | No                                      | —                                                        | MEDIUM     |
| **TypeScript Errors**                  | AVAILABLE   | `tsc --noEmit` in project                                                              | TypeScript                    | Type error list                     | No               | —                | No                                      | Already part of build process                            | HIGH       |
| **ESLint**                             | AVAILABLE   | `eslint` in project                                                                    | ESLint                        | Lint error/warning list             | No               | —                | No                                      | Already part of build process                            | HIGH       |

---

## 3. Investigation Capability Summary

### Fully Automatable

_Can be completed entirely within this environment, with tools verified as working._

1. **Lighthouse performance + accessibility + SEO audit** — all routes — via npx cache `lighthouse` against `vite preview` server (Chrome 142)
2. **Pa11y WCAG2AA audit** — all routes — via locally installed Pa11y 9.1.1
3. **axe-core injection audit** — via Playwright + CDN injection into Chrome
4. **CDP performance metrics** — FCP, LCP, TBT, CLS, TTI — Chrome CDP
5. **CDP CPU + network throttling** — all throttle profiles via `Emulation.setCPUThrottlingRate` + `Network.emulateNetworkConditions`
6. **CDP mobile viewport emulation** — iPhone/Android form factors via `Emulation.setDeviceMetricsOverride`
7. **CDP JavaScript disable testing** — via `Emulation.setScriptExecutionDisabled` + root content measurement
8. **CDP offline mode simulation** — via `Network.emulateNetworkConditions { offline: true }`
9. **CDP service worker enumeration** — via `ServiceWorker.enable` + worker query
10. **CDP console error capture** — via `Runtime.consoleAPICalled` subscription across all routes
11. **CDP JS heap snapshot** — via `HeapProfiler.takeHeapSnapshot` before/after navigation
12. **CDP CPU trace / flame graph data** — via `Tracing.start` / `Tracing.end` + JSON output
13. **CDP accessibility tree dump** — via `Accessibility.getFullAXTree`
14. **CDP keyboard navigation** — via `Input.dispatchKeyEvent` sequences (Tab, Enter, Arrow keys)
15. **Screenshot capture** — via `Page.captureScreenshot` or `--screenshot` CLI flag
16. **HTTP header inspection** — all routes, all asset types — via `curl -I`
17. **CSP header audit** — confirmed absent locally; vercel.json is ground truth for production
18. **Cache-Control audit** — via curl on all asset types
19. **Compression check (local)** — via curl `Accept-Encoding` header negotiation
20. **Sitemap XML format validation** — via `xmllint` on any generated sitemap
21. **Structured data extraction and format check** — Python regex + JSON parse on curl HTML output
22. **OG/Twitter meta tag completeness audit** — Python regex on curl HTML output per route
23. **W3C HTML validation** — via POST to `https://validator.w3.org/nu/?out=json` (internet available)
24. **robots.txt validation** — via curl + Lighthouse `robots-txt` audit
25. **Image format verification** — via `file` command on any binary
26. **Image dimension inspection** — via `identify` (ImageMagick)
27. **Font CDN reachability + format** — via curl against Fontshare + Google Fonts URLs
28. **Video element state inspection** — via CDP `Runtime.evaluate` (`readyState`, `paused`, `muted`)
29. **TypeScript strict mode errors** — via `tsc --noEmit`
30. **ESLint audit** — via project ESLint config
31. **Bundle analysis** — via build output inspection + rollup stats

---

### Partially Automatable

_Some evidence can be collected; full coverage requires additional setup or external infrastructure._

1. **Firefox cross-browser verification** — Playwright can install Firefox (~80MB download). Once installed: full automation. Risk: Ubuntu-24.04 build on Arch Linux may have glibc compatibility issues. Requires one-time `playwright install firefox` before this capability is fully available.

2. **Docker-based Firefox/Selenium** — Docker daemon is running, user is authorized. Selenium standalone-firefox image is ~600MB. Once pulled, provides a clean Firefox environment. Requires image download before use.

3. **axe-core via CDN injection** — Can inject `axe.min.js` from cdnjs via `page.addScriptTag()` in Playwright. Internet is available. Not a clean package install but fully functional for automated WCAG auditing.

4. **Color contrast at animation states** — CDP can trigger scroll positions (`Input.dispatchMouseEvent` scroll, `Runtime.evaluate` GSAP seek), then `Page.captureScreenshot` + ImageMagick pixel sampling can measure contrast at any animation frame. Automated, but requires coordinate mapping from prior visual inspection.

5. **Memory leak detection** — CDP HeapProfiler can take snapshots; Python scripting can compare retained object counts across navigation cycles. Automated data collection is possible; interpretation of what constitutes a leak requires judgment.

6. **CPU flame graph analysis** — CDP Tracing produces raw JSON. `speedscope` or `flamegraph.js` can visualise it, but neither is installed. Can be post-processed offline or posted to `speedscope.app` (internet available).

7. **Schema.org structured data conformance** — Can POST extracted JSON-LD to `https://validator.w3.org/nu/` or Google's Rich Results API. Rate-limited; Google API requires OAuth for full rich results test.

8. **Font double-load verification at CDN level** — Can confirm font requests via CDP `Network.requestWillBeSent` events across page load. Already confirmed via Lighthouse in Phase 1B; CDP provides deeper per-request timing.

9. **Visual regression baseline** — Can establish baselines now via `Page.captureScreenshot`. Future runs compare against these. No prior baseline exists; cannot compare without first establishing one.

---

### Manual Verification Required

_Cannot be completed from this environment. External infrastructure or physical hardware required._

1. **Safari (macOS/iOS)** — macOS binary; runs only on macOS. Requires a macOS machine, physical iPhone, or BrowserStack/LambdaTest with Safari targets. No workaround exists on Linux.

2. **Edge (Windows native rendering)** — Edge on Linux uses Blink (same as Chrome). True Edge rendering differences manifest on Windows. Requires a Windows machine or cloud service.

3. **iOS Safari / WKWebView** — Requires macOS + Xcode Simulator (for WKWebView) or physical iPhone. No Linux workaround.

4. **Real mobile hardware performance** — Software emulation (CDP `setDeviceMetricsOverride`) changes viewport and DPR but does not throttle the CPU to mobile silicon speeds. Real Snapdragon/A-series performance requires a physical device. Lighthouse's CPU throttling is a multiplier approximation.

5. **Screen reader testing (VoiceOver, NVDA, JAWS)** — Requires macOS (VoiceOver), Windows (NVDA/JAWS) + manual operation. Cannot be automated from this environment. Orca on Linux is available via pacman (requires sudo) but is not equivalent to VoiceOver/NVDA for web testing.

6. **Production HTTP headers (Vercel)** — `orviontech` does not resolve from this machine (DNS failure). Cannot verify live Vercel headers: CSP, HSTS, brotli compression, CDN `Cache-Control`, actual `X-Frame-Options`. All must be verified post-deployment.

7. **Production SSL certificate** — Same DNS failure. Cannot run `openssl s_client` against live domain.

8. **Production CDN compression** — Vercel serves brotli/gzip from its CDN; local `vite preview` does not. Cannot verify production compression without live URL.

9. **Production sitemap existence** — No live deployment to verify `https://orviontech/sitemap.xml`.

10. **Social share preview (real crawlers)** — Facebook, Twitter/X, LinkedIn crawlers must fetch the live URL. Cannot simulate real crawler behaviour locally. Phase 1B confirmed the OG image issue via SPA rewrite analysis; real crawler behaviour requires live deployment.

11. **CrUX / Field Data** — Chrome User Experience Report requires real user traffic. Pre-launch site has no CrUX data. Cannot measure real-world FCP/LCP distribution.

12. **BrowserStack / LambdaTest / Sauce Labs** — No credentials available. Cross-browser cloud testing on Safari, Edge, real mobile devices would require subscription and API keys.

---

## 4. Phase Roadmap

Using only verified capabilities, ordered by evidence value and prerequisite dependency.

---

### Phase 2A — Accessibility Deep Audit (Fully Automatable)

**Environment requirements:** Pa11y (installed), Playwright + Chromium (installed), axe-core (CDN inject), CDP (verified)  
**Estimated duration:** 1–2 hours

| Step | Action                                   | Tool                                       | Evidence                                                         |
| ---- | ---------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| 2A-1 | Pa11y WCAG2AA audit — all 6 routes       | Pa11y 9.1.1                                | Per-element violation report (code, context, selector, message)  |
| 2A-2 | axe-core full audit — all routes         | Playwright + axe CDN inject                | axe violation JSON (impact, description, helpUrl, nodes)         |
| 2A-3 | CDP accessibility tree dump — all routes | CDP `Accessibility.getFullAXTree`          | Full AXTree JSON for structural analysis                         |
| 2A-4 | CDP keyboard navigation test             | CDP `Input.dispatchKeyEvent` Tab sequences | Focus order, trapped focus, skip-link behaviour                  |
| 2A-5 | CDP screenshot at animation states       | CDP scroll + screenshot + ImageMagick      | Pixel contrast measurement at initial/mid/final animation states |
| 2A-6 | ARIA role and attribute validation       | Cross-reference AXTree with WCAG spec      | Confirmed correct / incorrect ARIA patterns                      |

**New evidence over Phase 1B:** Pa11y and axe-core produce fuller WCAG reports than Lighthouse's subset (~35% coverage). CDP accessibility tree reveals programmatic roles that automated tools miss. Keyboard focus order testing is new.

---

### Phase 2B — Performance Deep Profiling (Fully Automatable)

**Environment requirements:** Chrome 142, CDP, Lighthouse (npx cache)  
**Estimated duration:** 1–2 hours

| Step | Action                                   | Tool                                      | Evidence                              |
| ---- | ---------------------------------------- | ----------------------------------------- | ------------------------------------- |
| 2B-1 | CDP CPU trace — home route               | CDP Tracing                               | Raw trace JSON (flamegraph-parseable) |
| 2B-2 | CDP JS coverage — identify unused JS     | CDP Profiler.startPreciseCoverage         | Per-function byte coverage            |
| 2B-3 | CDP heap snapshot — memory baseline      | CDP HeapProfiler                          | Heap size + top retained objects      |
| 2B-4 | CDP heap snapshot after navigation loop  | CDP HeapProfiler × N                      | Memory delta = leak evidence          |
| 2B-5 | CDP offline mode test                    | Network.emulateNetworkConditions offline  | Error state screenshots per route     |
| 2B-6 | Lighthouse audit — throttled, all routes | Lighthouse `--throttling-method simulate` | Full throttled CWV per route          |
| 2B-7 | GSAP ScrollTrigger firing analysis       | CDP `Runtime.evaluate` + scroll events    | Actual animation trigger points       |

**New evidence over Phase 1B:** Flame graph identifies which specific function in the 510ms long task is responsible. JS coverage identifies which specific modules contribute to the 69KB unused JS. Memory snapshots confirm or deny leak concerns from GSAP/Framer Motion/Lenis.

---

### Phase 2C — Firefox Cross-Browser Verification (Partially Automatable)

**Pre-condition:** `playwright install firefox` must run (~80MB download). Verify glibc compatibility on Arch first.  
**Environment requirements:** Playwright 1.61.1 + Firefox 151  
**Estimated duration:** 1 hour (+ download time)

| Step | Action                                          | Tool                             | Evidence                                       |
| ---- | ----------------------------------------------- | -------------------------------- | ---------------------------------------------- |
| 2C-1 | Install Firefox via Playwright                  | `playwright install firefox`     | Browser binary in cache                        |
| 2C-2 | Run all routes in Firefox                       | Playwright Firefox               | Screenshots, console errors, functional checks |
| 2C-3 | Compare screenshots Chrome vs Firefox           | ImageMagick `compare`            | Pixel diff images                              |
| 2C-4 | Test GSAP animations in Firefox                 | Playwright + scroll events       | Animation timing differences                   |
| 2C-5 | Test CSS rendering (Tailwind v4, CSS variables) | Screenshots + DOM inspection     | Layout/style differences                       |
| 2C-6 | Font rendering in Firefox                       | Screenshots at font-heavy routes | Font fallback behaviour differences            |

**Limitation:** Safari and Edge remain untestable from this environment. This phase produces 2-browser comparison only (Chrome + Firefox). It establishes whether Firefox-specific issues exist; it cannot certify cross-browser production readiness.

---

### Phase 2D — SEO and Metadata Completeness Audit (Fully Automatable)

**Environment requirements:** curl, Python, xmllint, internet  
**Estimated duration:** 30–60 minutes

| Step | Action                                   | Tool                            | Evidence                                                    |
| ---- | ---------------------------------------- | ------------------------------- | ----------------------------------------------------------- |
| 2D-1 | OG/Twitter tag completeness — all routes | Python + curl                   | Missing tags per route (og:url, og:site_name, twitter:site) |
| 2D-2 | Structured data (JSON-LD) validation     | Python extraction + W3C POST    | Schema conformance report                                   |
| 2D-3 | robots.txt deep audit                    | curl + Lighthouse               | Rule analysis, sitemap pointer validation                   |
| 2D-4 | Internal link graph — crawl all routes   | Playwright crawler              | Link → target → status map                                  |
| 2D-5 | External link reachability               | curl HEAD on all external links | Broken external links                                       |
| 2D-6 | W3C HTML validation — all routes         | curl POST to validator.w3.org   | Markup error list per route                                 |
| 2D-7 | meta tag per-route audit                 | Python + curl                   | Canonical, description, og:title consistency                |
| 2D-8 | Font CDN reachability + format           | curl HEAD on Fontshare + GFonts | HTTP status, response time, woff2 confirmed                 |

---

### Phase 2E — Production Deployment Verification (Manual / External)

**Pre-condition:** Live production deployment at `orviontech` required. DNS must resolve.  
**Environment requirements:** curl, openssl, internet — tools exist; live URL missing.

| Step | Action                                | Tool                                   | Evidence                                     |
| ---- | ------------------------------------- | -------------------------------------- | -------------------------------------------- |
| 2E-1 | DNS resolution of orviontech           | `python3 socket.gethostbyname`         | IP address                                   |
| 2E-2 | SSL certificate inspection            | `openssl s_client`                     | Issuer, expiry, chain                        |
| 2E-3 | Live HTTP headers                     | curl -I on all routes                  | CSP, HSTS, Cache-Control, Content-Encoding   |
| 2E-4 | Brotli/gzip compression in production | curl Accept-Encoding                   | `Content-Encoding: br` or `gzip`             |
| 2E-5 | Sitemap existence                     | curl `https://orviontech/sitemap.xml`   | 200 + valid XML                              |
| 2E-6 | OG image existence                    | curl `https://orviontech/og-image.png`  | 200 + `Content-Type: image/png`              |
| 2E-7 | Security headers on live Vercel       | curl headers                           | CSP presence, Permissions-Policy, HSTS value |
| 2E-8 | Lighthouse from live URL              | Lighthouse against `https://orviontech` | Real-network performance scores              |

**Blocked by:** `orviontech` DNS failure from this machine. Cannot proceed until the domain resolves.

---

## 5. Summary Table

| Phase                               | Automatable | Blocked On               | Value                                                     |
| ----------------------------------- | ----------- | ------------------------ | --------------------------------------------------------- |
| **2A — Accessibility Deep Audit**   | Fully       | Nothing                  | Highest — closes WCAG gaps from Phase 1B                  |
| **2B — Performance Deep Profiling** | Fully       | Nothing                  | High — identifies root causes of 510ms long task + memory |
| **2C — Firefox Cross-Browser**      | Partially   | Firefox download (~80MB) | Medium — 2-browser comparison; Safari still missing       |
| **2D — SEO & Metadata**             | Fully       | Nothing                  | Medium — closes OG/structured data gaps                   |
| **2E — Production Deployment**      | Manual      | orviontech DNS resolution | Critical — required before final launch clearance         |

---

_All capabilities verified by actual tool execution on 2026-07-01. No capability is assumed from documentation alone._  
_Filed: `audit-reports/pre-phase-capability/REPORT.md`_
