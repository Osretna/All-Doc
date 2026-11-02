import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-8 left-4 z-50 flex items-center gap-2 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3.5 py-2 text-xs font-medium text-white shadow-xl animate-bounce">
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span>أنت غير متصل بالإنترنت</span>
      <span className="text-gray-400">|</span>
      <ShieldCheck className="w-4 h-4 text-emerald-400" />
      <span className="text-emerald-300">الوضع السيادي نشط (بياناتك محفوظة محلياً)</span>
    </div>
  );
};
