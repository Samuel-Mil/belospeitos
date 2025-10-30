import Brapi from 'brapi';

const brapi = new Brapi({
  apiKey: process.env.BRAPI_API_KEY,
  timeout: 60000,
  maxRetries: 3,
});

export interface QuoteData {
  results: Array <{
    ticker: string;
    date: string;
    symbol: string;
    longName: string;
    regularMarketPrice: number;
    regularMarketChangePercent: number;
  }>;
}

export async function getQuote(ticker: string): Promise<QuoteData> {
 
  const hasMultiple = ticker.includes(',');
  const tickers = hasMultiple
    ? ticker.split(',').map((t) => t.trim()).filter(Boolean)
    : [ticker.trim()];

  const aggregatedResults: QuoteData['results'] = [];

  for (const t of tickers) {
    try {
      const response = await brapi.quote.retrieve(t, {
        modules: ['summaryProfile'],
      });
      const data = response as unknown as QuoteData;
      if (data?.results?.length) {
        aggregatedResults.push(...data.results);
      }
    } catch (err) {
      // Skip not found/failed tickers
      continue;
    }
  }

  if (aggregatedResults.length === 0) {
    throw new Error('Failed to fetch quote');
  }

  return { results: aggregatedResults } as QuoteData;
}