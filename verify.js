const document = require("./document/document.json");
const { algorandApi } = require('./algorandApi.js')
const { getData,verifySignature } = require("@govtechsg/open-attestation");
const algosdk = require('algosdk');







// our custom verifier will be valid only if the document version is not https://schema.openattestation.com/2.0/schema.json
const customVerifier = {
  skip: async () => {
    return {
      status: "SKIPPED",
      type: "DOCUMENT_INTEGRITY",
      name: "CustomVerifier",
      reason: {
        code: 0,
        codeString: "SKIPPED",
        message: `Document doesn't have version equal to 'https://schema.openattestation.com/2.0/schema.json'`
      }
    };
  },
  test: () => document.version === "https://schema.openattestation.com/2.0/schema.json",
  verify: async document => {
    

    var isTampered = verifySignature(document) === true;
    const documentData = getData(document);

    if (!isTampered ) {
      return {
        type: "DOCUMENT_INTEGRITY",
        name: "CustomVerifier",
        data: documentData.name,
        reason: {
          code: 1,
          codeString: "TAMPERED",
          message: `Document name is ${documentData.name}`
        },
        status: "INVALID"
      };
    }

    var hashedMerkleroot = algosdk.encodeObj(document.signature.merkleRoot);
    var isExist = await algorandApi(hashedMerkleroot);
    
    

    
    if (!isExist){
    return {
      type: "DOCUMENT_INTEGRITY",
      name: "CustomVerifier",
      data: documentData.name,
      reason: {
        code: 2,
        codeString: "INVALID_MERKLE_ROOT",
        message: `Document name is ${documentData.name}`
      },
      status: "INVALID"
    };
  }
  else{
    return {
      type: "DOCUMENT_INTEGRITY",
      name: "CustomVerifier",
      data: documentData.name,
      status: "VALID"
      };
    }

  }
};


const customVerificationBuilder  = () =>{
  if (customVerifier.test(document)) {
    return customVerifier.verify(document);
  }
  return customVerifier.skip(document);
}

customVerificationBuilder().then(console.log).catch(console.log);

