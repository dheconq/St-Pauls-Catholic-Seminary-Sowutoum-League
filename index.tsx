
import React, { useState, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './components/Layout';
import LeagueTable from './components/LeagueTable';
import { AppTab, TeamStats } from './types';
import { searchSeminaryNews, editImageWithGemini, generateVideo } from './services/geminiService';

const TEAMS_A_NAMES = [
  "Philosophy One (A)",
  "Philosophy Two (A)",
  "Philosophy Three (A)",
  "Spiritual Team A"
];

const TEAMS_B_NAMES = [
  "Philosophy One (B)",
  "Philosophy Two (B)",
  "Philosophy Three (B)",
  "Spiritual Team B"
];

const generateStats = (names: string[]): TeamStats[] => {
  return names.map(name => {
    const played = 4;
    const won = Math.floor(Math.random() * 3);
    const drawn = Math.floor(Math.random() * 2);
    const lost = played - (won + drawn);
    const gf = Math.floor(Math.random() * 8) + won;
    const ga = Math.floor(Math.random() * 5) + lost;
    return {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name,
      played,
      won,
      drawn,
      lost,
      goalsFor: gf,
      goalsAgainst: ga,
      points: (won * 3) + drawn
    };
  });
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.League);
  const leagueAData = useMemo(() => generateStats(TEAMS_A_NAMES), []);
  const leagueBData = useMemo(() => generateStats(TEAMS_B_NAMES), []);

  // Search State
  const [query, setQuery] = useState('');
  const [searchData, setSearchData] = useState<{ text: string, sources: any[] } | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Media State
  const [img, setImg] = useState<string | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<{ type: 'image' | 'video', url: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoadingSearch(true);
    try {
      const res = await searchSeminaryNews(query);
      setSearchData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSearch(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onEdit = async () => {
    if (!img) return;
    setMediaLoading(true);
    try {
      const url = await editImageWithGemini(img, prompt || "Make this a high-quality sports poster for St. Paul's Seminary Sowtuomian League.");
      if (url) setResult({ type: 'image', url });
    } finally {
      setMediaLoading(false);
    }
  };

  const onVideo = async () => {
    setMediaLoading(true);
    try {
      // @ts-ignore
      if (!(await window.aistudio.hasSelectedApiKey())) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
      const url = await generateVideo(prompt || "A cinematic soccer goal celebration at St. Paul's Seminary.", img || undefined);
      setResult({ type: 'video', url });
    } catch (err) {
      console.error(err);
      // @ts-ignore
      await window.aistudio.openSelectKey();
    } finally {
      setMediaLoading(false);
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === AppTab.League && (
        <div className="space-y-16 py-8">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-2 bg-[#d4af37]"></div>
              <h2 className="cinzel text-3xl font-bold text-[#800000]">League A: Championship Division</h2>
            </div>
            <LeagueTable title="Standings - Team A Competition" teams={leagueAData} />
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-2 bg-[#800000]"></div>
              <h2 className="cinzel text-3xl font-bold text-[#800000]">League B: Reserve Division</h2>
            </div>
            <LeagueTable title="Standings - Team B Competition" teams={leagueBData} />
          </section>
        </div>
      )}

      {activeTab === AppTab.Search && (
        <div className="max-w-3xl mx-auto py-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h3 className="cinzel text-2xl font-bold text-[#800000] mb-6">Seminary Knowledge Hub</h3>
            <form onSubmit={onSearch} className="flex gap-3 mb-10">
              <input 
                className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#800000] outline-none"
                placeholder="Ask about Sowtuomian League history..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button disabled={loadingSearch} className="bg-[#800000] text-white px-8 rounded-2xl font-bold hover:bg-[#5d0000] transition-all disabled:opacity-50">
                {loadingSearch ? '...' : 'Search'}
              </button>
            </form>
            {searchData && (
              <div className="bg-gray-50 p-6 rounded-2xl">
                <p className="text-gray-700 leading-relaxed mb-4">{searchData.text}</p>
                <div className="flex flex-wrap gap-2">
                  {searchData.sources.map((s, i) => (
                    <a key={i} href={s.web?.uri} className="text-xs bg-white border px-3 py-1 rounded-full text-[#800000] hover:bg-[#800000] hover:text-white">
                      {s.web?.title || 'Ref'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === AppTab.Media && (
        <div className="max-w-6xl mx-auto py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
              <h3 className="cinzel text-2xl font-bold text-[#800000]">Media Creator</h3>
              <div 
                onClick={() => fileRef.current?.click()}
                className="aspect-video bg-gray-100 rounded-2xl border-4 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#d4af37] transition-all overflow-hidden"
              >
                {img ? <img src={img} className="w-full h-full object-cover" /> : <p className="text-gray-400 font-bold">Upload Match Photo</p>}
                <input type="file" ref={fileRef} className="hidden" onChange={onFileChange} accept="image/*" />
              </div>
              <textarea 
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#800000] outline-none h-32"
                placeholder="Creative instructions (e.g. 'Add a gold halo effect' or 'Make it look like a 1920s newspaper article')"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <button onClick={onEdit} disabled={mediaLoading || !img} className="bg-[#800000] text-white py-4 rounded-2xl font-bold disabled:opacity-50 hover:bg-[#5d0000]">
                  {mediaLoading ? 'Processing...' : 'Enhance Photo'}
                </button>
                <button onClick={onVideo} disabled={mediaLoading} className="bg-[#d4af37] text-white py-4 rounded-2xl font-bold disabled:opacity-50 hover:bg-[#b8962d]">
                  {mediaLoading ? 'Rendering...' : 'Generate Video'}
                </button>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl relative min-h-[400px]">
              {result ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  {result.type === 'image' ? <img src={result.url} className="rounded-xl max-h-[500px]" /> : <video src={result.url} controls className="rounded-xl w-full" />}
                  <a href={result.url} download="st-pauls-creation" className="text-white bg-[#d4af37] px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">Download</a>
                </div>
              ) : (
                <div className="space-y-4">
                  <i className="fa-solid fa-wand-magic-sparkles text-6xl text-[#d4af37]/20"></i>
                  <p className="text-gray-500 font-medium cinzel">AI Creation Studio Output</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
}
