import { AnimatedMenuToggle } from '@/components/AnimatedMenuToggle'
import Image from 'next/image'

const Header = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <header className='sticky top-0 z-[120] pt-2 backdrop-blur-sm page flex-between xl:pt-8'>
      <div onClick={handleScrollToTop} className='size-16 xl:w-20'>
        <Image src='/logo.png' alt='vika dev logo' width={100} height={100} className='size-full object-cover' />
      </div>
      <AnimatedMenuToggle />
    </header>
  )
}

export default Header
