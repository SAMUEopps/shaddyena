import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { TransactionType, TransID, TransAmount, MSISDN, BillRefNumber } = req.body;

    console.log("[INFO] C2B request received:", req.body);

    // ---- Backend validation example ----
    const isValidAccount = true; // Check BillRefNumber in your DB
    const expectedAmount = 500;   // Optional: check amount

    if (!isValidAccount || TransAmount <= 0 || TransAmount !== expectedAmount) {
      console.warn("[WARN] Payment rejected:", req.body);
      return res.status(200).json({ ResultCode: 1, ResultDesc: "Rejected" });
    }

    // ---- Save payment to DB here ----
    console.log("[SUCCESS] Payment accepted:", req.body);

    // Respond to Safaricom
    return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error: any) {
    console.error("[ERROR] C2B webhook failed:", error.message);
    return res.status(500).json({ ResultCode: 1, ResultDesc: "Internal Server Error" });
  }
}
