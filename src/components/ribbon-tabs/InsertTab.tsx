import React, { useRef, useState } from 'react';
import { 
  FilePlus, 
  FileText, 
  Scissors, 
  Table, 
  Image, 
  Shapes, 
  Smile, 
  Box, 
  Network, 
  BarChart3, 
  Camera, 
  Puzzle, 
  Video, 
  Link2, 
  Bookmark, 
  GitFork, 
  MessageSquarePlus, 
  PanelTop, 
  PanelBottom, 
  Hash, 
  SquareDashed, 
  Sparkles, 
  PenTool, 
  Calendar, 
  Layers, 
  Pi, 
  Sigma,
  QrCode,
  Award,
  Globe
} from 'lucide-react';
import { insertHTMLAtCursor } from '../../utils/editorCommands';

interface InsertTabProps {
  onOpenTableModal: () => void;
  onOpenShapeModal: () => void;
  onOpenSymbolModal: (tab: 'symbol' | 'equation') => void;
  onOpenComments: () => void;
  onContentChange?: () => void;
}

export const InsertTab: React.FC<InsertTabProps> = ({
  onOpenTableModal,
  onOpenShapeModal,
  onOpenSymbolModal,
  onOpenComments,
  onContentChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAddinsMenu, setShowAddinsMenu] = useState(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          insertHTMLAtCursor(`
            <figure class="my-4 text-center inline-block max-w-full">
              <img src="${dataUrl}" alt="${file.name}" class="rounded-lg shadow border border-slate-200 max-h-80 mx-auto object-cover" />
              <figcaption class="text-xs text-slate-500 mt-1 italic">${file.name}</figcaption>
            </figure>
            <p><br></p>
          `);
          onContentChange?.();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const insertCoverPage = () => {
    const coverHtml = `
      <div class="cover-page p-12 my-6 bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-lg text-center shadow-lg min-h-[400px] flex flex-col justify-between" contenteditable="true">
        <div>
          <p class="text-blue-300 font-semibold tracking-widest text-sm mb-4">تقرير رسمي معتمد</p>
          <h1 class="text-4xl font-extrabold mb-4 text-white">عنوان المستند الرئيسي هنا</h1>
          <h3 class="text-xl text-blue-200 font-light">العنوان الفرعي أو بيان الغرض من الوثيقة</h3>
        </div>
        <div class="border-t border-blue-800/80 pt-6 mt-12 flex justify-between text-xs text-blue-300">
          <div>إعداد: <strong>فريق العمل</strong></div>
          <div>التاريخ: <strong>${new Date().toLocaleDateString('ar-EG')}</strong></div>
        </div>
      </div>
      <div style="page-break-after: always;"></div>
      <p><br></p>
    `;
    insertHTMLAtCursor(coverHtml);
    onContentChange?.();
  };

  const insertBlankPage = () => {
    insertHTMLAtCursor('<div style="page-break-after: always; min-height: 200px;"><br></div><p><br></p>');
    onContentChange?.();
  };

  const insertPageBreak = () => {
    insertHTMLAtCursor('<div style="page-break-after: always;" class="border-b-2 border-dashed border-blue-400 my-4 text-center text-xs text-blue-500 select-none">┈┈┈┈ فاصل صفحة (Page Break) ┈┈┈┈</div><p><br></p>');
    onContentChange?.();
  };

  const insertImagePrompt = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const insertSmartArt = () => {
    insertHTMLAtCursor(`
      <div class="my-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <h4 class="text-xs font-bold text-slate-700 mb-3 text-center">مخطط تسلسلي ذكي (SmartArt - Process Flow)</h4>
        <div class="grid grid-cols-3 gap-3 text-center">
          <div class="p-3 bg-blue-600 text-white rounded-lg shadow-xs font-bold text-xs">1. التخطيط والتحليل</div>
          <div class="p-3 bg-indigo-600 text-white rounded-lg shadow-xs font-bold text-xs">2. التنفيذ والتطوير</div>
          <div class="p-3 bg-emerald-600 text-white rounded-lg shadow-xs font-bold text-xs">3. الإطلاق والتقييم</div>
        </div>
      </div>
      <p><br></p>
    `);
  };

  const insertChart = () => {
    insertHTMLAtCursor(`
      <div class="my-6 p-4 bg-white border border-slate-200 rounded-xl shadow-xs text-center">
        <div class="flex items-center justify-between border-b pb-2 mb-3">
          <span class="font-bold text-xs text-slate-700">مخطط إحصائي بياني (Chart)</span>
          <span class="text-[10px] text-slate-400">النمو السنوي</span>
        </div>
        <div class="flex items-end justify-center gap-6 h-36 pt-4 pb-2">
          <div class="flex flex-col items-center gap-1">
            <span class="text-[10px] text-slate-500">45%</span>
            <div class="w-10 bg-blue-400 rounded-t h-16"></div>
            <span class="text-[10px] font-bold">2023</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <span class="text-[10px] text-slate-500">70%</span>
            <div class="w-10 bg-blue-600 rounded-t h-24"></div>
            <span class="text-[10px] font-bold">2024</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <span class="text-[10px] text-slate-500">95%</span>
            <div class="w-10 bg-emerald-600 rounded-t h-32"></div>
            <span class="text-[10px] font-bold">2025</span>
          </div>
        </div>
      </div>
      <p><br></p>
    `);
  };

  const insertOnlineVideo = () => {
    const videoUrl = prompt('أدخل رابط فيديو YouTube / Vimeo:', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    if (videoUrl) {
      insertHTMLAtCursor(`
        <div class="my-4 p-4 bg-slate-900 text-white rounded-lg text-center flex items-center justify-center gap-3">
          <span class="text-rose-500 text-xl font-bold">▶</span>
          <span class="text-xs">فيديو عبر الإنترنت مدمج: <a href="${videoUrl}" target="_blank" class="underline text-blue-300">${videoUrl}</a></span>
        </div>
        <p><br></p>
      `);
    }
  };

  const insertHyperlink = () => {
    const url = prompt('أدخل عنوان الرابط (URL):', 'https://');
    const text = prompt('نص الرابط المراد عرضه:', 'اضغط هنا للزيارة');
    if (url && text) {
      insertHTMLAtCursor(`<a href="${url}" target="_blank" class="text-blue-600 underline font-medium hover:text-blue-800">${text}</a> `);
    }
  };

  const insertTextBox = () => {
    insertHTMLAtCursor(`
      <div class="my-4 p-4 bg-blue-50/70 border-2 border-blue-400 rounded-lg max-w-sm inline-block shadow-sm">
        <p class="font-bold text-xs text-blue-900 mb-1">مربع نص جانبي (Text Box)</p>
        <p class="text-xs text-blue-800 leading-relaxed">اكتب النص هنا للتركيز على نقطة محورية أو ملخص سريع.</p>
      </div>
      <p><br></p>
    `);
  };

  const insertWordArt = () => {
    insertHTMLAtCursor(`
      <div class="my-4 text-center">
        <span class="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent drop-shadow-sm">
          Microsoft WordArt الإبداعي
        </span>
      </div>
      <p><br></p>
    `);
  };

  const insertSignatureLine = () => {
    insertHTMLAtCursor(`
      <div class="my-8 inline-block text-center border-t border-slate-600 pt-2 min-w-[200px]">
        <p class="text-xs font-bold text-slate-800">سطر التوقيع والاعتماد الرسمى</p>
        <p class="text-[11px] text-slate-500 mt-1">الاسم: .......................................</p>
        <p class="text-[11px] text-slate-500">التاريخ: .... / .... / 2026</p>
      </div>
      <p><br></p>
    `);
  };

  const insertDateTime = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    insertHTMLAtCursor(` <span class="font-medium text-slate-700">${formatted}</span> `);
  };

  return (
    <div className="flex items-stretch h-[96px] py-1 px-2 overflow-x-auto text-slate-700 select-none divide-x divide-x-reverse divide-slate-200" dir="rtl">
      
      {/* 1. Pages (صفحات) */}
      <div className="flex flex-col justify-between px-2 min-w-[125px] shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={insertCoverPage}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-slate-800 text-center"
            title="إدراج صفحة غلاف منسقة"
          >
            <div className="p-1.5 bg-blue-50 text-[#2b579a] rounded">
              <FilePlus className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-1">صفحة غلاف</span>
          </button>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={insertBlankPage}
              className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            >
              <FileText className="w-3 h-3 text-slate-500" />
              <span>صفحة فارغة</span>
            </button>
            <button
              onClick={insertPageBreak}
              className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            >
              <Scissors className="w-3 h-3 text-slate-500" />
              <span>فاصل صفحة</span>
            </button>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">صفحات (Pages)</span>
      </div>

      {/* 2. Tables (جداول) */}
      <div className="flex flex-col justify-between px-2 min-w-[80px] shrink-0">
        <button
          onClick={onOpenTableModal}
          className="flex flex-col items-center justify-center p-2 hover:bg-slate-200 rounded text-slate-800 group"
          title="إدراج جدول"
        >
          <div className="w-8 h-8 rounded bg-blue-50 text-[#2b579a] flex items-center justify-center border border-blue-200 group-hover:bg-blue-100 transition-colors">
            <Table className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium mt-1">جدول</span>
        </button>
        <span className="text-[10px] text-slate-400 text-center font-medium">جداول</span>
      </div>

      {/* 3. Illustrations (رسومات توضيحية) */}
      <div className="flex flex-col justify-between px-2 min-w-[210px] shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={insertImagePrompt}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-[10px]"
            title="إدراج صور"
          >
            <Image className="w-4 h-4 text-emerald-600 mb-1" />
            <span>صور</span>
          </button>
          <button
            onClick={onOpenShapeModal}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-[10px]"
            title="إدراج أشكال هندسية"
          >
            <Shapes className="w-4 h-4 text-blue-600 mb-1" />
            <span>أشكال</span>
          </button>
          <button
            onClick={() => onOpenSymbolModal('symbol')}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-[10px]"
            title="أيقونات ورموز"
          >
            <Smile className="w-4 h-4 text-amber-600 mb-1" />
            <span>أيقونات</span>
          </button>
          <button
            onClick={insertSmartArt}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-[10px]"
            title="مخطط SmartArt"
          >
            <Network className="w-4 h-4 text-indigo-600 mb-1" />
            <span>SmartArt</span>
          </button>
          <button
            onClick={insertChart}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-[10px]"
            title="إدراج مخطط بياني"
          >
            <BarChart3 className="w-4 h-4 text-rose-600 mb-1" />
            <span>مخطط</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">رسومات توضيحية</span>
      </div>

      {/* Hidden image file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 4. Add-ins & Media */}
      <div className="flex flex-col justify-between px-2 min-w-[110px] shrink-0 relative">
        <div className="flex flex-col gap-0.5 justify-center py-1">
          <div className="relative">
            <button
              onClick={() => setShowAddinsMenu(!showAddinsMenu)}
              className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px] w-full"
              title="وظائف Microsoft Office الإضافية"
            >
              <Puzzle className="w-3.5 h-3.5 text-blue-600" />
              <span>وظائف إضافية</span>
            </button>

            {/* Add-ins floating quick picker */}
            {showAddinsMenu && (
              <div 
                className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-300 rounded-lg shadow-xl p-2 z-50 text-right space-y-1.5"
                dir="rtl"
              >
                <div className="text-[10px] font-bold text-slate-700 pb-1 border-b border-slate-200">
                  متجر الإضافات المعتمدة
                </div>
                <button
                  onClick={() => {
                    const qrText = prompt('أدخل الرابط أو النص لتوليد رمز QR له:', 'https://all-docu.vercel.app');
                    if (qrText) {
                      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrText)}`;
                      insertHTMLAtCursor(`
                        <figure class="my-4 text-center inline-block">
                          <img src="${qrUrl}" alt="QR Code" class="w-32 h-32 mx-auto rounded border border-slate-300 shadow-xs" />
                          <figcaption class="text-[10px] text-slate-500 mt-1 font-mono">${qrText}</figcaption>
                        </figure>
                        <p><br></p>
                      `);
                      onContentChange?.();
                    }
                    setShowAddinsMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded text-xs text-slate-700 text-right"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>توليد رمز استجابة (QR)</span>
                </button>

                <button
                  onClick={() => {
                    insertHTMLAtCursor(`
                      <div class="my-4 inline-block p-3 border-2 border-amber-500 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-900 text-center shadow-xs">
                        <div class="text-xs font-extrabold uppercase tracking-widest text-amber-800">★ وثيقة سيادية معتمدة ★</div>
                        <div class="text-[10px] text-amber-700 mt-0.5">SOVEREIGN SUITE VERIFIED • ${new Date().toLocaleDateString('ar-EG')}</div>
                      </div>
                      <p><br></p>
                    `);
                    onContentChange?.();
                    setShowAddinsMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1 hover:bg-amber-50 rounded text-xs text-slate-700 text-right"
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>ختم اعتماد رسمي ذهبي</span>
                </button>

                <button
                  onClick={() => {
                    insertHTMLAtCursor(`
                      <div class="my-4 p-3 bg-slate-50 border border-slate-300 rounded-lg max-w-md">
                        <div class="flex items-center gap-1.5 font-bold text-xs text-slate-800 mb-1">
                          <span class="text-blue-600">🌐</span>
                          <span>مرجع توثيقي من الموسوعة</span>
                        </div>
                        <p class="text-xs text-slate-600 leading-relaxed">
                          نظام إدارة المستندات (EDMS) هو حل برمجي متكامل يهدف إلى أرشفة وتأمين وحوكمة الوثائق الإلكترونية وفق أعلى معايير الخصوصية.
                        </p>
                      </div>
                      <p><br></p>
                    `);
                    onContentChange?.();
                    setShowAddinsMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1 hover:bg-slate-100 rounded text-xs text-slate-700 text-right"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>بطاقة توثيق معرفية</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={insertOnlineVideo}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Video className="w-3.5 h-3.5 text-rose-600" />
            <span>فيديو عبر الإنترنت</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">وسائط وإضافات</span>
      </div>

      {/* 5. Links & Comments */}
      <div className="flex flex-col justify-between px-2 min-w-[115px] shrink-0">
        <div className="flex flex-col gap-0.5 justify-center py-0.5">
          <button
            onClick={insertHyperlink}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Link2 className="w-3.5 h-3.5 text-blue-600" />
            <span>رابط (Link)</span>
          </button>
          <button
            onClick={() => {
              const name = prompt('اسم الإشارة المرجعية (Bookmark name):', 'نقطة_هامة');
              if (name) {
                insertHTMLAtCursor(`<a id="${name}" class="bookmark text-slate-400 text-xs">🔖</a>`);
                onContentChange?.();
              }
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span>إشارة مرجعية</span>
          </button>
          <button
            onClick={onOpenComments}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px] text-[#2b579a] font-bold"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>تعليق (Comment)</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">ارتباطات وتعليقات</span>
      </div>

      {/* 6. Header & Footer */}
      <div className="flex flex-col justify-between px-2 min-w-[110px] shrink-0">
        <div className="flex flex-col gap-0.5 justify-center py-0.5">
          <button
            onClick={() => {
              const h = prompt('نص رأس الصفحة (Header):', 'المستند الرسمي - شركة المستقبل');
              if (h) {
                const headEl = document.getElementById('doc-header-text');
                if (headEl) headEl.innerText = h;
                onContentChange?.();
              }
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <PanelTop className="w-3.5 h-3.5 text-slate-600" />
            <span>رأس الصفحة</span>
          </button>
          <button
            onClick={() => {
              const f = prompt('نص تذييل الصفحة (Footer):', 'جميع الحقوق محفوظة © 2026');
              if (f) {
                const footEl = document.getElementById('doc-footer-text');
                if (footEl) footEl.innerText = f;
                onContentChange?.();
              }
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <PanelBottom className="w-3.5 h-3.5 text-slate-600" />
            <span>تذييل الصفحة</span>
          </button>
          <button
            onClick={() => {
              insertHTMLAtCursor(`
                <div class="my-4 text-center select-none" contenteditable="false">
                  <span class="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-xs font-mono font-bold text-slate-700 shadow-2xs">
                    📄 صفحة 1 من 1
                  </span>
                </div>
                <p><br></p>
              `);
              onContentChange?.();
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            title="إدراج رقم الصفحة الحالي"
          >
            <Hash className="w-3.5 h-3.5 text-slate-600" />
            <span>رقم الصفحة</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">رأس وتذييل</span>
      </div>

      {/* 7. Text (نص) */}
      <div className="flex flex-col justify-between px-2 min-w-[130px] shrink-0">
        <div className="flex flex-col gap-0.5 justify-center py-0.5">
          <button
            onClick={insertTextBox}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <SquareDashed className="w-3.5 h-3.5 text-blue-600" />
            <span>مربع نص</span>
          </button>
          <button
            onClick={insertWordArt}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>WordArt</span>
          </button>
          <button
            onClick={insertSignatureLine}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <PenTool className="w-3.5 h-3.5 text-slate-700" />
            <span>سطر التوقيع</span>
          </button>
          <button
            onClick={insertDateTime}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>التاريخ والوقت</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">نص (Text)</span>
      </div>

      {/* 8. Symbols (رموز) */}
      <div className="flex flex-col justify-between px-2 min-w-[90px] shrink-0">
        <div className="flex flex-col gap-1 justify-center py-1">
          <button
            onClick={() => onOpenSymbolModal('equation')}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-xs text-slate-800"
            title="إدراج معادلة رياضية"
          >
            <Pi className="w-4 h-4 text-[#2b579a]" />
            <span>معادلة</span>
          </button>
          <button
            onClick={() => onOpenSymbolModal('symbol')}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-xs text-slate-800"
            title="إدراج رمز خاص"
          >
            <Sigma className="w-4 h-4 text-emerald-600" />
            <span>رمز</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">رموز (Symbols)</span>
      </div>

    </div>
  );
};
