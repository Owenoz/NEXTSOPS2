import { Router } from 'express'

const router = Router()

// POST /api/payments/mtn-momo - Initiate MTN Mobile Money payment
router.post('/mtn-momo', async (req, res) => {
  const { orderId, phoneNumber, amount } = req.body

  // TODO: Call MTN MoMo API
  // TODO: Request to Pay
  // TODO: Return transaction ID

  res.json({
    transactionId: 'MTN-TXN-001',
    status: 'pending',
    message: 'Please check your phone for USSD prompt',
  })
})

// POST /api/payments/airtel-money - Initiate Airtel Money payment
router.post('/airtel-money', async (req, res) => {
  const { orderId, phoneNumber, amount } = req.body

  // TODO: Call Airtel Money API
  // TODO: Request payment
  // TODO: Return transaction ID

  res.json({
    transactionId: 'AIRTEL-TXN-001',
    status: 'pending',
    message: 'Please check your phone for payment prompt',
  })
})

// GET /api/payments/:transactionId/status - Check payment status
router.get('/:transactionId/status', async (req, res) => {
  const { transactionId } = req.params

  // TODO: Query payment gateway
  // TODO: Return status

  res.json({
    transactionId,
    status: 'completed', // pending, completed, failed
    orderId: 'ORD-001',
  })
})

// POST /api/payments/card - Process card payment
router.post('/card', async (req, res) => {
  const { orderId, cardDetails } = req.body

  // TODO: Call Flutterwave/Paystack API
  // TODO: Process payment
  // TODO: Return result

  res.json({
    transactionId: 'CARD-TXN-001',
    status: 'completed',
    message: 'Payment successful',
  })
})

// POST /api/payments/webhook - Payment gateway webhook
router.post('/webhook', async (req, res) => {
  const payload = req.body

  // TODO: Verify webhook signature
  // TODO: Update payment status
  // TODO: Update order status
  // TODO: Send notifications

  res.status(200).json({ received: true })
})

module.exports = router
