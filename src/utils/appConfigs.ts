import { OfficeAppId, AppThemeConfig } from '../types';

export const APP_CONFIGS: Record<OfficeAppId, AppThemeConfig> = {
  docs: {
    id: 'docs',
    name: 'Word (المستندات)',
    nameEn: 'Word',
    msEquivalent: 'Microsoft Word',
    primaryColor: '#0078d4', // Classic Office Word Blue
    accentColor: '#106ebe',
    badgeBg: 'bg-[#0078d4]',
    badgeText: 'text-white',
    iconName: 'FileText',
    description: 'محرر مستندات متقدم مع تخطيط صفحات وقوالب رسمية وتصدير .docx',
  },
  sheets: {
    id: 'sheets',
    name: 'Excel (الجداول)',
    nameEn: 'Excel',
    msEquivalent: 'Microsoft Excel',
    primaryColor: '#107c41', // Classic Office Excel Green
    accentColor: '#0b6a35',
    badgeBg: 'bg-[#107c41]',
    badgeText: 'text-white',
    iconName: 'Table',
    description: 'جداول حسابية متطورة مع دوال (SUM/AVG/IF) ورسوم بيانية وصيغ مالية',
  },
  slides: {
    id: 'slides',
    name: 'PowerPoint (العروض)',
    nameEn: 'PowerPoint',
    msEquivalent: 'Microsoft PowerPoint',
    primaryColor: '#d83b01', // PowerPoint Orange-Red
    accentColor: '#b33000',
    badgeBg: 'bg-[#d83b01]',
    badgeText: 'text-white',
    iconName: 'Presentation',
    description: 'صانع عروض تقديمية 16:9 مع وضع العارض والشاشات وقوالب خليجية',
  },
  notes: {
    id: 'notes',
    name: 'OneNote (الملاحظات)',
    nameEn: 'OneNote',
    msEquivalent: 'Microsoft OneNote',
    primaryColor: '#7719aa', // OneNote Purple
    accentColor: '#5c1382',
    badgeBg: 'bg-[#7719aa]',
    badgeText: 'text-white',
    iconName: 'Notebook',
    description: 'دفاتر ملاحظات مقسمة لأقسام، وسوم ذكية، وتسجيل مذكرات صوتية',
  },
  base: {
    id: 'base',
    name: 'Access (قواعد البيانات)',
    nameEn: 'Access',
    msEquivalent: 'Microsoft Access',
    primaryColor: '#a4373a', // Access Crimson
    accentColor: '#822b2e',
    badgeBg: 'bg-[#a4373a]',
    badgeText: 'text-white',
    iconName: 'Database',
    description: 'مصمم قواعد بيانات بصرية، نماذج إدخال، محرر استعلامات SQL وتصدير',
  },
  pdf: {
    id: 'pdf',
    name: 'PDF Studio (المستندات الرقمية)',
    nameEn: 'Acrobat',
    msEquivalent: 'Adobe Acrobat Pro',
    primaryColor: '#e81123', // PDF Scarlet
    accentColor: '#c50f1f',
    badgeBg: 'bg-[#e81123]',
    badgeText: 'text-white',
    iconName: 'FileCheck2',
    description: 'استعراض وتحرير وتوقيع رقمي للمستندات والأختام الرسمية المعتمدة',
  },
  photo: {
    id: 'photo',
    name: 'Photo Studio (محرر الصور)',
    nameEn: 'Photoshop Lite',
    msEquivalent: 'Photo Studio',
    primaryColor: '#002050', // Photo Navy
    accentColor: '#004c87',
    badgeBg: 'bg-[#002050]',
    badgeText: 'text-white',
    iconName: 'Image',
    description: 'محرر صور وفلاتر بصرية داخل المتصفح مع فلاتر WebGL وعلامات مائية',
  },
};
