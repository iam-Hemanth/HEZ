import { Home, Compass, Heart, UserCircle } from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const navItems = [
    { name: "Home", icon: Home },
    { name: "Discovery", icon: Compass },
    { name: "Bookmarks", icon: Heart },
    { name: "Settings", icon: UserCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/90 backdrop-blur-md border-t border-white/5 md:hidden pb-safe pt-2 px-6 pb-2">
      <div className="flex justify-between items-center w-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.name;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                isActive ? "text-blue-500" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform ${isActive ? "scale-110" : ""}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
