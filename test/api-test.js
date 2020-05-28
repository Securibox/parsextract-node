const fs = require('fs');
const assert = require('assert');
const ParseXtract = require('../lib');
const R = require('ramda');

var eq = assert.strictEqual;

var client = new ParseXtract.Client("Client_Id", "Client_Secret");

describe('Parse', function(){
    it('Parse document', function(done){
        let base64EncodedFile = fs.readFileSync('C:\\Path\\To\\file.pdf', { encoding: 'base64' });
        client.parse({
            fileName: 'file.pdf',
            base64Content: base64EncodedFile
        }, function(err, res){
            eq(err, null);
            assert(R.is(Object, res));
            
            console.log(res);

            done();
        });
    });
});