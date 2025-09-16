/*import axios from "axios";

const BASE_URL = "https://shaddyena.onrender.com"; // your deployed server
//const BASE_URL = "http://localhost:3000/";
// Fake data (looks like Safaricom's real callback body)
const testPayload = {
  TransactionType: "Pay Bill",
  TransID: "TEST123456",
  TransTime: "20250916235959",
  TransAmount: "100.00",
  BusinessShortCode: "4184219",
  BillRefNumber: "A661BA", // replace with a real draft ref if you want
  InvoiceNumber: "",
  OrgAccountBalance: "1000.00",
  ThirdPartyTransID: "",
  MSISDN: "254700123456",
  FirstName: "SAMUEL",
  AccountNumber: "A661BA", // included for validation
  Amount: "100"
};

async function runTests() {
  try {
    console.log("🚀 Sending test to VALIDATION...");
    const validationRes = await axios.post(`${BASE_URL}/api/validation`, testPayload);
    console.log("✅ VALIDATION response:", validationRes.data);

    console.log("\n🚀 Sending test to CONFIRMATION...");
    const confirmationRes = await axios.post(`${BASE_URL}/api/confirmation`, testPayload);
    console.log("✅ CONFIRMATION response:", confirmationRes.data);

  } catch (err) {
    console.error("🔥 Test failed:", err.response?.data || err.message);
  }
}

runTests();
*/


import axios from "axios";

const BASE_URL = "https://shaddyena.onrender.com"; // deployed server
// const BASE_URL = "http://localhost:3000"; // local testing

// 🔥 Use data from your draft
const testPayload = {
  TransactionType: "Pay Bill",
  TransID: "TEST987654",              // fake transaction ID
  TransTime: "20250916235959",        // fake timestamp
  TransAmount: "1.00",                // must match totalAmount in draft
  BusinessShortCode: "4184219",       // your PayBill/Till
  BillRefNumber: "2PAKBT",            // ⬅️ draft.shortRef
  InvoiceNumber: "",
  OrgAccountBalance: "1000.00",
  ThirdPartyTransID: "",
  MSISDN: "254700123456",             // fake customer phone
  FirstName: "SAMUEL",
  AccountNumber: "2PAKBT",            // ⬅️ same as shortRef
  Amount: "1"                         // same as totalAmount
};

async function runTests() {
  try {
    console.log("🚀 Sending test to VALIDATION...");
    const validationRes = await axios.post(`${BASE_URL}/api/validation`, testPayload);
    console.log("✅ VALIDATION response:", validationRes.data);

    console.log("\n🚀 Sending test to CONFIRMATION...");
    const confirmationRes = await axios.post(`${BASE_URL}/api/confirmation`, testPayload);
    console.log("✅ CONFIRMATION response:", confirmationRes.data);

  } catch (err) {
    console.error("🔥 Test failed:", err.response?.data || err.message);
  }
}

runTests();
