export interface ShareTarget {
  title: string;
  text: string;
  url: string;
}

export const shareLinks = ({ text, url }: ShareTarget) => ({
  whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
});

/** Uses the native share sheet where available, otherwise the caller falls back to the menu. */
export const nativeShare = async (target: ShareTarget) => {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(target);
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

export const copyLink = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
};

export const downloadCsv = (filename: string, rows: (string | number)[][]) => {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
