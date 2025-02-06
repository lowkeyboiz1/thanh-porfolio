import { useMenuStore } from '@/store/useMenuStore'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { label: 'Home', href: '#home' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#work-experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
]

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

export default function Menu() {
  const { isMenuOpen, toggleMenu } = useMenuStore()
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <motion.div
      style={{ display: isMenuOpen ? 'flex' : 'none' }}
      className='fixed inset-0 z-[110] flex h-dvh w-dvw flex-col items-center justify-center gap-8 bg-black/90 xl:bg-transparent 2xl:gap-12'
      variants={anim}
      initial='initial'
      animate={isMenuOpen ? 'open' : 'closed'}
    >
      <AnimatePresence>
        {isMenuOpen &&
          menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: index * 0.1
                }
              }}
              exit={{
                opacity: 0,
                y: 20,
                transition: {
                  duration: 0.3,
                  delay: index * 0.05
                }
              }}
              onClick={() => toggleMenu(false)}
              className='relative cursor-pointer'
            >
              <motion.div whileHover='hover'>
                <Link className='text-2xl font-bold md:text-[3vw]' href={isHomePage ? item.href : `/${item.href}`}>
                  <motion.span className='inline-flex'>
                    {item.label.split('').map((letter, i) => (
                      <motion.span
                        key={i}
                        variants={{
                          initial: {
                            y: 0,
                            rotate: 0,
                            color: '#fff'
                          },
                          hover: {
                            y: [-2, 2, -2, 0],
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
          ))}
      </AnimatePresence>
    </motion.div>
  )
}
