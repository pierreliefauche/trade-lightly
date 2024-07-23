import { useEffect, useState } from 'react'

type OptionsChain = {
  underlyingSymbol: string
  expirationDates: string[]
  strikes: number[]
  quote: {
    symbol: string
    displayName: string
    shortName: string
    longName: string
    regularMarketPrice: number
  }
  options: Array<{
    expirationDate: string
    calls: Array<{
      contractSymbol: string
      strike: number
      expiration: string
      lastPrice: number
      inTheMoney: boolean
    }>
  }>
}

type UseOptionsChainParams = {
  symbol: string
}

type UseOptionsChainResult = {
  isLoading: boolean
  error: undefined | null | Error
  data: undefined | null | OptionsChain
}

export const useOptionsChain = ({ symbol }: UseOptionsChainParams) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState<UseOptionsChainResult['data']>()

  useEffect(() => {
    setData(null)

    if (symbol) {
      setIsLoading(true)

      fetch(
        `https://lapinefit-7e593adedff3.herokuapp.com/trader/${symbol}/options/chain`,
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
          }
          return response.json().then(setData)
        })
        .catch((error) => {
          console.error(error)
          setError(error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [symbol])

  return {
    isLoading,
    error,
    data,
  }
}
