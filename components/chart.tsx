'use client';
import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';

export type StockType = 'buy' | 'sell';
export type StockStatus = 'bullish' | 'bearish' | 'neutral';

export interface Stock {
  ticker: string;
  date: string;
  change: string;
  price: number;
  description: string;
  type?: StockType;
  status?: StockStatus;
}

export interface MarketChartProps {
  stocks: Stock[];
}

export default function MarketChart({ stocks }: MarketChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (chartRef.current && stocks && stocks.length > 0) {
      
      ChartJS.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Tooltip,
        Legend
      );

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const allPrices = stocks.map(s => s.price);
      const avgPrice = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;

      const generateMarketData = () => {
        const points = 50;
        const data = [];
        let currentPrice = avgPrice * 0.98; 
        
        for (let i = 0; i < points; i++) {
          const change = (Math.random() - 0.48) * (avgPrice * 0.02);
          currentPrice += change;
          data.push(currentPrice);
        }
        return data;
      };

      const marketData = generateMarketData();
      const labels = Array.from({ length: marketData.length }, (_, i) => i);

      chartInstanceRef.current = new ChartJS(chartRef.current, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            data: marketData,
            borderColor: function(context) {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              if (!chartArea) return '#10b981';
              
              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              const firstValue = marketData[0];
              const lastValue = marketData[marketData.length - 1];
              
              if (lastValue > firstValue) {
                gradient.addColorStop(0, '#10b981');
                gradient.addColorStop(1, '#059669');
              } else {
                gradient.addColorStop(0, '#ef4444');
                gradient.addColorStop(1, '#dc2626');
              }
              return gradient;
            },
            backgroundColor: function(context) {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              if (!chartArea) return 'rgba(16, 185, 129, 0.1)';
              
              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              const firstValue = marketData[0];
              const lastValue = marketData[marketData.length - 1];
              
              if (lastValue > firstValue) {
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
              } else {
                gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
                gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
              }
              return gradient;
            },
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#374151',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return `$${context.parsed.y.toFixed(2)}`;
                },
                title: function() {
                  return 'Market Price';
                }
              }
            }
          },
          scales: {
            x: {
              display: false
            },
            y: {
              display: false
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [stocks]); 

  return (
    <div className="border border-gray-700 rounded-lg p-6 h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}