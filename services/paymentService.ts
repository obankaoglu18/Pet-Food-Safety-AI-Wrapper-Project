
/**
 * Mock Service to simulate Mobile Payment Processing (iOS StoreKit style)
 */

export interface PurchaseResult {
  success: boolean;
  error?: 'CANCELLED' | 'NETWORK' | 'UNKNOWN';
}

export const paymentService = {
  isProcessing: false,

  /**
   * Simulates the full purchase flow with robust error handling.
   * NOTE: For real implementation, integrate with:
   * - RevenueCat (recommended for React Native/Capacitor)
   * - Stripe (for pure web)
   * - StoreKit / Google Play Billing (for native)
   */
  processPurchase: async (planId: string): Promise<PurchaseResult> => {
    if (paymentService.isProcessing) return { success: false, error: 'UNKNOWN' };
    paymentService.isProcessing = true;

    console.group('📱 Payment Flow Triggered');
    
    try {
      // Step 1: Initialize Transaction
      console.log(`[StoreKit] Initializing transaction for product: ${planId}...`);
      await delay(1000);

      // SIMULATION: Randomly fail for robustness testing (5% chance of network error)
      if (Math.random() < 0.05) {
        console.error('[StoreKit] Network timeout.');
        throw new Error('NETWORK');
      }

      // Step 2: Simulate User Biometric Auth
      console.log('[StoreKit] UI: Prompting user for FaceID...');
      await delay(1500);

      // SIMULATION: Randomly user cancels (10% chance)
      if (Math.random() < 0.1) {
        console.warn('[StoreKit] User cancelled the dialog.');
        return { success: false, error: 'CANCELLED' };
      }

      console.log('[StoreKit] ✅ User authenticated successfully.');

      // Step 3: Simulate App Store Processing
      console.log('[App Store] Processing payment...');
      await delay(1500);
      const mockReceipt = "MIAGCSqGSIb3DQEHAqCAMIACAQExCzA...";
      console.log('[StoreKit] ✅ Transaction completed. Receipt generated.');

      // Step 4: Backend Verification (The "Server-side" logic)
      console.log('--- Handing off to Backend ---');
      await verifyReceiptOnBackend(mockReceipt, planId);
      
      return { success: true };

    } catch (e: any) {
      console.error('[Payment] Transaction failed', e);
      return { success: false, error: e.message === 'NETWORK' ? 'NETWORK' : 'UNKNOWN' };
    } finally {
      paymentService.isProcessing = false;
      console.groupEnd();
    }
  },

  restorePurchases: async (): Promise<boolean> => {
    if (paymentService.isProcessing) return false;
    paymentService.isProcessing = true;

    try {
      console.group('📱 iOS Restore Purchases');
      console.log('[StoreKit] Querying App Store for past transactions...');
      await delay(2000);
      // Mock: 30% chance they have a previous purchase
      const hasPurchase = Math.random() < 0.3;
      
      if (hasPurchase) {
          console.log('[StoreKit] Found valid transaction!');
          return true;
      }
      
      console.log('[StoreKit] No active subscriptions found for this Apple ID.');
      return false;
    } finally {
      paymentService.isProcessing = false;
      console.groupEnd();
    }
  }
};

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Backend Logic
async function verifyReceiptOnBackend(receipt: string, planId: string) {
  console.log(`[Backend API] POST /api/v1/verify-receipt`);
  console.log(`[Backend] Validating receipt signature...`);
  await delay(800);
  console.log(`[Backend] Granting 'PRO' entitlement for user.`);
  return { success: true };
}
