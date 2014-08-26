authr-express-example
=====
## Introduction
This is a working example of [authr](https://www.npmjs.org/package/authr) using the default nedb adapter, express, and passportjs.

This example currently works with authr versions >=0.3.0

## Usage

1. Clone this repo

2. Install dependencies using `npm install`

3. Run the example using `node app.js`

4. Visit http://localhost:8888

5. Test

The nedb, mongodb, and sql adapters are all included, so if you wish to try those, you can simply:

1. Install the appropriate database (e.g., mongodb or mysql) and start it
2. Edit app.js and change the configuration to use the adapter you choose
3. Run app.js and run through the signup/login process