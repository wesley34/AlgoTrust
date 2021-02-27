const document = require("./document/wrapped-document.json");


const util = require("util");
const algosdk = require('algosdk');

const { wrapDocuments, verifySignature} = require("@govtechsg/open-attestation");

// wrap in list form for further dynamic approach
const wrappedDocuments = wrapDocuments([document]);
// for loop added later 
var jsonFile = util.inspect(wrappedDocuments[0], { showHidden: false, depth: null });


// to be returned
console.log(wrappedDocuments[0].signature.merkleRoot); 