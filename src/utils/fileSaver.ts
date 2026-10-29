/**
 * Utility to save files directly to the user's local device at any chosen location,
 * preserving the primary extension as requested.
 */

export interface SaveFileOptions {
  filename: string;
  data: Blob | Uint8Array | ArrayBuffer | string;
  mimeType: string;
  primaryExtension: string; // e.g. 'docx', 'xlsx', 'pptx', 'accdb', 'pdf'
  description?: string;
  fileHandle?: any; // Existing FileSystemFileHandle
}

interface NativeSaveFilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
}

export async function saveFileDirectlyToDevice({
  filename,
  data,
  mimeType,
  primaryExtension,
  description = 'ملف مستندات',
  fileHandle,
}: SaveFileOptions): Promise<{ success: boolean; filename: string; method: 'picker' | 'handle' | 'download'; fileHandle?: any }> {
  const cleanExt = primaryExtension.replace(/^\./, '').toLowerCase();
  
  // Ensure the filename strictly ends with the primary extension
  let finalFilename = filename.trim();
  if (!finalFilename.toLowerCase().endsWith(`.${cleanExt}`)) {
    // If it has another extension, replace it with the primary extension
    finalFilename = finalFilename.replace(/\.[^/.]+$/, '') + `.${cleanExt}`;
  }
  if (!finalFilename.toLowerCase().endsWith(`.${cleanExt}`)) {
    finalFilename = `${finalFilename}.${cleanExt}`;
  }

  // Convert data to Blob if it's not already
  let blob: Blob;
  if (data instanceof Blob) {
    blob = data;
  } else if (typeof data === 'string') {
    blob = new Blob([data], { type: mimeType });
  } else {
    // ArrayBuffer or Uint8Array
    blob = new Blob([data as unknown as BlobPart], { type: mimeType });
  }

  // 1. Direct write to existing FileHandle if previously saved or opened
  if (fileHandle && typeof fileHandle.createWritable === 'function') {
    try {
      const writableStream = await fileHandle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();

      return {
        success: true,
        filename: fileHandle.name || finalFilename,
        method: 'handle',
        fileHandle,
      };
    } catch (handleErr) {
      console.warn('Direct write to existing handle failed, prompting picker:', handleErr);
    }
  }

  // 2. Try Native File System Access API (showSaveFilePicker)
  // This allows the user to select the exact destination folder on their computer
  if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
    try {
      const pickerOpts: NativeSaveFilePickerOptions = {
        suggestedName: finalFilename,
        types: [
          {
            description: `${description} (*.${cleanExt})`,
            accept: {
              [mimeType]: [`.${cleanExt}`],
            },
          },
        ],
      };

      const newHandle = await (window as unknown as { showSaveFilePicker: (opts: NativeSaveFilePickerOptions) => Promise<FileSystemFileHandle> }).showSaveFilePicker(pickerOpts);
      const writableStream = await newHandle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();

      return {
        success: true,
        filename: newHandle.name || finalFilename,
        method: 'picker',
        fileHandle: newHandle,
      };
    } catch (err: unknown) {
      // User cancelled picker or permission was denied
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('تم إلغاء عملية الحفظ بواسطة المستخدم');
      }
      // If error was due to iframe restriction or unsupported mimeType, fallback to standard download
      console.warn('showSaveFilePicker failed or restricted, falling back to download:', err);
    }
  }

  // 2. Fallback to browser direct download link with strict filename & original extension
  try {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = finalFilename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 1000);

    return {
      success: true,
      filename: finalFilename,
      method: 'download',
    };
  } catch (error) {
    console.error('Failed to save file:', error);
    throw new Error('تعذر إتمام عملية الحفظ على الجهاز');
  }
}
