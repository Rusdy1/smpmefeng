import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Midtrans configuration
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || 'Mid-server-nCgNR3ffBCgrEW-TkweGtVjn';
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || 'Mid-client-oqxBD1Wz2j5iydLM';
const IS_PRODUCTION = !MIDTRANS_SERVER_KEY.startsWith('SB-');

const SNAP_API_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

const MIDTRANS_API_URL = IS_PRODUCTION
  ? 'https://api.midtrans.com/v2'
  : 'https://api.sandbox.midtrans.com/v2';

// API: Check Midtrans Config
app.get('/api/midtrans/config', (_req, res) => {
  res.json({
    clientKey: MIDTRANS_CLIENT_KEY,
    isProduction: IS_PRODUCTION,
    feeAmount: 200000,
    snapUrl: IS_PRODUCTION
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'
  });
});

// API: Create Snap Transaction
app.post('/api/midtrans/create-transaction', async (req, res) => {
  try {
    const { orderId, grossAmount = 200000, customerDetails, itemDetails } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const authHeader = `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')}`;

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(grossAmount) || 200000
      },
      customer_details: {
        first_name: customerDetails?.firstName || 'Calon Siswa',
        email: customerDetails?.email || '',
        phone: customerDetails?.phone || ''
      },
      item_details: itemDetails || [
        {
          id: 'PPDB-SMP-MEFENG',
          price: Number(grossAmount) || 200000,
          quantity: 1,
          name: 'Biaya Pendaftaran Siswa Baru SMP MEFENG'
        }
      ],
      callbacks: {
        finish: `${req.headers.origin || ''}/`
      }
    };

    const midtransRes = await fetch(SNAP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    });

    const data = (await midtransRes.json()) as any;

    if (!midtransRes.ok) {
      console.error('Midtrans error response:', data);
      return res.status(midtransRes.status).json({
        error: data.error_messages ? data.error_messages.join(', ') : 'Gagal membuat transaksi Midtrans',
        details: data
      });
    }

    return res.json({
      token: data.token,
      redirect_url: data.redirect_url,
      orderId
    });
  } catch (err: any) {
    console.error('Error creating Midtrans transaction:', err);
    return res.status(500).json({
      error: err.message || 'Internal server error connecting to Midtrans'
    });
  }
});

// API: Check Transaction Status
app.get('/api/midtrans/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const authHeader = `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')}`;

    const midtransRes = await fetch(`${MIDTRANS_API_URL}/${orderId}/status`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader
      }
    });

    const data = await midtransRes.json();
    return res.status(midtransRes.status).json(data);
  } catch (err: any) {
    console.error('Error checking Midtrans status:', err);
    return res.status(500).json({ error: err.message || 'Gagal memeriksa status pembayaran Midtrans' });
  }
});

// API: Webhook Notification Callback from Midtrans
app.post('/api/midtrans/notification', (req, res) => {
  const notification = req.body;
  console.log('Received Midtrans notification:', notification?.order_id, notification?.transaction_status);
  return res.json({ status: 'ok' });
});

// Vite middleware for development vs static build for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
