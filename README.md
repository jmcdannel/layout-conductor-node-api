> [!IMPORTANT]
> **This project has moved.** Active development of DEJA.js and the Track & Trestle model
> railroad platform now happens in private repositories under
> [**Track and Trestle Technology, LLC**](https://github.com/trackandtrestle).
> This repository stays public as a historical snapshot and is no longer maintained.
>
> **Current product, docs, and downloads → [dejajs.com](https://dejajs.com)**

# 🔌 Layout Conductor — Node WebSocket API

**Minimal Node.js WebSocket server for realtime model railroad control.**

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
</p>

A deliberately small replacement for the HTTP polling in
[`layout-conductor-api`](https://github.com/jmcdannel/layout-conductor-api): clients open a
socket, send `{ action, payload }` messages, and get state pushed back the moment hardware
changes — no polling loop, no perceptible throttle lag.

## 🧱 Design

```js
ws.on('message', (data) => {
  const msg = JSON.parse(data)        // { action, payload }
  const res = reduce(msg)             // pure-ish dispatch, one place
  if (res) ws.send(JSON.stringify({ action: msg.action, payload: res }))
})
```

A single **reducer** (`reducer.mjs`) owns every state transition and fans out to hardware
modules under `modules/`, borrowing the Redux dispatch pattern for a server. Adding a new
piece of hardware means adding one module and one case, not a new endpoint, route, and
client fetch.

| File | Role |
|------|------|
| `main.mjs` | WebSocket server, connection lifecycle, message envelope |
| `reducer.mjs` | Action dispatch — the single source of state transitions |
| `modules/` | Hardware adapters (turnouts, locos, effects) |
| `config/` | Layout and device definitions |

## 🧑‍💻 Running it

```bash
yarn install
node main.mjs     # ws://localhost:8080
```

## 📌 Status

Proof of concept. The message-envelope and reducer ideas survived; the transport was later
replaced by MQTT in the
[Track and Trestle Suite](https://github.com/jmcdannel/Track-and-Trestle-Technology-Suite)
and by Firebase RTDB in [DEJA.js](https://github.com/jmcdannel/DEJA.js).

## 🧭 Where this fits

This repo is one step in a long-running line of model railroad control software:

| Era | Project | What changed |
|-----|---------|--------------|
| 2020 | [`train-control`](https://github.com/jmcdannel/train-control) | First React throttle, JMRI + Arduino over HTTP |
| 2021 | [`dctc`](https://github.com/jmcdannel/dctc) | Standalone Arduino DC controller (no computer required) |
| 2022–23 | [`layout-conductor-*`](https://github.com/jmcdannel?tab=repositories&q=layout-conductor) | Split into app + API; Python, Node, and Deno backends explored |
| 2024 | [`Track-and-Trestle-Technology-Suite`](https://github.com/jmcdannel/Track-and-Trestle-Technology-Suite) | MQTT-based monorepo: dispatcher, throttle, dashboard, action API |
| 2024–25 | [`DEJA.js`](https://github.com/jmcdannel/DEJA.js) | TypeScript/Turborepo rewrite, Firebase realtime backbone |
| 2025– | **[dejajs.com](https://dejajs.com)** (private) | Commercial cloud platform for DCC-EX |

---

<sub>Built by [Josh McDannel](https://github.com/jmcdannel) · [dejajs.com](https://dejajs.com) · [LinkedIn](https://www.linkedin.com/in/jmcdannel)</sub>
