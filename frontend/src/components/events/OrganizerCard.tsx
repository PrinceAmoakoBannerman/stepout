import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import type { Organizer } from '@/types';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { useApp } from '@/store/AppContext';
import { compact } from '@/utils/format';

export const OrganizerCard = ({ organizer }: { organizer: Organizer }) => {
  const { followingIds, toggleFollow } = useApp();
  const following = followingIds.includes(organizer.id);

  return (
    <div className="card flex flex-col p-3 sm:p-5">
      <div className="flex items-center gap-2 sm:gap-3">
        <Avatar name={organizer.name} src={organizer.avatar} size="sm" className="h-9 w-9 text-xs sm:h-12 sm:w-12 sm:text-sm" />
        <div className="min-w-0">
          <Link to={`/organizers/${organizer.id}`} className="flex items-center gap-1 font-display text-sm font-bold hover:underline sm:text-base">
            <span className="truncate">{organizer.name}</span>
            {organizer.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-green sm:h-4 sm:w-4" />}
          </Link>
          <p className="truncate font-mono text-[9px] uppercase tracking-wider text-muted sm:text-[10px]">@{organizer.handle}</p>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 flex-1 text-xs text-muted sm:mt-3 sm:text-sm">{organizer.bio}</p>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3 sm:mt-4 sm:gap-3 sm:pt-4">
        <div className="flex gap-2.5 text-[10px] text-muted sm:gap-4 sm:text-xs">
          <span>
            <strong className="block font-display text-xs text-fg sm:text-sm">{compact(organizer.followers)}</strong>
            followers
          </span>
          <span>
            <strong className="block font-display text-xs text-fg sm:text-sm">{organizer.eventsHosted}</strong>
            events
          </span>
        </div>
        <Button
          size="sm"
          variant={following ? 'outline' : 'primary'}
          onClick={() => toggleFollow(organizer.id)}
          className="h-8 px-2.5 text-xs sm:h-9 sm:px-3.5 sm:text-sm"
        >
          {following ? 'Following' : 'Follow'}
        </Button>
      </div>
    </div>
  );
};
