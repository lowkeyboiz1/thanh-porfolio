import type { Metadata } from 'next'
import { Roboto, Roboto_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { Providers } from '@/components/Providers'

const roboto = Roboto({
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
  subsets: ['latin']
})

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: {
    default: 'Tran Quang Thanh - Creative Portfolio',
    template: '%s | Tran Quang Thanh'
  },
  description: "Tran Quang Thanh's creative portfolio showcasing expertise in videography, photography, graphic design, and video editing. Explore my professional work and creative projects.",
  keywords: ['Tran Quang Thanh', 'portfolio', 'videography', 'photography', 'graphic design', 'video editing', 'creative director', 'filmmaker', 'visual storytelling', 'content creator'],
  authors: [{ name: 'Tran Quang Thanh' }],
  creator: 'Tran Quang Thanh',
  publisher: 'Tran Quang Thanh',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tranquangthanh.com',
    siteName: 'Tran Quang Thanh Portfolio',
    title: 'Tran Quang Thanh - Creative Portfolio',
    description: "Explore Tran Quang Thanh's creative portfolio featuring videography, photography, graphic design, and video editing work.",
    images: [
      {
        url: '/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Tran Quang Thanh - Creative Portfolio'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tran Quang Thanh - Creative Portfolio',
    description: "Explore Tran Quang Thanh's creative portfolio featuring videography, photography, graphic design, and video editing work.",
    images: ['/hero.jpg'],
    creator: '@tranquangthanh'
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code'
  },
  alternates: {
    canonical: 'https://tranquangthanh.com'
  },
  category: 'portfolio'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='canonical' href='https://tranquangthanh.com' />
        <meta name='theme-color' content='#000000' />
        <meta name='msapplication-TileColor' content='#000000' />
        <link rel='apple-touch-icon' sizes='180x180' href='/favicon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon.png' />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Tran Quang Thanh',
              url: 'https://tranquangthanh.com',
              image: 'https://tranquangthanh.com/hero.jpg',
              jobTitle: 'Creative Director & Filmmaker',
              worksFor: {
                '@type': 'Organization',
                name: 'Freelance'
              },
              alumniOf: {
                '@type': 'EducationalOrganization',
                name: 'University of Social Sciences and Humanities'
              },
              knowsAbout: ['Videography', 'Photography', 'Graphic Design', 'Video Editing', 'Sound Design', 'Visual Storytelling'],
              sameAs: ['https://linkedin.com/in/tranquangthanh', 'https://instagram.com/tranquangthanh', 'https://twitter.com/tranquangthanh']
            })
          }}
        />
      </head>
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        <Providers attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
