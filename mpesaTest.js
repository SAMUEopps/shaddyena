import axios from "axios";

const BASE_URL = "https://shaddyena.onrender.com"; // your deployed server
//const BASE_URL = "http://localhost:3000/";
// Fake data (looks like Safaricom's real callback body)
const testPayload = {
  TransactionType: "Pay Bill",
  TransID: "TEST123456",
  TransTime: "20250916235959",
  TransAmount: "100.00",
  BusinessShortCode: "4184219",
  BillRefNumber: "0IMCZM", // replace with a real draft ref if you want
  InvoiceNumber: "",
  OrgAccountBalance: "1000.00",
  ThirdPartyTransID: "",
  MSISDN: "254700123456",
  FirstName: "SAMUEL",
  AccountNumber: "0IMCZM", // included for validation
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
