/**
 * Windows & Arabic Font Manager
 * Supports native Windows system fonts, Chromium Local Font Access API,
 * and high quality web fonts.
 */

export interface FontOption {
  name: string;
  family: string;
  category: 'windows' | 'arabic-web' | 'system-local';
}

export const PRESET_FONTS: FontOption[] = [
  // Windows System Arabic & Core Fonts
  { name: 'Segoe UI (مايكروسوفت أوفيس الافتراضي)', family: "'Segoe UI', Tahoma, Arial, sans-serif", category: 'windows' },
  { name: 'Tahoma (ويندوز تاهوما الكلاسيكي)', family: "Tahoma, 'Segoe UI', Arial, sans-serif", category: 'windows' },
  { name: 'Calibri (ويندوز كاليبري)', family: "Calibri, 'Segoe UI', sans-serif", category: 'windows' },
  { name: 'Traditional Arabic (النسخ العربي للويندوز)', family: "'Traditional Arabic', serif", category: 'windows' },
  { name: 'Simplified Arabic (العربي المبسط للويندوز)', family: "'Simplified Arabic', Arial, sans-serif", category: 'windows' },
  { name: 'Arabic Typesetting (تنضيد عربي ملكي)', family: "'Arabic Typesetting', serif", category: 'windows' },
  { name: 'Andalus (أندلسي ويندوز)', family: 'Andalus, serif', category: 'windows' },
  { name: 'Arial (أريال الأساسي)', family: 'Arial, Helvetica, sans-serif', category: 'windows' },
  { name: 'Times New Roman (تايمز نيو رومان)', family: "'Times New Roman', Times, serif", category: 'windows' },
  { name: 'Consolas / Courier (شفرة برمجية للويندوز)', family: "Consolas, 'Courier New', monospace", category: 'windows' },

  // Top Arabic Web Fonts
  { name: 'Cairo (كايرو - حديث ومعاصر)', family: "'Cairo', 'Segoe UI', sans-serif", category: 'arabic-web' },
  { name: 'Tajawal (تجوّل - عصري خليجي)', family: "'Tajawal', 'Segoe UI', sans-serif", category: 'arabic-web' },
  { name: 'Almarai (المراعي - رسمي مؤسسي)', family: "'Almarai', 'Segoe UI', sans-serif", category: 'arabic-web' },
  { name: 'IBM Plex Sans Arabic (تقني هندسي)', family: "'IBM Plex Sans Arabic', sans-serif", category: 'arabic-web' },
  { name: 'Readex Pro (ريدكس - أنيق وسلس)', family: "'Readex Pro', sans-serif", category: 'arabic-web' },
  { name: 'Amiri (أميري - كلاسيكي نسخ شريف)', family: "'Amiri', 'Traditional Arabic', serif", category: 'arabic-web' },
];

/**
 * Attempt to query native Windows / OS installed local fonts
 * via Chromium `window.queryLocalFonts()` API if supported and permitted
 */
export async function queryWindowsInstalledFonts(): Promise<FontOption[]> {
  try {
    if ('queryLocalFonts' in window) {
      // @ts-ignore
      const availableFonts = await (window as any).queryLocalFonts();
      const uniqueFamilies = new Set<string>();
      const detected: FontOption[] = [];

      for (const fontData of availableFonts) {
        if (!uniqueFamilies.has(fontData.family)) {
          uniqueFamilies.add(fontData.family);
          detected.push({
            name: `${fontData.family} (من نظام ويندوز)`,
            family: `"${fontData.family}", sans-serif`,
            category: 'system-local',
          });
        }
      }
      return detected;
    }
  } catch (err) {
    console.info('Local Font Access API not available or user skipped permission:', err);
  }
  return [];
}
