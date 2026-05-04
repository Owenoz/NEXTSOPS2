export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const sendOTP = async (phone: string, otp: string): Promise<boolean> => {
  try {
    // TODO: Integrate with Africa's Talking SMS API
    console.log(`Sending OTP ${otp} to ${phone}`)
    
    // Simulated SMS sending
    // In production, use Africa's Talking:
    // const africastalking = require('africastalking')({
    //   apiKey: process.env.AFRICASTALKING_API_KEY,
    //   username: process.env.AFRICASTALKING_USERNAME,
    // })
    // await africastalking.SMS.send({
    //   to: [phone],
    //   message: `Your Next Shops verification code is: ${otp}`,
    // })
    
    return true
  } catch (error) {
    console.error('Failed to send OTP:', error)
    return false
  }
}
