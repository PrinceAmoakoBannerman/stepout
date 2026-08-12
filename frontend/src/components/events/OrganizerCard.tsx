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
    <div className="card flex flex-col p-5">
      <div className="flex items-center gap-3">
        <Avatar name={organizer.name} src={organizer.avatar} size="md" />
        <div className="min-w-0">
          <Link to={`/organizers/${organizer.id}`} className="flex items-center gap-1 font-display font-bold hover:underline">
            <span className="truncate">{organizer.name}</span>
            {organizer.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-green" />}
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">@{organizer.handle}</p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 flex-1 text-sm text-muted">{organizer.bio}</p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex gap-4 text-xs text-muted">
          <span>
            <strong className="block font-display text-sm text-fg">{compact(organizer.followers)}</strong>
            followers
          </span>
          <span>
            <strong className="block font-display text-sm text-fg">{organizer.eventsHosted}</strong>
            events
          </span>
        </div>
        <Button size="sm" variant={following ? 'outline' : 'primary'} onClick={() => toggleFollow(organizer.id)}>
          {following ? 'Following' : 'Follow'}
        </Button>
      </div>
    </div>
  );
};
