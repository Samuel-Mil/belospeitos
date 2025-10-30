import Brapi from 'brapi';

const brapi = new Brapi({
  apiKey: process.env.BRAPI_API_KEY,
  timeout: 60000,
  maxRetries: 2,
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
        modules: ['summaryProfile'], //1 modulo somente pois eh o que o plano gratuito da API permite
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

export async function listSymbols(limit: number = 15, page: number = 1): Promise<string[]> {
  const token = process.env.BRAPI_API_KEY;
  
  const params = new URLSearchParams({ limit: String(limit), page: String(page) });

  if (token) params.set('token', token);

  const res = await fetch(
    `https://brapi.dev/api/quote/list?${params.toString()}`,
    { next:
      { revalidate: 180 }
    }
  );

  if (!res.ok) throw new Error('Failed to fetch tickers list');

  const json = await res.json();
  return (json?.stocks ?? []).map((s: any) => s.stock).filter(Boolean);
}