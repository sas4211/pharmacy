'use client'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

const Header        = dynamic(() => import('@/components/Header'))
const Footer        = dynamic(() => import('@/components/Footer'))
const CartDrawer    = dynamic(() => import('@/components/CartDrawer'))
const WishlistDrawer= dynamic(() => import('@/components/WishlistDrawer'))
const ClerkAuthBridge = dynamic(() => import('@/components/ClerkAuthBridge'))
const WhatsAppFloat = dynamic(() => import('@/components/WhatsAppFloat'))
const AIVoiceChat = dynamic(() => import('@/components/AIVoiceChat'))
const AnnouncementBar = dynamic(() => import('@/components/AnnouncementBar'))

const SHELL_EXCLUDED = ['/dashboard', '/sign-in', '/sign-up']

export default function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showShell = !SHELL_EXCLUDED.some(p => pathname.startsWith(p))

  if (!showShell) return <>{children}</>

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <ClerkAuthBridge />
      <WhatsAppFloat />
      <AIVoiceChat />
    </>
  )
}
