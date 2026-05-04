import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwt'
import { generateOTP, sendOTP } from '../utils/otp'

const prisma = new PrismaClient()

export class AuthService {
  async register(data: {
    email: string
    phone: string
    password: string
    firstName: string
    lastName: string
  }) {
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    })

    if (existingUser) {
      throw new Error('User with this email or phone already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'BUYER',
        verified: false,
      },
    })

    // Generate and send OTP
    const otp = generateOTP()
    // Store OTP in Redis or database with expiry
    // For now, we'll log it
    console.log(`OTP for ${user.phone}: ${otp}`)
    await sendOTP(user.phone!, otp)

    return {
      userId: user.id,
      message: 'Registration successful. Please verify your phone number.',
    }
  }

  async login(emailOrPhone: string, password: string) {
    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    // Check if verified
    if (!user.verified) {
      throw new Error('Please verify your phone number first')
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    }
  }

  async verifyOTP(userId: string, otp: string) {
    // TODO: Verify OTP from Redis/database
    // For now, accept any 6-digit OTP
    if (otp.length !== 6) {
      throw new Error('Invalid OTP')
    }

    // Update user as verified
    const user = await prisma.user.update({
      where: { id: userId },
      data: { verified: true },
    })

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    }
  }

  async forgotPassword(emailOrPhone: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    })

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the account exists, a reset code has been sent.' }
    }

    // Generate and send OTP
    const otp = generateOTP()
    console.log(`Password reset OTP for ${user.phone}: ${otp}`)
    await sendOTP(user.phone!, otp)

    return {
      userId: user.id,
      message: 'Password reset code sent to your phone.',
    }
  }

  async resetPassword(userId: string, otp: string, newPassword: string) {
    // TODO: Verify OTP
    if (otp.length !== 6) {
      throw new Error('Invalid OTP')
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return { message: 'Password reset successful' }
  }
}
