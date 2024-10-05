'use client';

import { IMarketTabsMenuItem } from "@/types/market";
import { cn } from "@/utils/cn";
import '@/app/(market)/styles/marketTabsMenu.css'

interface MarketTabsMenuProps {
  tabList?: IMarketTabsMenuItem[];
  selectedTabIndex?: number;
  onTabChange?: (index: number) => void;
}

const MarketTabsMenu: React.FC<MarketTabsMenuProps> = ({
  tabList = [],
  selectedTabIndex = 0,
  onTabChange,
}) => {
  return (
    <div className="flex overflow-auto mb-3 gap-1 rounded-full" id="market-tab-menu">
      {tabList.map((item, index) => (
        <button
          key={index}
          className={cn(
            'min-w-60 rounded-full py-5 transition-colors max-md:min-w-24',
            selectedTabIndex === index ? 'bg-zinc-800 text-white' : 'text-zinc-400 bg-zinc-900'
          )}
          onClick={() => {
            if (onTabChange) {
              onTabChange(index);
            }
          }}
        >
          <p className="text-base font-medium">{item.label}</p>
          {/* {item.image && (
            <Image
              src={item.image}
              alt="tab image"
              height={3600}
              width={3600}
              style={{ width: 'auto', height: '56px' }}
            />
          )} */}
        </button>
      ))}
    </div>
  )
}

export default MarketTabsMenu;