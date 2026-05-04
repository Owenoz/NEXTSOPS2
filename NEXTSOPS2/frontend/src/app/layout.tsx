import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next Shops - Next Level Shopping in Uganda',
  description: 'Shop phones, fashion, electronics, home goods, and more with fast delivery and mobile money payments',
  keywords: 'online shopping uganda, mobile money, cash on delivery, electronics, fashion, phones',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
