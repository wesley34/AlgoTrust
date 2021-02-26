const { wrapDocuments } = require("@govtechsg/open-attestation");
const document = require("./document/document.json");
const util = require("util");

const wrappedDocuments = wrapDocuments([document, document]);

console.log(util.inspect(wrappedDocuments, { showHidden: false, depth: null }));