import SocialLinks from '@/components/SocialLinks'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Education', href: '#education' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' }
  ]

  return (
    <div className='relative h-[600px] md:h-[800px]' style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}>
      <div className='fixed bottom-0 h-[600px] w-full md:h-[800px]'>
        <div className='mx-auto flex h-full flex-col gap-4 page'>
          <div className='flex flex-col items-center justify-center'>
            <div className='relative h-48 w-96 md:h-60 md:w-[480px]'>
              <Image src='/logo.png' alt='Logo' fill className='object-contain' />
            </div>
            <SocialLinks />
          </div>
          <nav className='flex flex-wrap justify-center gap-4 px-4 md:gap-6'>
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href} className='text-sm text-gray-400 transition-colors hover:text-white md:text-base'>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-400 md:bottom-8 md:text-sm'>© {new Date().getFullYear()} Tran Quang Thanh. All rights reserved.</div>
        </div>
      </div>
    </div>
  )
}

export default Footer
