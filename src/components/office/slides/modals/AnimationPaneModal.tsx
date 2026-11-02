import React, { useState } from 'react';
import { X, Play, Plus, Trash2, ArrowUp, ArrowDown, Clock, Zap, Sparkles } from 'lucide-react';
import { SlideAnimationConfig, AnimationCategory } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  animations: SlideAnimationConfig[];
  onUpdateAnimations: (anims: SlideAnimationConfig[]) => void;
  onPreviewAnimations: () => void;
}

export const AnimationPaneModal: React.FC<Props> = ({
  isOpen,
  onClose,
  animations,
  onUpdateAnimations,
  onPreviewAnimations,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddAnimation = (category: AnimationCategory, effect: string, label: string) => {
    const newAnim: SlideAnimationConfig = {
      id: `anim_${Date.now()}`,
      elementName: label,
      category,
      effect,
      start: 'click',
      duration: 1.0,
      delay: 0,
      order: animations.length + 1,
    };
    onUpdateAnimations([...animations, newAnim]);
    setSelectedId(newAnim.id);
  };

  const handleDelete = (id: string) => {
    onUpdateAnimations(animations.filter((a) => a.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= animations.length) return;
    const copy = [...animations];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    copy.forEach((a, i) => (a.order = i + 1));
    onUpdateAnimations(copy);
  };

  const handleUpdateSelected = (field: keyof SlideAnimationConfig, val: any) => {
    if (!selectedId) return;
    onUpdateAnimations(
      animations.map((a) => (a.id === selectedId ? { ...a, [field]: val } : a))
    );
  };

  const currentSelected = animations.find((a) => a.id === selectedId);

  return (
    <div className="fixed inset-y-0 left-0 w-80 bg-white border-r border-gray-300 shadow-2xl z-50 flex flex-col text-right animate-in slide-in-from-left duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#d83b01] text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <h3 className="font-bold text-sm">جزء الحركة (Animation Pane)</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50 text-xs">
        <button
          onClick={onPreviewAnimations}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d83b01] text-white rounded font-bold hover:bg-[#b33000] transition cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>تشغيل الكل</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const idx = animations.findIndex((a) => a.id === selectedId);
              if (idx !== -1) handleMove(idx, 'up');
            }}
            disabled={!selectedId || animations.findIndex((a) => a.id === selectedId) === 0}
            className="p-1 text-gray-700 hover:bg-gray-200 disabled:opacity-30 rounded cursor-pointer"
            title="تحريك لأعلى"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const idx = animations.findIndex((a) => a.id === selectedId);
              if (idx !== -1) handleMove(idx, 'down');
            }}
            disabled={
              !selectedId ||
              animations.findIndex((a) => a.id === selectedId) === animations.length - 1
            }
            className="p-1 text-gray-700 hover:bg-gray-200 disabled:opacity-30 rounded cursor-pointer"
            title="تحريك لأسفل"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          {selectedId && (
            <button
              onClick={() => handleDelete(selectedId)}
              className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
              title="حذف الحركة"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Add Quick Animation Dropdown */}
      <div className="p-3 border-b border-gray-200 bg-orange-50/50">
        <label className="block text-[11px] font-bold text-gray-700 mb-1">
          + إضافة حركة سريعة للعنصر:
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            onClick={() => handleAddAnimation('entrance', 'fly-in', 'طيران للداخل')}
            className="p-1.5 bg-green-100 text-green-900 border border-green-300 rounded font-medium hover:bg-green-200 text-right truncate cursor-pointer"
          >
            🟢 طيران للداخل
          </button>
          <button
            onClick={() => handleAddAnimation('entrance', 'zoom', 'تكبير تدريجي')}
            className="p-1.5 bg-green-100 text-green-900 border border-green-300 rounded font-medium hover:bg-green-200 text-right truncate cursor-pointer"
          >
            🟢 تكبير Zoom
          </button>
          <button
            onClick={() => handleAddAnimation('emphasis', 'pulse', 'نبض توكيد')}
            className="p-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-medium hover:bg-amber-200 text-right truncate cursor-pointer"
          >
            🟡 نبض Pulse
          </button>
          <button
            onClick={() => handleAddAnimation('emphasis', 'spin', 'دوران Spin')}
            className="p-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-medium hover:bg-amber-200 text-right truncate cursor-pointer"
          >
            🟡 دوران Spin
          </button>
          <button
            onClick={() => handleAddAnimation('exit', 'fly-out', 'طيران للخارج')}
            className="p-1.5 bg-red-100 text-red-900 border border-red-300 rounded font-medium hover:bg-red-200 text-right truncate cursor-pointer"
          >
            🔴 طيران للخارج
          </button>
          <button
            onClick={() => handleAddAnimation('motion', 'bounce', 'وثب وارتداد')}
            className="p-1.5 bg-blue-100 text-blue-900 border border-blue-300 rounded font-medium hover:bg-blue-200 text-right truncate cursor-pointer"
          >
            🔵 وثب Bounce
          </button>
        </div>
      </div>

      {/* Animation Sequence List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {animations.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs">
            لا توجد حركات مضافة لهذه الشريحة.<br />
            اختر حركة من الأعلى لإضافتها.
          </div>
        ) : (
          animations.map((anim, idx) => {
            const isSelected = anim.id === selectedId;
            const badgeColor =
              anim.category === 'entrance'
                ? 'bg-green-500'
                : anim.category === 'emphasis'
                ? 'bg-amber-500'
                : anim.category === 'exit'
                ? 'bg-red-500'
                : 'bg-blue-500';

            return (
              <div
                key={anim.id}
                onClick={() => setSelectedId(anim.id)}
                className={`p-2 rounded border cursor-pointer transition flex items-center justify-between text-xs ${
                  isSelected
                    ? 'border-[#d83b01] bg-orange-50 font-bold shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-700 font-mono">
                    {idx + 1}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${badgeColor}`} />
                  <span className="text-gray-800 truncate max-w-[120px]">
                    {anim.elementName || anim.effect}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <span>{anim.duration} ثانية</span>
                  <span className="bg-gray-100 px-1 rounded">
                    {anim.start === 'click' ? 'بالنقر' : anim.start === 'with-previous' ? 'مع السابق' : 'بعد السابق'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Timing and Options Panel */}
      {currentSelected && (
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs space-y-2">
          <div className="font-bold text-gray-800 text-[11px] mb-1">
            خيارات التوقيت والتشغيل:
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-600">البدء (Start):</label>
            <select
              value={currentSelected.start}
              onChange={(e) => handleUpdateSelected('start', e.target.value)}
              className="border border-gray-300 rounded px-2 py-0.5 bg-white text-xs"
            >
              <option value="click">عند النقر (On Click)</option>
              <option value="with-previous">مع السابق (With Previous)</option>
              <option value="after-previous">بعد السابق (After Previous)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-600">المدة (Duration):</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0.1"
                max="10"
                step="0.25"
                value={currentSelected.duration}
                onChange={(e) => handleUpdateSelected('duration', parseFloat(e.target.value) || 1)}
                className="w-16 border border-gray-300 rounded px-1.5 py-0.5 text-center bg-white"
              />
              <span className="text-gray-500">ثانية</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-600">التأخير (Delay):</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="10"
                step="0.25"
                value={currentSelected.delay}
                onChange={(e) => handleUpdateSelected('delay', parseFloat(e.target.value) || 0)}
                className="w-16 border border-gray-300 rounded px-1.5 py-0.5 text-center bg-white"
              />
              <span className="text-gray-500">ثانية</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
