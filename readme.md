# express-escher [![Build Status](https://travis-ci.org/wolfika/express-escher.svg?branch=master)](https://travis-ci.org/wolfika/express-escher) [![Coverage Status](https://coveralls.io/repos/github/wolfika/express-escher/badge.svg?branch=master)](https://coveralls.io/github/wolfika/express-escher?branch=master)

> Express middleware to validate requests signed by [Escher](https://escherauth.io/)

## Install

### Yarn

```
$ yarn add express-escher
```

### NPM

```
$ npm install --save express-escher
```

## Usage

### Protect all endpoints

```javascript
const express = require('express');
const app = express();
const expressEscher = require('express-escher');

const keyDb = clientKey => 'TheBeginningOfABeautifulFriendship';

app.use(expressEscher({
  credentialScope: 'example/credential/scope',
  keyDb
}));

app.get('/checkout', (req, res) => {
  res.json({success: true});
});

app.listen(3000, () => {
  console.log('Express server is running on port 3000.');
});
```

### Protect only specific endpoints

```javascript
const express = require('express');
const app = express();
const expressEscher = require('express-escher');

const keyDb = clientKey => 'TheBeginningOfABeautifulFriendship';

const isAuthenticated = (req, res, next) => {
  return expressEscher({
    credentialScope: 'example/credential/scope',
    keyDb
  })(req, res, next);
};

app.get('/checkout', isAuthenticated, (req, res) => {
  res.json({success: true});
});

app.listen(3000, () => {
  console.log('Express server is running on port 3000.');
});

```

## API

### expressEscher(options)

Returns the authentication middleware function.

#### options

Type: `Object`

A collection of options for configuring both the middleware and Escher itself.

##### credentialScope

Type: `string`<br>
Default: `''`

A slash separated service constant and hierarchical ID, containing the service’s scope. See details in [Escher spec](https://escherauth.io/specification.html#date-and-credential-scope).

##### keyDB

Type: `function`

A function, which takes a `clientKey` as an argument, and returns a client
secret, if found. Ideally, this can be hooked up to a database, or just a
simple collection of client keys/secrets.

##### Escher

Type: `function`<br>
Default: `require('escher-auth')`

Swappable Escher implementation.


## License

MIT © [Máté Farkas](https://github.com/wolfika)
