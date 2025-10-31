'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { RefreshCw } from 'lucide-react';
import { refreshMarketData } from '@/app/actions';

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      await refreshMarketData();
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      className="border-2 border-white rounded-full p-4 hover:bg-gray-900 transition-all hover:scale-110 disabled:opacity-50"
    >
      <RefreshCw className={`w-8 h-8 ${isPending ? 'animate-spin' : ''}`} />
    </button>
  );
}


