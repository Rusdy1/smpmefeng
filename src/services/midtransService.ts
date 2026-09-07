declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export interface MidtransCustomerDetails {
  firstName: string;
  email: string;
  phone: string;
}

export interface MidtransTransactionResponse {
  token: string;
  redirect_url: string;
  orderId: string;
}

export const REGISTRATION_FEE = 200000; // Rp 200.000

/**
 * Ensures the Midtrans Snap script is loaded on the page
 */
export function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('midtrans-snap-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Gagal memuat script Midtrans Snap')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'midtrans-snap-script';
    // Using production Snap script matching client key Mid-client-oqxBD1Wz2j5iydLM
    script.src = 'https://app.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'Mid-client-oqxBD1Wz2j5iydLM');
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Gagal memuat script Midtrans Snap. Periksa koneksi internet Anda.'));

    document.head.appendChild(script);
  });
}

/**
 * Creates a Midtrans Snap transaction token via our backend /api/midtrans/create-transaction
 */
export async function createRegistrationTransaction(params: {
  orderId: string;
  customerDetails: MidtransCustomerDetails;
  grossAmount?: number;
}): Promise<MidtransTransactionResponse> {
  const amount = params.grossAmount || REGISTRATION_FEE;

  const response = await fetch('/api/midtrans/create-transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      orderId: params.orderId,
      grossAmount: amount,
      customerDetails: params.customerDetails,
      itemDetails: [
        {
          id: 'PPDB-SMP-MEFENG',
          price: amount,
          quantity: 1,
          name: 'Biaya Pendaftaran Siswa Baru SMP MEFENG'
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Midtrans API error status ${response.status}`);
  }

  return await response.json();
}

/**
 * Check transaction status from Midtrans API
 */
export async function checkTransactionStatus(orderId: string): Promise<any> {
  const response = await fetch(`/api/midtrans/status/${encodeURIComponent(orderId)}`);
  if (!response.ok) {
    throw new Error('Gagal mendapatkan status transaksi dari Midtrans');
  }
  return await response.json();
}

export interface SnapCallbacks {
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}

/**
 * Launch Midtrans Snap payment popup
 */
export async function payWithSnap(
  token: string,
  callbacks?: SnapCallbacks
): Promise<void> {
  await loadSnapScript();

  if (window.snap && typeof window.snap.pay === 'function') {
    window.snap.pay(token, {
      onSuccess: callbacks?.onSuccess || ((r) => console.log('Payment success:', r)),
      onPending: callbacks?.onPending || ((r) => console.log('Payment pending:', r)),
      onError: callbacks?.onError || ((e) => console.error('Payment error:', e)),
      onClose: callbacks?.onClose || (() => console.log('Payment popup closed'))
    });
  } else {
    throw new Error('Midtrans Snap tidak tersedia. Anda dapat menggunakan tautan pembayaran langsung.');
  }
}
