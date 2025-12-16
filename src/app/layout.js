import './globals.css'

export const metadata = {
  title: 'AI Chatbot',
  description: 'Your personalized AI chatbot by sachinmehar21',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AI Chatbot',
  },
  icons: {
    apple: '/chatbot-logo.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#1B202D',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/chatbot-logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AI Chat" />
        <meta name="theme-color" content="#1B202D" />
      </head>
      <body>{children}</body>
    </html>
  )
}