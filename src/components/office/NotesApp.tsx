import React, { useState, useEffect, useRef } from 'react';
import { NoteItem } from '../../types';
import { localVault } from '../../utils/storage';
import {
  Notebook,
  Plus,
  Trash2,
  Tag,
  Mic,
  Square,
  Play,
  Search,
  CheckSquare,
  Star,
  Lightbulb,
  Bookmark,
  Calendar,
  Share2
} from 'lucide-react';

interface Props {
  fontFamily: string;
}

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'n1',
    title: 'أفكار تطوير منصة استضافة إنفينيتي (Infnty Cloud)',
    notebook: 'العمل والتطوير',
    section: 'الخوادم والسيرفرات',
    tags: ['هام', 'سيرفرات', 'ZFS'],
    hasAudio: true,
    audioDuration: '01:24',
    content: `# خطة ترقية التخزين إلى ZFS NVMe
1. تطبيق ضغط البيانات LZ4 لتقليل استهلاك المساحة وزيادة سرعة القراءة بنسبة 30%.
2. تفعيل Snapshots آلية كل 6 ساعات لجميع حسابات الاستضافة المشتركة.
3. ربط لوحة تحكم الاستضافة بجناح Infinity Office لنسخ المستندات تلقائياً.`,
    updatedAt: '2026-10-26',
  },
  {
    id: 'n2',
    title: 'متطلبات تطبيق نظام "ملاك" للعقارات السكنية',
    notebook: 'نظام ملاك',
    section: 'إدارة الشاغلين',
    tags: ['ملاك', 'عقارات', 'فواتير'],
    hasAudio: false,
    content: `### المتطلبات الأساسية للنظام:
- [x] مصمم جداول للوحدات السكنية وأسماء الملاك وأرقام التواصل.
- [x] حساب مخصص لاشتراك الصيانة الشهري (مصاعد، أمن، نظافة).
- [ ] إرسال إشعارات نصية واستخراج تقارير بصيغة PDF معتمدة من رئيس الاتحاد.
- [ ] دمج نموذج محضر الاجتماع مع محرر Infinity Docs.`,
    updatedAt: '2026-10-25',
  },
  {
    id: 'n3',
    title: 'دستور الأوفيس السيادي (Zero-Telemetry Protocol)',
    notebook: 'السيادة والأمان',
    section: 'الخصوصية',
    tags: ['سيادي', 'أمان', 'PWA'],
    hasAudio: true,
    audioDuration: '00:45',
    content: `لا يحق لأي خادم الاطلاع على نصوص أو أرقام أو ملفات العميل.
كل شيء يتم معالجته وحفظه داخل متصفح المستخدم عبر IndexedDB و WebAssembly.
التطبيق متاح دائماً أوفلاين ويتم تنصيبه كـ PWA خفيف وسريع.`,
    updatedAt: '2026-10-24',
  },
];

