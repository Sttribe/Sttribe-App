import crypto from 'crypto';

// Razorpay API integration for payments
export async function POST(request: Request) {
  try {
    // Validate environment variables
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;
    const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET) {
      console.error('Missing Razorpay configuration: RAZORPAY_KEY_ID or RAZORPAY_SECRET not set');
      return Response.json(
        { 
          success: false, 
          error: 'Payment gateway configuration error. Please contact support.' 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return Response.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create order with Razorpay
    const orderData = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    // TODO: Replace with actual Razorpay SDK integration
    // For now, this is a mock implementation that should be replaced
    // with actual Razorpay API call using the Razorpay Node.js SDK
    const order = {
      id: `order_${Date.now()}`,
      entity: 'order',
      amount: orderData.amount,
      amount_paid: 0,
      amount_due: orderData.amount,
      currency: orderData.currency,
      receipt: orderData.receipt,
      status: 'created',
      attempts: 0,
      notes: orderData.notes,
      created_at: Math.floor(Date.now() / 1000),
    };

    return Response.json({
      success: true,
      order,
      key_id: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create order' 
      },
      { status: 500 }
    );
  }
}

// Verify payment signature
export async function PUT(request: Request) {
  try {
    // Validate environment variables
    const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

    if (!RAZORPAY_SECRET) {
      console.error('Missing Razorpay configuration: RAZORPAY_SECRET not set');
      return Response.json(
        { 
          success: false, 
          error: 'Payment gateway configuration error. Please contact support.' 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json(
        { success: false, error: 'Missing required payment verification fields' },
        { status: 400 }
      );
    }

    // Verify Razorpay signature using HMAC SHA256
    const hmac = crypto.createHmac('sha256', RAZORPAY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    const isSignatureValid = generated_signature === razorpay_signature;

    if (isSignatureValid) {
      return Response.json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
      });
    } else {
      console.error('Payment signature verification failed', {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        expected: generated_signature,
        received: razorpay_signature
      });
      return Response.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to verify payment' 
      },
      { status: 500 }
    );
  }
}