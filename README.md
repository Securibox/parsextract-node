parsextract-node
==============
[![NPM Version][npm-image]][npm-url]

A node.js client library for the [Securibox ParseXtract API][1]

## Install
```console
$ npm install parsextract
```

## Parsing a document
```javascript
const ParseXtract = require('parsextract');

var client = new ParseXtract.Client("Client_Id", "Client_Secret");
let base64EncodedFile = fs.readFileSync('C:\\Path\\To\\file.pdf', { encoding: 'base64' });
client.parse({
    fileName: 'file.pdf',
    base64Content: base64EncodedFile
}, function(err, res){
    if(err !== null || err !== undefined){
        throw err;
    }
    console.log(res);
});
```

## Callbacks
All callbacks are in the form:
```javascript
function callback(err, response) {
  // err can be a network error or a Securibox API error.
}
```

## License
[GNU GPL][2]

[1]: https://sca.securibox.eu
[2]: https://github.com/Securibox/parsextract-node/blob/master/LICENSE