import React from 'react';
import {
  Sparkles,
  Layers,
  Calendar,
  Receipt,
  CreditCard,
  ChevronDown,
  Building2,
  FolderOpen
} from 'lucide-react';
import { DesignProject } from '../types';

interface NavbarProps {
  activeTab: 'studio' | 'collaboration' | 'projects' | 'expenses';
  onSelectTab: (tab: 'studio' | 'collaboration' | 'projects' | 'expenses') => void;
  projects: DesignProject[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  activePlanName: string;
  onOpenBilling: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  projects,
  activeProjectId,
  onSelectProject,
  activePlanName,
  onOpenBilling,
}) => {
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-serif font-black text-lg shadow-md border border-amber-400/40">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-tight text-white">
                  RoomRevise
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Startup Studio
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-stone-400">
                AI Interior Design Consultant & Professional SaaS
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-950/80 p-1 rounded-xl border border-stone-800">
            <button
              id="nav-tab-studio"
              type="button"
              onClick={() => onSelectTab('studio')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'studio'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Room Makeover Studio
            </button>

            <button
              id="nav-tab-collaboration"
              type="button"
              onClick={() => onSelectTab('collaboration')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'collaboration'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Client Collaboration
            </button>

            <button
              id="nav-tab-projects"
              type="button"
              onClick={() => onSelectTab('projects')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'projects'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Timelines & Milestones
            </button>

            <button
              id="nav-tab-expenses"
              type="button"
              onClick={() => onSelectTab('expenses')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'expenses'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Receipt Scanner & Budget
            </button>
          </nav>

          {/* Right Action Controls: Project Selector & Subscription Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Project Dropdown */}
            <div className="relative">
              <select
                id="select-active-project"
                value={activeProjectId}
                onChange={(e) => onSelectProject(e.target.value)}
                className="appearance-none bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium pl-8 pr-7 py-1.5 rounded-xl border border-stone-700 cursor-pointer focus:outline-none focus:border-amber-500 transition-colors truncate max-w-[160px] sm:max-w-[210px]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
              <FolderOpen className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Subscription Badge & Gateway Modal Trigger */}
            <button
              id="btn-open-billing-nav"
              type="button"
              onClick={onOpenBilling}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Manage Studio Subscription & Payment Gateway"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{activePlanName}</span>
              <span className="text-[10px] bg-amber-400 text-stone-950 px-1 rounded-sm font-black">PRO</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden items-center justify-between overflow-x-auto py-2 border-t border-stone-800 text-xs font-medium gap-2">
          <button
            type="button"
            onClick={() => onSelectTab('studio')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${
              activeTab === 'studio' ? 'bg-amber-600 text-white' : 'text-stone-400'
            }`}
          >
            Studio
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('collaboration')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${
              activeTab === 'collaboration' ? 'bg-amber-600 text-white' : 'text-stone-400'
            }`}
          >
            Collaboration
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('projects')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${
              activeTab === 'projects' ? 'bg-amber-600 text-white' : 'text-stone-400'
            }`}
          >
            Milestones
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('expenses')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap ${
              activeTab === 'expenses' ? 'bg-amber-600 text-white' : 'text-stone-400'
            }`}
          >
            Receipts
          </button>
        </div>
      </div>
    </header>
  );
};
