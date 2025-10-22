import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Email functionality has been removed as per requirements

/**
 * Simple health check function
 * Can be used to verify Cloud Functions are working
 */
export const healthCheck = functions.https.onRequest(async (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'FatCow Digital Reports API is running',
    timestamp: new Date().toISOString(),
  });
});
