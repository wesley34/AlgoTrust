const document = require("./document/document.json");
const { getData } = require("@govtechsg/open-attestation");

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
    const documentData = getData(document);
    // todo : compare the hashed document data with merkle root, hast target and proof
    if (documentData.name !== "Certificate of Completion") {
      return {
        type: "DOCUMENT_INTEGRITY",
        name: "CustomVerifier",
        data: documentData.name,
        reason: {
          code: 1,
          codeString: "INVALID_NAME",
          message: `Document name is ${documentData.name}`
        },
        status: "INVALID"
      };
    }
    return {
      type: "DOCUMENT_INTEGRITY",
      name: "CustomVerifier",
      data: documentData.name,
      status: "VALID"
    };
  }
};


const customVerificationBuilder  = () =>{
  if (customVerifier.test(document)) {
    return customVerifier.verify(document);
  }
  return customVerifier.skip(document);
}

customVerificationBuilder().then(console.log).catch(console.log);

