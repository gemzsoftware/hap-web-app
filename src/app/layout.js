import './globals.css'

export const metadata = {
    title: {
        default: 'HAP Properties - Secure Land Investments',
        template: '%s | HAP Properties'
    },
    description: 'Invest in verified land properties with confidence. Track payments, download documents, and secure your future with HAP Properties.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="min-h-screen flex flex-col font-body text-dark-800 bg-white">
        {children}
        </body>
        </html>
    )
}