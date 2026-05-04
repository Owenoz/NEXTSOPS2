import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AccountDashboard from '@/components/account/AccountDashboard'

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AccountDashboard />
      </main>
      <Footer />
    </div>
  )
}
