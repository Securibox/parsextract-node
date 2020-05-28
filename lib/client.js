"use strict";

var R = require('ramda');
var request = require('request');
var hmacSHA256 = require('crypto-js/hmac-sha256');
var md5 = require('crypto-js/md5');
var Base64 = require('crypto-js/enc-base64');

/**
 * `Client` constructor.
 *
 * @api public
 */
function Client(clientId, clientSecret) {
    this._clientId = clientId;
    this._clientSecret = clientSecret;
}

function generateHexString(length) {
    var ret = "";
    while (ret.length < length) {
      ret += Math.random().toString(16).substring(2);
    }
    return ret.substring(0,length);
  }

Client.prototype._authenticatedRequest = function(options, callback) {

    let requestUri = options.uri;
    let requestHttpMethod = options.method;
    let dateNow = new Date(Date.UTC()).getTime();
    let date1970 = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0)).getTime();
    
    let timeSpan = dateNow - date1970;
    
    let requestTimeStamp = new Date(timeSpan).getTime() / 1000;
    
    let nonce = generateHexString(32);
    var hash = md5(JSON.stringify(options.body));
    let requestContentBase64String = Base64.stringify(hash);

    let signatureRawData = `${this._clientId}${requestHttpMethod}${requestUri}${requestTimeStamp}${nonce}${requestContentBase64String}`;

    let secretKeyByteArray = Base64.parse(this._clientSecret);
    
    let signatureBytes = hmacSHA256(signatureRawData, secretKeyByteArray);
    let requestSignatureBase64String = Base64.stringify(signatureBytes);
    
    let authorizationHeader = `${this._clientId}:${requestSignatureBase64String}:${nonce}:${requestTimeStamp}`;
    let $requestOptions = {
        uri: options.uri,
        method: options.method,
        json: true,
        headers : {
            "Authorization" : "hmacauth " + authorizationHeader
        }
    };
    

    if (options.body != null) {
        $requestOptions = R.assoc('body', options.body, $requestOptions);
    }
    //console.log($requestOptions);

    request($requestOptions, function(err, res, $body) {
        if (err != null) {
        callback(err, null);
        } else if (res.statusCode !== 200) {
        callback(R.assoc('statusCode', res.statusCode, $body), null);
        } else {
            if(!R.is(Object, $body)){
                $body = JSON.parse($body);
            }
            if(R.is(Array, $body.XData)){
                $body.XData = $body.XData.map(function(elem){
                    if(elem.Name.toLowerCase().endsWith('.table'))
                        elem.Value = JSON.parse(elem.Value);
                    return elem;
                });
            }
                
        callback(null, $body);
        }
    });
};

Client.prototype.parse = function(document, callback){
    this._authenticatedRequest({
        uri: 'https://px-api.securibox.eu/api/parse',
        method: 'POST',
        body: document
    }, callback);
};

module.exports = Client;