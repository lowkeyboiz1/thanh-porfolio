import { useMenuStore } from '@/store/useMenuStore'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const anim = {
  initial: {
    opacity: 0
  },
  open: {
    opacity: 1
  },
  exit: {
    opacity: 0
  }
}

const menuItems = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Donate', href: '#donate' }
]

export default function Menu() {
  const { isMenuOpen, toggleMenu } = useMenuStore()
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <motion.div
      style={{ display: isMenuOpen ? 'flex' : 'none' }}
      className='fixed z-[110] flex h-dvh w-full flex-col items-center justify-center gap-6'
      variants={anim}
      initial='initial'
      animate={isMenuOpen ? 'open' : 'closed'}
    >
      {menuItems.map((item, index) => (
        <AnimatePresence key={item.href}>
          <motion.div
            onClick={() => toggleMenu(false)}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            exit={{ opacity: 0, y: -100 }}
            className='relative'
            style={{
              cursor: 'pointer'
            }}
          >
            <motion.div animate='initial' whileHover='hover' className='cursor-pointer'>
              <Link className='text-[5vw] font-bold 2xl:text-[3vw]' href={isHomePage ? item.href : `/${item.href}`}>
                <motion.span className='inline-flex'>
                  {item.label.split('').map((letter, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        initial: {
                          y: 0,
                          rotate: 0,
                          color: '#fff',
                          transition: {
                            duration: 0.3,
                            ease: 'easeOut',
                            type: 'tween'
                          }
                        },
                        hover: {
                          y: [-2, 2, -2, 0], // Smooth bounce
                          rotate: [0, 5, -5, 0],
                          color: '#123273',
                          transition: {
                            duration: 0.3,
                            ease: 'easeInOut',
                            delay: i * 0.05,
                            type: 'tween'
                          }
                        }
                      }}
                      className='inline-block'
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      ))}
    </motion.div>
  )
}
