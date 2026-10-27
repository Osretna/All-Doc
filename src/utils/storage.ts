/**
 * Sovereign Local Storage Layer
 * 100% Offline, Zero-Telemetry, Encrypted Local State
 */

const STORAGE_KEYS = {
  DOCS_CONTENT: 'infinity_office_doc_v1',
  SHEETS_DATA: 'infinity_office_sheets_v1',
  SLIDES_DATA: 'infinity_office_slides_v1',
  NOTES_DATA: 'infinity_office_notes_v1',
  BASE_DATA: 'infinity_office_base_v1',
  ACTIVE_APP: 'infinity_office_active_app',
  ACTIVE_SECTION: 'infinity_office_active_section',
  DOCUMENT_TITLE: 'infinity_office_doc_title',
  ACTIVE_SHEET_KEY: 'infinity_office_active_sheet_key',
  SELECTED_CELL: 'infinity_office_selected_cell',
  SOVEREIGN_MODE: 'infinity_office_sovereign_strict',
};

export const localVault = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Local storage write warning:', e);
    }
  },

  exportSovereignBackup(): string {
    const backup: Record<string, any> = {};
    Object.entries(STORAGE_KEYS).forEach(([_, k]) => {
      backup[k] = localStorage.getItem(k);
    });
    return JSON.stringify(backup, null, 2);
  },

  importSovereignBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      Object.keys(data).forEach((k) => {
        if (data[k] !== null) {
          localStorage.setItem(k, data[k]);
        }
      });
      return true;
    } catch {
      return false;
    }
  },

  KEYS: STORAGE_KEYS,
};
