import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'


import { ModalProvider } from '@/providers/modal-provider'
import { title } from 'process'
import { ToasterProvider } from '@/providers/toast-provider'


export const metadeta = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
}
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
 
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ToasterProvider />
          <ModalProvider />
          {children}
          </body>
      </html>
    </ClerkProvider>
  )
}