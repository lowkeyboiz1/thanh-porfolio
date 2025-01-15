'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type QueryParams = {
  [key: string]: string
}

export const useGetAllQueryParams = (): QueryParams | null => {
  const searchParams = useSearchParams()
  const [queryParams, setQueryParams] = useState<QueryParams>({})

  useEffect(() => {
    const tempQueryParams: QueryParams = {}

    for (const [key, value] of searchParams.entries()) {
      tempQueryParams[key] = value
    }

    setQueryParams(tempQueryParams)
  }, [searchParams])

  return queryParams ? queryParams : null
}