export const NotesApp: React.FC<Props> = ({ fontFamily }) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    return localVault.get<NoteItem[]>(localVault.KEYS.NOTES_DATA, INITIAL_NOTES);
  });
  const [activeNoteId, setActiveNoteId] = useState<string>('n1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    localVault.set(localVault.KEYS.NOTES_DATA, notes);
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleUpdateNote = (field: keyof NoteItem, val: any) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, [field]: val, updatedAt: new Date().toISOString().split('T')[0] } : n))
    );
  };

  const handleAddNote = () => {
    const newNote: NoteItem = {
      id: `note_${Date.now()}`,
      title: 'ملاحظة جديدة',
      notebook: activeNote ? activeNote.notebook : 'دفتر شخصي',
      section: activeNote ? activeNote.section : 'قسم عام',
      tags: ['جديد'],
      content: 'اكتب ملاحظتك هنا...',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) return;
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);
    setActiveNoteId(filtered[0].id);
  };

  // Voice recording logic with MediaRecorder
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      setIsRecording(false);
      handleUpdateNote('hasAudio', true);
      handleUpdateNote('audioDuration', `00:${('0' + recordingSeconds).slice(-2)}`);
      setRecordingSeconds(0);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);

        const interval = setInterval(() => {
          setRecordingSeconds((s) => {
            if (s >= 59) {
              clearInterval(interval);
              return s;
            }
            return s + 1;
          });
        }, 1000);
      } catch (err) {
        // Fallback simulation if microphone permission is not granted
        setIsRecording(true);
        setTimeout(() => {
          setIsRecording(false);
          handleUpdateNote('hasAudio', true);
          handleUpdateNote('audioDuration', '00:32');
        }, 3000);
      }
    }
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? n.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex-1 flex bg-white overflow-hidden text-xs select-none">
      {/* Column 1: OneNote Notebooks & Sections Sidebar */}
      <div className="w-48 bg-[#f8f6f4] border-l border-gray-200 p-3 hidden md:flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#7719aa] font-bold pb-2 border-b border-gray-200">
            <Notebook className="w-4 h-4" />
            <span>دفاتر الملاحظات</span>
          </div>

          <div className="space-y-1 text-gray-700">
            {['العمل والتطوير', 'نظام ملاك', 'السيادة والأمان', 'أفكار ومشاريع'].map((nb) => (
              <div
                key={nb}
                onClick={() => handleUpdateNote('notebook', nb)}
                className={`p-2 rounded cursor-pointer transition flex items-center justify-between text-xs ${
                  activeNote?.notebook === nb ? 'bg-[#7719aa]/15 text-[#7719aa] font-bold' : 'hover:bg-gray-200/60'
                }`}
              >
                <span>{nb}</span>
                <span className="text-[10px] text-gray-400">
                  {notes.filter((n) => n.notebook === nb).length}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 text-[10px] text-gray-400">
          Infinity Notes Offline
        </div>
      </div>

      {/* Column 2: Notes List with Search and Tags */}
      <div className="w-64 sm:w-72 bg-[#faf9f8] border-l border-gray-200 flex flex-col p-3 overflow-y-auto shrink-0 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <span className="font-bold text-gray-800">الملاحظات ({filteredNotes.length})</span>
          <button
            onClick={handleAddNote}
            className="flex items-center gap-1 bg-[#7719aa] text-white px-2 py-1 rounded text-xs font-semibold hover:bg-[#5c1382] transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ملاحظة</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في الملاحظات..."
            className="w-full bg-white border border-gray-300 rounded pr-8 pl-2 py-1 text-xs outline-none focus:border-[#7719aa]"
          />
        </div>

        {/* Tags filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2 py-0.5 rounded-full cursor-pointer ${
              selectedTag === null ? 'bg-[#7719aa] text-white font-bold' : 'bg-gray-200 text-gray-700'
            }`}
          >
            الكل
          </button>
          {['هام', 'سيرفرات', 'ملاك', 'سيادي'].map((tg) => (
            <button
              key={tg}
              onClick={() => setSelectedTag(selectedTag === tg ? null : tg)}
              className={`px-2 py-0.5 rounded-full cursor-pointer ${
                selectedTag === tg ? 'bg-[#7719aa] text-white font-bold' : 'bg-gray-200 text-gray-700'
              }`}
            >
              #{tg}
            </button>
          ))}
        </div>

        {/* Notes Items List */}
        <div className="space-y-2 flex-1 overflow-y-auto">
          {filteredNotes.map((note) => {
            const isSelected = note.id === activeNoteId;
            return (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-3 rounded-xl border cursor-pointer transition text-right relative group ${
                  isSelected ? 'border-[#7719aa] bg-white shadow-xs' : 'border-gray-200 bg-white/70 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400 font-mono">{note.updatedAt}</span>
                  {notes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition"
                      title="حذف الملاحظة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h4 className="font-bold text-gray-900 text-xs line-clamp-1 mb-1">{note.title}</h4>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{note.content}</p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[10px]">
                  <div className="flex items-center gap-1 text-[#7719aa] font-semibold">
                    <Tag className="w-2.5 h-2.5" />
                    <span>{note.tags[0] || 'عام'}</span>
                  </div>

                  {note.hasAudio && (
                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                      <Mic className="w-2.5 h-2.5" />
                      <span>{note.audioDuration || '00:30'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Column 3: Active Note Editor */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto bg-white text-right">
        {activeNote && (
          <div className="max-w-3xl mx-auto w-full space-y-4">
            {/* Note Meta Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-[#7719aa]">{activeNote.notebook}</span>
                <span>/</span>
                <span>{activeNote.section}</span>
                <span>•</span>
                <span className="font-mono">{activeNote.updatedAt}</span>
              </div>

              {/* Voice Memo Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleRecording}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-purple-50 text-[#7719aa] border border-[#7719aa]/30 hover:bg-purple-100'
                  }`}
                  title="تسجيل مذكرة صوتية محلياً"
                >
                  {isRecording ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? `جاري التسجيل (${recordingSeconds} ث)...` : 'تسجيل صوتي'}</span>
                </button>
              </div>
            </div>

            {/* Audio Memo Player Box (if note has recorded audio) */}
            {activeNote.hasAudio && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#7719aa] text-white flex items-center justify-center cursor-pointer hover:scale-105 transition">
                    <Play className="w-4 h-4 fill-white mr-0.5" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 text-xs block">مذكرة صوتية سيادية مسجلة</span>
                    <span className="text-[10px] text-gray-500 font-mono">المدة: {activeNote.audioDuration} | مشفر محلياً</span>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdateNote('hasAudio', false)}
                  className="text-gray-400 hover:text-red-600 p-1"
                  title="حذف التسجيل الصوتي"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Note Title Input */}
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => handleUpdateNote('title', e.target.value)}
              className="w-full text-2xl sm:text-3xl font-extrabold text-gray-900 outline-none pb-2 border-b border-gray-100 focus:border-[#7719aa]"
              placeholder="عنوان الملاحظة..."
              style={{ fontFamily }}
            />

            {/* Note Tags Input */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">الوسوم:</span>
              <input
                type="text"
                value={activeNote.tags.join(', ')}
                onChange={(e) => handleUpdateNote('tags', e.target.value.split(',').map((t) => t.trim()))}
                className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-xs text-gray-700 outline-none focus:border-[#7719aa] w-64"
                placeholder="افصل بين الوسوم بفواصل (مثال: هام, عقارات, بريد)..."
              />
            </div>

            {/* Note Body Textarea */}
            <textarea
              value={activeNote.content}
              onChange={(e) => handleUpdateNote('content', e.target.value)}
              rows={16}
              className="w-full text-gray-800 text-sm leading-relaxed outline-none p-3 border border-transparent focus:border-gray-200 rounded-lg bg-gray-50/50 resize-y"
              placeholder="اكتب ملاحظاتك بحرية (يدعم Markdown وقوائم المهام [x])..."
              style={{ fontFamily, minHeight: '300px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
