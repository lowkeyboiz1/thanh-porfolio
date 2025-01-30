'use client'

import { getContactMessages } from '@/apis/contact'
import { useEffect } from 'react'
import TableComponent from '@/components/table'
import { useState } from 'react'

const MessagesPage = () => {
  type ItemMessage = {
    _id: string
    name: string
    email: string
    message: string
    createdAt: string
    ip: string
  }
  const [items, setItems] = useState<ItemMessage[]>([])
  const [isFetching, setIsFetching] = useState(false)

  const handleFetchMessages = async () => {
    try {
      const messages = await getContactMessages()
      setItems(messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    if (isFetching) {
      handleFetchMessages()
    }
  }, [isFetching])

  useEffect(() => {
    setIsFetching(true)
  }, [])

  return (
    <div className='flex w-full flex-col gap-14 py-10'>
      <TableComponent items={items} />
    </div>
  )
}

export default MessagesPage
