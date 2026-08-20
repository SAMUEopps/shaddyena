import Balance from '@/shd-models/models/Balance';
import BalanceLog from '@/shd-models/models/BalanceLog';


export class BalanceCallbackHandler {
  /**
   * Handle balance query callback from M-Pesa
   */
  async handle(callbackData: any): Promise<boolean> {
    try {
      console.log('=== 📊 BALANCE RESULT WEBHOOK ===');
      console.log('Received balance result:', JSON.stringify(callbackData, null, 2));

      // Extract data from Safaricom callback
      const resultCode = callbackData.ResultCode;
      const resultDesc = callbackData.ResultDesc;
      const conversationID = callbackData.ConversationID;
      const originatorConversationID = callbackData.OriginatorConversationID;
      const transactionID = callbackData.TransactionID;

      // Parse the balance from the response
      let balanceData = null;
      let accountBalance = null;

      if (callbackData.ResultParameters && callbackData.ResultParameters.ResultParameter) {
        const params = callbackData.ResultParameters.ResultParameter;

        // Find the balance parameter
        if (Array.isArray(params)) {
          const balanceParam = params.find((p: any) => p.Key === 'AccountBalance');
          if (balanceParam) {
            balanceData = balanceParam.Value;

            // Parse balance - format: "Working Account|Amount|Currency"
            if (balanceData) {
              const parts = balanceData.split('|');
              if (parts.length >= 2) {
                accountBalance = {
                  accountName: parts[0] || 'Working Account',
                  amount: parseFloat(parts[1]) || 0,
                  currency: parts[2] || 'KES',
                  fullBalance: balanceData,
                };
              }
            }
          }
        }
      }

      console.log('📊 Parsed Balance:', accountBalance);

      // Update balance log if conversation ID exists
      if (conversationID) {
        await BalanceLog.findOneAndUpdate(
          { conversationID },
          {
            status: resultCode === '0' ? 'SUCCESS' : 'FAILED',
            resultCode,
            resultDesc,
            timestamp: new Date(),
          }
        );
      }

      // Store the balance in MongoDB
      if (accountBalance && resultCode === '0') {
        const balance = await Balance.create({
          shortcode: callbackData.PartyA || process.env.MPESA_SHORTCODE || '174379',
          accountName: accountBalance.accountName,
          balance: accountBalance.amount,
          currency: accountBalance.currency,
          fullBalance: accountBalance.fullBalance,
          resultCode,
          resultDesc,
          conversationID,
          originatorConversationID,
          transactionID,
          timestamp: new Date(),
        });

        console.log('✅ Balance stored successfully:', {
          id: balance._id,
          amount: accountBalance.amount,
          account: accountBalance.accountName,
        });

        return true;
      } else {
        console.log('⚠️ Balance query failed or no balance data:', {
          resultCode,
          resultDesc,
          hasBalance: !!accountBalance
        });

        // Store failed balance attempt
        await Balance.create({
          shortcode: callbackData.PartyA || process.env.MPESA_SHORTCODE || '174379',
          accountName: 'Unknown',
          balance: 0,
          currency: 'KES',
          fullBalance: balanceData || 'No balance data',
          resultCode: resultCode || '1',
          resultDesc: resultDesc || 'Balance query failed',
          conversationID,
          originatorConversationID,
          transactionID,
          timestamp: new Date(),
        });

        return false;
      }

    } catch (error) {
      console.error('❌ Balance callback handler error:', error);
      return false;
    }
  }
}