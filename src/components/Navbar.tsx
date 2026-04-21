import { Search, Bell, User } from "lucide-react";

export function Navbar({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <nav className="h-16 px-8 flex items-center justify-between border-b border-white/5 bg-[#050505] sticky top-0 z-50">
      <div className="flex-1 md:ml-64 hidden md:block"></div> {/* Spacer for sidebar if needed, or mobile menu toggle */}
      
      <div className="flex-1 flex justify-center md:justify-end md:mr-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-1.5 border border-white/10 rounded-full leading-5 bg-white/5 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
            placeholder="Search movies..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-[#050505]"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border border-white/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity">
          <User className="h-4 w-4" />
        </div>
      </div>
    </nav>
  );
}
