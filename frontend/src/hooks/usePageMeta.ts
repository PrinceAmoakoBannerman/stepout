import { useEffect } from 'react';

const setMeta = (selector: string, attr: string, value: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    const [key, val] = selector.replace(/meta\[|\]/g, '').split('=');
    tag.setAttribute(key, val.replace(/"/g, ''));
    document.head.appendChild(tag);
  }
  tag.setAttribute(attr, value);
};

/** Per-route title, description and Open Graph tags. */
export const usePageMeta = (title: string, description?: string) => {
  useEffect(() => {
    document.title = title.includes('StepOut') ? title : `${title} · StepOut`;
    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
    }
    setMeta('meta[property="og:title"]', 'content', document.title);
  }, [title, description]);
};
