import React from 'react';

interface RulerProps {
  showRuler: boolean;
}

export const Ruler: React.FC<RulerProps> = ({ showRuler }) => {
  if (!showRuler) return null;

  // Generates 21 cm graduations (standard A4 width)
  const marks = Array.from({ length: 22 }, (_, i) => i);

  return (
    <div 
      className="h-5 bg-[#fafafa] border-b border-slate-300 flex items-end select-none text-[9px] font-mono text-slate-500 overflow-hidden relative shadow-2xs no-print ruler-container"
      data-no-print="true"
      dir="ltr"
    >
      {/* Centered ruler container matching A4 document width */}
      <div className="w-[794px] mx-auto h-full flex relative items-end border-x border-slate-300 bg-white">
        {/* Left margin indicator */}
        <div 
          className="absolute top-0 bottom-0 left-0 bg-slate-200/80 border-r border-slate-400"
          style={{ width: '96px' }}
          title="الهامش الأيسر"
        >
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-[#2b579a] absolute bottom-0 right-[-4px]" />
        </div>

        {/* Right margin indicator */}
        <div 
          className="absolute top-0 bottom-0 right-0 bg-slate-200/80 border-l border-slate-400"
          style={{ width: '96px' }}
          title="الهامش الأيمن"
        >
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-[#2b579a] absolute bottom-0 left-[-4px]" />
        </div>

        {/* Graduations */}
        {marks.map((cm) => (
          <div 
            key={cm} 
            className="flex-1 flex flex-col justify-end items-center relative border-r border-slate-200 last:border-none"
          >
            {/* Sub-divisions */}
            <div className="w-full flex justify-between px-1 mb-0.5">
              <span className="w-px h-1 bg-slate-300"></span>
              <span className="w-px h-1.5 bg-slate-400"></span>
              <span className="w-px h-1 bg-slate-300"></span>
            </div>
            <span className="text-[8px] leading-none mb-0.5">{cm > 0 && cm < 21 ? cm : ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
