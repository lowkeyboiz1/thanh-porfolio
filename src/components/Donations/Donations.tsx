'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Check, Copy, Gift, MessageCircle, Star, Zap } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '../ui/button'

export default function MinimalistVietQRDonation() {
  const [amount, setAmount] = useState<string>('100000')
  const [customAmount, setCustomAmount] = useState<string>('')
  const [userMessage, setUserMessage] = useState('Thank you for your donation!')
  const [copied, setCopied] = useState(false)

  const amounts = ['50000', '100000', '200000', '500000']

  const bankInfo = {
    accountNumber: '1017757502',
    accountName: 'LUONG VI KHANG',
    bankName: 'Vietcombank'
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setCustomAmount(value)
      setAmount(value)
    }
  }

  return (
    <div id='donate' className='my-20 bg-black p-4 text-white page'>
      <div className='mx-auto space-y-8'>
        <div>
          <h2 className='mb-4 flex items-center gap-2 text-4xl font-bold text-[#ff6347] md:text-5xl'>
            Donate
            <span className='text-yellow-500'>✨</span>
          </h2>
          <p className='mt-2 max-w-sm text-2xl font-medium leading-[2] md:max-w-3xl'>
            Your generosity fuels the spark of creativity, shaping a future filled with groundbreaking innovations and transformative possibilities
          </p>
        </div>

        <div className='space-y-8'>
          <div>
            <div className='mb-2 flex items-center gap-2'>
              <Zap className='h-5 w-5 text-[#ff6347]' />
              <h3 className='text-2xl font-semibold'>Be the Force Behind Change 🚀</h3>
            </div>
            <p className='text-xl text-gray-400'>Your support turns small steps into giant leaps</p>
          </div>

          <div className='relative mx-auto flex w-96 items-center justify-center overflow-hidden rounded-xl'>
            <Image
              alt='VietQR'
              src={`https://img.vietqr.io/image/vcb-1017757502-compact2.jpg?amount=${amount}&addInfo=${userMessage.trim()}`}
              width={1000}
              height={1000}
              className='pointer-events-none size-full select-none object-cover'
            />
          </div>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Star className='h-4 w-4 text-yellow-500' />
              <span>Select Amount (VND)</span>
            </div>
            <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
              {amounts.map((value) => (
                <div
                  key={value}
                  onClick={() => handleAmountChange(value)}
                  className={`w-full rounded-lg border px-4 py-3 text-center transition-colors ${amount === value ? 'border-[#ff6347]/80 bg-[#ff6347]/20 font-bold text-white' : 'bg-zinc-900 hover:bg-zinc-800'}`}
                >
                  {parseInt(value).toLocaleString()} ₫
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Gift className='h-4 w-4 text-[#ff6347]' />
              <span>Custom Amount (VND)</span>
            </div>
            <Input value={customAmount} onChange={handleCustomAmountChange} placeholder='Enter custom amount' className='border-zinc-800 bg-zinc-900 text-white placeholder:text-gray-400' />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <MessageCircle className='h-4 w-4 text-[#ff6347]' />
              <span>Your Message (Optional)</span>
            </div>
            <Textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder='Leave a message with your donation'
              className='border-zinc-800 bg-zinc-900 text-white placeholder:text-gray-400'
              rows={3}
            />
          </div>

          <div className='space-y-3 rounded-lg bg-zinc-900 p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>Account Number</span>
              <div className='flex items-center gap-2'>
                <span>{bankInfo.accountNumber}</span>
                <Button variant='outline' size='icon' className='relative ml-2 rounded-md' onClick={handleCopy} aria-label={copied ? 'Copied' : 'Copy to clipboard'}>
                  <span className='sr-only'>{copied ? 'Copied' : 'Copy'}</span>
                  <Copy className={`h-4 w-4 transition-all duration-300 ${copied ? 'scale-0' : 'scale-100'}`} />
                  <Check className={`absolute inset-0 m-auto h-4 w-4 transition-all duration-300 ${copied ? 'scale-100' : 'scale-0'}`} />
                </Button>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>Account Name</span>
              <span>{bankInfo.accountName}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>Bank</span>
              <span>{bankInfo.bankName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
