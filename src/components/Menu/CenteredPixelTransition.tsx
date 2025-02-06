import { useMenuStore } from '@/store/useMenuStore'
import { motion } from 'framer-motion'

const anim = {
  initial: {
    opacity: 0
  },
  open: (delay: number[]) => {
    return {
      opacity: 1,
      transition: { duration: 0, delay: 0.025 * delay[1] }
    }
  },
  closed: (delay: number[]) => {
    return {
      opacity: 0,
      transition: { duration: 0, delay: 0.025 * delay[0] }
    }
  }
}

export default function CenteredPixelTransition({ dimensions }: { dimensions: { width: number; height: number } }) {
  const { width, height } = dimensions
  const { isMenuOpen } = useMenuStore()

  const shuffle = (a: number[]) => {
    let j, x, i
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = a[i]
      a[i] = a[j]
      a[j] = x
    }
    return a
  }

  const getBlocks = (indexOfColum: number) => {
    const blockSize = height * 0.1
    const nbOfBlocks = Math.ceil(width / blockSize)
    const shuffledIndexes = shuffle([...Array(nbOfBlocks)].map((_, i) => i))
    return shuffledIndexes.map((randomIndex, index) => {
      return (
        <motion.div
          key={index}
          className={'h-full w-[10vw] bg-[#3d3d3d]'}
          variants={anim}
          initial='initial'
          animate={isMenuOpen ? 'open' : 'closed'}
          custom={[indexOfColum + randomIndex, 10 - indexOfColum + randomIndex]}
        />
      )
    })
  }

  return (
    <div className='pointer-events-none fixed z-[100] hidden h-dvh w-full flex-col overflow-hidden xl:flex'>
      {[...Array(10)].map((_, index) => {
        return (
          <div key={index} className={'flex h-[10vh] w-full'}>
            {/* {getBlocks(index)} */}
          </div>
        )
      })}
    </div>
  )
}
