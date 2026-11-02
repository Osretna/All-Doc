import React from 'react';

interface Props {
  showRuler: boolean;
}

export const WordRuler: React.FC<Props> = ({ showRuler }) => {
  if (!showRuler) return null;

  return (
    <div className="h-5 bg-[#f3f2f1] border-b border-gray-300 flex items-center justify-center select-none text-[9px] text-gray-500 overflow-hidden font-mono shrink-0">
      <div className="w-[794px] h-full bg-white border-x border-gray-300 flex items-end justify-between px-2 relative shadow-2xs">
        {/* Left indent triangle */}
        <div className="absolute top-0 right-2 w-2 h-2 border-t-2 border-r-2 border-gray-600 rotate-45" title="الهامش الأيمن" />
        {/* Right indent triangle */}
        <div className="absolute top-0 left-2 w-2 h-2 border-t-2 border-l-2 border-gray-600 -rotate-45" title="الهامش الأيسر" />

        {/* Ruler ticks */}
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-[8px] text-gray-400">{i}</span>
            <div className={`w-[1px] ${i % 5 === 0 ? 'h-2.5 bg-gray-600' : 'h-1.5 bg-gray-300'}`} />
          </div>
        ))}
      </div>
    </div>
  );
};
