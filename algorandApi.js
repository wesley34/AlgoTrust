const axios = require('axios');

const client = axios.create({
  baseURL: 'https://testnet-algorand.api.purestake.io/idx2',
  timeout: 5000,
  headers: {'x-api-key': 'oDREhlbnSE57kEK5cprrW2CoXwQRiVb11ML0H1H5'}
});


async function algorandApi(merkleRoot) {
  try {
    const resp = await client.request({
      url: "/v2/accounts/7XD2M4ED47OPNTWGSIZSJCYCOQR337NZG5HTBS77WWAY5R7XNPHKIHAXSE/transactions",
      method: "GET"
    });
    const dataLenght = resp.data.transactions.length;
    for (var i = 0; i<dataLenght;i++){
      if (merkleRoot == resp.data.transactions[i].note){
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error(err)
  }
}



module.exports = {
  algorandApi
}