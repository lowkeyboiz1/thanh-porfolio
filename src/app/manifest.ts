import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tran Quang Thanh - Creative Portfolio',
    short_name: 'TQT Portfolio',
    description: "Tran Quang Thanh's creative portfolio showcasing expertise in videography, photography, graphic design, and video editing.",
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    categories: ['portfolio', 'creative', 'videography', 'photography'],
    lang: 'en',
    icons: [
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/hero.jpg',
        sizes: '1280x720',
        type: 'image/jpeg',
        form_factor: 'wide'
      }
    ]
  }
}
