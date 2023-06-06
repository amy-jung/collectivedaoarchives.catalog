import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Collective DAO Archive Catalog',
  description: 'The Collective DAO Archive Catalog is a comprehensive, living open source resource that captures, indexes, and archives various challenges and events from existing DAOs.',
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
