// import { useState } from 'react'
import { ApexOptions } from 'apexcharts'
import Chart from 'react-apexcharts'
import { useOptionsChain } from '../api/useOptionsChain'
import { useMemo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

const DAY_IN_MS = 24 * 3_600_000

const formatExpirationDate = (expirationDate: string) => {
  return new Date(expirationDate).toLocaleDateString()
}

const getNormalizedPremium = (
  expirationDate: string,
  price: number | null,
): number | null => {
  if (price == null) {
    return null
  }

  const ttlDays = (new Date(expirationDate).getTime() - Date.now()) / DAY_IN_MS
  return price / ttlDays
}

type GridProps = {
  symbol: string
}

export const Grid = ({ symbol }: GridProps) => {
  const { isLoading, error, data } = useOptionsChain({ symbol })

  const chartOptions = useMemo<ApexOptions>(() => {
    return {
      dataLabels: {
        enabled: false,
      },
      colors: ['#008FFB'],
      title: {
        text: isLoading ? 'Loading...' : symbol,
      },
    }
  }, [symbol, isLoading])

  const series = useMemo<ApexAxisChartSeries>(() => {
    if (!data) {
      return []
    }

    const strikes = data.strikes.filter(
      (strike) =>
        strike >= data.quote.regularMarketPrice &&
        strike < data.quote.regularMarketPrice * 1.2,
    )
    const expirationDates = data.expirationDates.filter((d) => d <= new Date(Date.now() + 365*DAY_IN_MS).toISOString())

    return strikes.map((strike) => ({
      name: `${strike}`,
      data: expirationDates.map((expirationDate) => ({
        x: formatExpirationDate(expirationDate),
        y: getNormalizedPremium(
          expirationDate,
          data.options
            .find((o) => o.expirationDate === expirationDate)
            ?.calls.find((c) => c.strike === strike)?.lastPrice ?? null,
        ),
      })),
    }))
  }, [data])

  if (error) {
    return <p>{`Error: ${error}`}</p>
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Chart
          type='heatmap'
          options={chartOptions}
          series={series}
          width={width}
          height={height}
        />
      )}
    </AutoSizer>
  )
}
