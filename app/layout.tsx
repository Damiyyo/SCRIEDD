import type { Metadata, Viewport } from 'next'
import Chrome from '@/components/Chrome'
import Splash from '@/components/Splash'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scried: Something is possible here',
  description: 'Scried brings opportunities closer to Nigerian students, and brings Nigerian students to the world.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0B3326',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Figtree:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <Splash />
          <Chrome>{children}</Chrome>
        </AuthProvider>
      </body>
    </html>
  )
}
