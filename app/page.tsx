import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Chart from '../components/chart';
export default function Home() {
  const buyStocks = [
    { ticker: '$AAPL', date: '12/01', change: '+0.2%', price: 150.00, type: 'buy', status: 'bullish', description: 'Strong momentum with tech sector rally' },
    { ticker: '$MSFT', date: '12/01', change: '+0.2%', price: 150.00, type: 'buy', status: 'bullish', description: 'Cloud services driving growth' },
    { ticker: '$NVDA', date: '12/01', change: '+0.2%', price: 150.00, type: 'buy', status: 'bullish', description: 'AI chip demand remains strong' }
  ];

  const sellStocks = [
    { ticker: '$TSLA', date: '12/01', change: '-0.2%', description: 'Profit taking after recent gains' },
    { ticker: '$META', date: '12/01', change: '-0.2%', description: 'Regulatory concerns emerging' },
    { ticker: '$AMZN', date: '12/01', change: '-0.2%', description: 'Retail sector showing weakness' }
  ];

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
        {/* Chart Area */}
        <Chart stocks={buyStocks} />
        <h2 className="text-2xl font-bold mb-6">Melhores compras</h2>

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
