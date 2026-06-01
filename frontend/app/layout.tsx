import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Providers      from '@/components/Providers'
import ShellWrapper   from '@/components/ShellWrapper'
import Toast          from '@/components/Toast'

export const metadata: Metadata = {
  title: 'Hussain Healthcare — Your Trusted Pharmacy',
  description: 'Order medicines, health devices and wellness products online in Karachi. Upload prescriptions, book consultations and get free delivery above Rs. 5,000.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className="antialiased noise-overlay">
        <Providers>
          <ShellWrapper>
            {children}
          </ShellWrapper>
          <Toast />
        </Providers>
      </body>
    </html>
    </ClerkProvider>
  )
}
