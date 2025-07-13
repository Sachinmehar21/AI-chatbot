import './globals.css'

export const metadata = {
  title: 'Gemini Chatbot',
  description: 'A beautiful chatbot powered by Google Gemini AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
} 