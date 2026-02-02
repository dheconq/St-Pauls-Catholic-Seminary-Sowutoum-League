
import React from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Seminary Header */}
      <header className="bg-[#800000] text-[#f8f4e3] py-8 px-6 shadow-xl border-b-4 border-[#d4af37]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#d4af37] p-3 rounded-full shadow-inner">
              <i className="fa-solid fa-cross text-3xl text-[#800000]"></i>
            </div>
            <div>
              <h1 className="cinzel text-2xl md:text-3xl font-bold tracking-widest">ST. PAUL'S CATHOLIC SEMINARY</h1>
              <p className="cinzel text-sm md:text-md italic text-[#d4af37] mt-1 tracking-wider uppercase font-semibold">Vas Mihi Electionis</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <h2 className="cinzel text-xl font-bold text-[#f8f4e3]">SOWTUOMIAN LEAGUE</h2>
            <p className="text-xs uppercase tracking-widest text-white/70">A-League & B-League Championships</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm flex justify-center">
        <div className="flex gap-1 p-2 overflow-x-auto max-w-full">
          <button 
            onClick={() => onTabChange(AppTab.League)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === AppTab.League ? 'bg-[#800000] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <i className="fa-solid fa-ranking-star mr-2"></i>League Tables
          </button>
          <button 
            onClick={() => onTabChange(AppTab.Media)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === AppTab.Media ? 'bg-[#800000] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <i className="fa-solid fa-photo-film mr-2"></i>Media Studio
          </button>
          <button 
            onClick={() => onTabChange(AppTab.Search)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === AppTab.Search ? 'bg-[#800000] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <i className="fa-solid fa-magnifying-glass mr-2"></i>Seminary Search
          </button>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>

      <footer className="bg-gray-900 text-white/50 py-8 px-6 text-center text-sm">
        <p className="mb-2">St. Paul's Catholic Seminary - Sowtuomian League &copy; {new Date().getFullYear()}</p>
        <p className="italic">"Vas Mihi Electionis" - For he is a chosen vessel unto me.</p>
      </footer>
    </div>
  );
};

export default Layout;
