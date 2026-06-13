# 🧱 Axera - FCA

## Contributing

You may contribute by contacting us at *[axera-team@protonmail.com](mailto:axera-team@protonmail.com)*.

## Description

> This is the incoming FB Chat API published by the Axera Team.

## What To Expect?

> This source code is experimental and is not yet complete but shows part of the structure of the incoming FCA. (Facebook Client API)

## Features

- Event-driven architecture
- Full TypeScript support  
- Multiple API interfaces

## Event-Driven

> CommonJS

```js
// sample
const login = require('axera-fca').events;

// attach login listener
login.on("login:success", ({ api }) => {
  console.log("Ready");
  
  //extend bot logic from here
});

// start login process
login.start(cookie);
```

> ESM / TypeScript

```js
// sample
import login from 'axera-fca';
```

## Async/Await

```js
// sample 2
const login = require('axera-fca').async;

async function main() {
  const api = await login.start(cookie);
  //extend bot logic from here
}
```

## Callback

```js
// sample 3
const login = require('axera-fca').callback;

login.start(cookie, async function callback(error, api) {
  // extend bot logic from here
});
```

## ⚠️ Disclaimer

**This project is not affiliated with, authorized by, or endorsed by Meta/Facebook.**
**This project is maintained by the open-source community and the brilliant minds behind the Axera Team.**

This is an unofficial project. Use responsibly and at your own risk.

- For educational, security research, and technical education, and personal purposes only
- Not intended to be used or sold as a commercial product or service
- Queues have been implemented to reduce API calls and abuse
- Security features are being put in place to ensure responsible use
- Purely benevolent intentions inspired the making of this project
- No abuse is intended nor encouraged in this library
- By using this library, you acknowledge that the authors are not responsible for any misuse, unexpected account problems, or violations that might arise thereof
- You are expected to never use your accounts with important contacts with this library to prevent problems
- This library may stop working at any time due to Facebook API changes
- Updates will be provided as time allows, though Facebook's changes may outpace maintenance
