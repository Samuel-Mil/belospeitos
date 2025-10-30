import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Chart from '../components/chart';
import type { Stock } from '../components/chart';
import { getQuote, listSymbols } from '../components/api';

// aaaaaaaaaaaaa
function toPercent(n: number | undefined): string {
  return typeof n === 'number' ? `${n >= 0 ? '+' : ''}${n.toFixed(2)}%` : '0.00%';
}

function toDate(ts: number | string | undefined): string {
  const format = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  if (typeof ts === 'number') return format(new Date(ts * 1000));
  if (typeof ts === 'string') {
    const parsed = new Date(ts);
    return isNaN(parsed.getTime()) ? ts : format(parsed);
  }
  return format(new Date());
}

export default async function Home() {
  const symbols: string[] = await listSymbols(60, 1);

  // Obter cotações com a API compartilhada (respeita 1 ticker por requisição)
  const quotes = symbols.length ? await getQuote(symbols.slice(0, 30).join(',')) : { results: [] as any[] };
  const results: any[] = quotes.results ?? [];

  // verificacao da porcentagem media de mercado positiva
  const buy = results
    .filter((r) => typeof r?.regularMarketChangePercent === 'number' && r.regularMarketChangePercent > 0)
    .sort((a, b) => (b.regularMarketChangePercent ?? 0) - (a.regularMarketChangePercent ?? 0))
    .slice(0, 3);

  // verificacao da porcentagem media de mercado negativa
  const sell = results
    .filter((r) => typeof r?.regularMarketChangePercent === 'number' && r.regularMarketChangePercent < 0)
    .sort((a, b) => (a.regularMarketChangePercent ?? 0) - (b.regularMarketChangePercent ?? 0))
    .slice(0, 3);

  // Mapear as acoes positivas
  const buyStocks: Stock[] = buy.map((r): Stock => ({
    ticker: r?.symbol ?? r?.ticker ?? '',
    date: toDate(r?.regularMarketTime ?? r?.updatedAt ?? r?.date),
    change: toPercent(r?.regularMarketChangePercent ?? r?.changePercent),
    price: Number(r?.regularMarketPrice ?? 0),
    type: 'buy',
    status: 'bullish',
    description: '—',
  }));
  
  // Mapear as acoes negativas
  const sellStocks: Stock[] = sell.map((r): Stock => ({
    ticker: r?.symbol ?? r?.ticker ?? '',
    date: toDate(r?.regularMarketTime ?? r?.updatedAt ?? r?.date),
    change: toPercent(r?.regularMarketChangePercent ?? r?.changePercent),
    price: Number(r?.regularMarketPrice ?? 0),
    type: 'sell',
    status: 'bearish',
    description: '—',
  }));

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
            />

            <h1>Belospeitos Ciberneticos</h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Chart Area - usa as 3 em alta */}
        <Chart stocks={buyStocks} />
        <h2 className="text-2xl font-bold mb-4 mt-4">Melhores compras e vendas</h2>

        {/* Buy Stocks Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {buyStocks.map((stock, index) => (
              <div
                key={index}
                className="border-2 border-green-500 rounded-xl p-5 bg-green-950/20"
              >
                <div className="text-green-400 text-xl font-semibold mb-2">
                  {stock.ticker}
                </div>
                <div className="text-gray-400 text-sm mb-2">{stock.date}</div>
                <div className="flex items-center text-green-400 text-lg mb-3">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  {stock.change}
                </div>
                <div className="text-gray-300 text-sm">{stock.description}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <div className="w-2/3 h-0.5 bg-green-500"></div>
            <TrendingUp className="w-6 h-6 text-green-500 -mt-3 ml-2" />
          </div>
        </div>

        {/* Sell Stocks Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {sellStocks.map((stock, index) => (
              <div
                key={index}
                className="border-2 border-red-500 rounded-xl p-5 bg-red-950/20"
              >
                <div className="text-red-400 text-xl font-semibold mb-2">
                  {stock.ticker}
                </div>
                <div className="text-gray-400 text-sm mb-2">{stock.date}</div>
                <div className="flex items-center text-red-400 text-lg mb-3">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  {stock.change}
                </div>
                <div className="text-gray-300 text-sm">{stock.description}</div>
              </div>
            ))}
          </div>
          <div className="flex">
            <TrendingDown className="w-6 h-6 text-red-500 -mt-3 mr-2" />
            <div className="w-2/3 h-0.5 bg-red-500"></div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mt-12">
          <button className="border-2 border-white rounded-full p-4 hover:bg-gray-900 transition-all hover:scale-110">
            <RefreshCw className="w-8 h-8" />
          </button>
        </div>
      </main>
    </div>
  );
}
