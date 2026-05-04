import { Router } from 'express'
import { z } from 'zod'
import { AuthService } from '../services/authService'

const router = Router()
const authService = new AuthService()

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^256\d{9}$/),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
})

const loginSchema = z.object({
  emailOrPhone: z.string(),
  password: z.string(),
})

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)
    const result = await authService.register(data)
    res.status(201).json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Registration failed' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)
    const result = await authService.login(data.emailOrPhone, data.password)
    res.json(result)
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Invalid credentials' })
  }
})

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body
    const result = await authService.verifyOTP(userId, otp)
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'OTP verification failed' })
  }
})

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { emailOrPhone } = req.body
    const result = await authService.forgotPassword(emailOrPhone)
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to send reset code' })
  }
})

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body
    const result = await authService.resetPassword(userId, otp, newPassword)
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Password reset failed' })
  }
})

module.exports = router
