'use client';

import { IProfileTabsMenuItem } from "@/types/profile";
import { cn } from "@/utils/cn";

interface ProfileTabsMenuProps {
  tabList?: IProfileTabsMenuItem[];
  selectedTabIndex?: number;
  onTabChange?: (index: number) => void;
}

const ProfileTabsMenu: React.FC<ProfileTabsMenuProps> = ({
  tabList = [],
  selectedTabIndex = 0,
  onTabChange,
}) => {
  return (
    <div className="flex gap-1 rounded-full w-full">
      {tabList.map((item, index) => (
        <button
          key={index}
          className={cn(
            'rounded-full py-5 transition-colors w-full text-wrap px-1',
            selectedTabIndex === index ? 'bg-zinc-800 text-white' : 'text-zinc-400 bg-zinc-900'
          )}
          onClick={() => {
            if (onTabChange) {
              onTabChange(index);
            }
          }}
        >
          <p className="text-base font-medium">{item.label}</p>
        </button>
      ))}
    </div>
  )
}

export default ProfileTabsMenu;