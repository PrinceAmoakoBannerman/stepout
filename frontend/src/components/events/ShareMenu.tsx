import { Facebook, Link2, MessageCircle, Share2, Twitter } from 'lucide-react';
import { Dropdown, DropdownItem } from '@/components/common/Dropdown';
import { useApp } from '@/store/AppContext';
import { copyLink, nativeShare, shareLinks } from '@/utils/share';
import { cn } from '@/utils/cn';

export const ShareMenu = ({
  title,
  path,
  variant = 'icon',
}: {
  title: string;
  path: string;
  variant?: 'icon' | 'full';
}) => {
  const { toast } = useApp();
  const url = `${window.location.origin}${path}`;
  const target = { title, text: `${title} — on StepOut`, url };
  const links = shareLinks(target);

  const open = (href: string) => window.open(href, '_blank', 'noopener,noreferrer');

  return (
    <Dropdown
      trigger={({ toggle }) => (
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const shared = await nativeShare(target);
            if (!shared) toggle();
          }}
          aria-label="Share event"
          className={cn(
            variant === 'icon'
              ? 'flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-fg'
              : 'inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-semibold hover:bg-raised',
          )}
        >
          <Share2 className="h-[18px] w-[18px]" />
          {variant === 'full' && 'Share'}
        </button>
      )}
    >
      {(close) => (
        <>
          <DropdownItem
            onClick={async () => {
              const ok = await copyLink(url);
              toast(ok ? 'Link copied' : 'Could not copy the link', ok ? 'success' : 'error');
              close();
            }}
          >
            <Link2 className="h-4 w-4" /> Copy link
          </DropdownItem>
          <DropdownItem onClick={() => { open(links.whatsapp); close(); }}>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </DropdownItem>
          <DropdownItem onClick={() => { open(links.x); close(); }}>
            <Twitter className="h-4 w-4" /> X
          </DropdownItem>
          <DropdownItem onClick={() => { open(links.facebook); close(); }}>
            <Facebook className="h-4 w-4" /> Facebook
          </DropdownItem>
        </>
      )}
    </Dropdown>
  );
};
