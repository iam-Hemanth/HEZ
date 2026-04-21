import { Home, Compass, Clock, Heart, Users, Calendar, Hash, Settings, LogOut, Search } from "lucide-react";

const mainLinks = [
  { name: "Home", icon: Home },
  { name: "Discovery", icon: Compass },
  { name: "Recent", icon: Clock },
  { name: "Bookmarks", icon: Heart },
];

const categoryLinks = [
  { name: "Live Action", icon: Users },
  { name: "Anime", icon: Hash },
  { name: "Upcoming", icon: Calendar },
];

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#050505]/80 backdrop-blur-xl border-r border-white/5 flex flex-col p-6 z-40 hidden md:flex">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10 text-white cursor-pointer" onClick={() => setActiveTab('Home')}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl italic">
          H
        </div>
        <span className="text-xl font-bold tracking-tight">HEZ</span>
      </div>

      <nav className="flex-1 space-y-8">
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4 px-2">Menu</p>
          <ul className="space-y-1">
            {mainLinks.map((link) => (
              <li key={link.name}>
                <button
                  onClick={() => setActiveTab(link.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    activeTab === link.name
                      ? "text-blue-500 bg-white/5 shadow-lg shadow-blue-500/10 border-b border-blue-500/0" // Keeping rounded look but matching active state
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{link.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4 px-2">Library</p>
          <ul className="space-y-1">
            {categoryLinks.map((link) => (
              <li key={link.name}>
                <button
                  onClick={() => setActiveTab(link.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    activeTab === link.name
                      ? "text-blue-500 bg-white/5 shadow-lg shadow-blue-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{link.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mt-auto space-y-1">
        <button 
          onClick={() => setActiveTab("Settings")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
            activeTab === "Settings" 
              ? "text-blue-500 bg-white/5 shadow-lg shadow-blue-500/10"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <button 
          onClick={() => setActiveTab("Logout")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
            activeTab === "Logout" 
              ? "text-red-500 bg-red-500/10 shadow-lg shadow-red-500/10"
              : "text-gray-400 hover:text-red-400 hover:bg-red-400/10"
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
