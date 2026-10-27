import React, { useState } from 'react';
import {
  Play,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  ArrowRight,
  ArrowLeft,
  FolderPlus,
  Layers,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { PowerPointSlideData, SlideSection } from './types';

interface Props {
  slides: PowerPointSlideData[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onMoveSlide: (fromIndex: number, toIndex: number) => void;
  onToggleHideSlide: (index: number) => void;
  onStartPresentationFrom: (index: number) => void;
  onReturnToNormalView: () => void;
  sections: SlideSection[];
  onAddSection: (title: string) => void;
}

export const SlideSorterView: React.FC<Props> = ({
  slides,
  currentSlideIndex,
  onSelectSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
  onToggleHideSlide,
  onStartPresentationFrom,
  onReturnToNormalView,
  sections,
  onAddSection,
}) => {
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);

  const handleCreateSection = () => {
    if (!newSectionTitle.trim()) return;
    onAddSection(newSectionTitle.trim());
    setNewSectionTitle('');
    setShowAddSection(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#2d2d2d] text-white p-6 overflow-y-auto select-none">
      {/* Sorter Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-orange-400" />
          <h2 className="text-base font-bold text-white">فارز الشرائح (Slide Sorter View)</h2>
          <span className="text-xs text-gray-400 bg-black/40 px-2.5 py-1 rounded">
            إجمالي الشرائح: {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowAddSection(!showAddSection)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded font-semibold transition cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>إضافة قسم جديد</span>
          </button>

          <button
            onClick={onReturnToNormalView}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#d83b01] hover:bg-[#b33000] text-white rounded font-bold transition cursor-pointer"
          >
            <span>العودة للعرض العادي (تحرير)</span>
          </button>
        </div>
      </div>

      {showAddSection && (
        <div className="my-3 p-3 bg-[#383838] border border-gray-600 rounded-lg flex items-center gap-2 max-w-md">
          <input
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder="اسم القسم الجديد (مثال: النتائج المالية)..."
            className="flex-1 bg-black/50 border border-gray-600 rounded px-2.5 py-1 text-xs text-white outline-none"
          />
          <button
            onClick={handleCreateSection}
            className="px-3 py-1 bg-[#d83b01] rounded text-xs font-bold text-white cursor-pointer"
          >
            إضافة
          </button>
        </div>
      )}

      {/* Slide Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
        {slides.map((slide, idx) => {
          const isSelected = idx === currentSlideIndex;
          const isHidden = slide.hidden;

          return (
            <div
              key={slide.id}
              onClick={() => onSelectSlide(idx)}
              onDoubleClick={() => {
                onSelectSlide(idx);
                onReturnToNormalView();
              }}
              className={`group flex flex-col rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative shadow-lg ${
                isSelected
                  ? 'border-[#d83b01] ring-4 ring-[#d83b01]/30 bg-white/10 scale-[1.02]'
                  : 'border-gray-700 hover:border-gray-500 bg-[#242424]'
              } ${isHidden ? 'opacity-40 grayscale' : ''}`}
            >
              {/* Slide Number & Badges Header */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 text-[11px] text-gray-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <span>{idx + 1}</span>
                  {isHidden && (
                    <span className="text-[9px] bg-red-900/60 text-red-300 px-1 rounded flex items-center gap-0.5">
                      <EyeOff className="w-2.5 h-2.5" />
                      <span>مخفية</span>
                    </span>
                  )}
                  {slide.transitionConfig && slide.transitionConfig.type !== 'none' && (
                    <span className="text-[9px] bg-sky-900/60 text-sky-300 px-1 rounded">
                      ★ {slide.transitionConfig.type}
                    </span>
                  )}
                </div>

                {/* Quick Action Icons on Card */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleHideSlide(idx);
                    }}
                    className="p-1 hover:text-orange-400"
                    title={isHidden ? 'إظهار الشريحة' : 'إخفاء الشريحة في العرض'}
                  >
                    {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateSlide(idx);
                    }}
                    className="p-1 hover:text-blue-400"
                    title="تكرار الشريحة"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {slides.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSlide(idx);
                      }}
                      className="p-1 hover:text-red-400"
                      title="حذف الشريحة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Slide Thumbnail Preview Canvas */}
              <div
                className="aspect-video p-3 flex flex-col justify-between text-center relative overflow-hidden bg-cover bg-center"
                style={{
                  backgroundColor: slide.backgroundColor || '#003366',
                  backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : undefined,
                  fontFamily: slide.fontFamily || 'Cairo',
                }}
              >
                <div className="text-[11px] font-bold text-white truncate max-w-[90%] mx-auto bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                  {slide.title || 'شريحة بدون عنوان'}
                </div>
                <div className="text-[9px] text-white/70 truncate">{slide.subtitle}</div>
                <div className="text-[8px] text-white/40">
                  {slide.body.length} نقاط محتوى
                </div>
              </div>

              {/* Bottom Reorder Controls */}
              <div className="flex items-center justify-between px-2 py-1.5 bg-black/60 text-[10px]">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (idx > 0) onMoveSlide(idx, idx - 1);
                    }}
                    disabled={idx === 0}
                    className="p-1 hover:bg-white/10 rounded disabled:opacity-20 cursor-pointer"
                    title="تقديم الشريحة لأول العرض"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (idx < slides.length - 1) onMoveSlide(idx, idx + 1);
                    }}
                    disabled={idx === slides.length - 1}
                    className="p-1 hover:bg-white/10 rounded disabled:opacity-20 cursor-pointer"
                    title="تأخير الشريحة لآخر العرض"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartPresentationFrom(idx);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-white/15 hover:bg-[#d83b01] rounded text-[9.5px] font-bold text-white transition cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5 fill-white" />
                  <span>بدء من هنا</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
