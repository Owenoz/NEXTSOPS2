import './globals.css'

export const metadata = {
  title: 'Next Shops Admin - Dashboard',
  description: 'Admin portal for Next Shops e-commerce platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
