
import React, { useState, useRef } from 'react';
import Layout from './components/Layout';
import LeagueTable from './components/LeagueTable';
import { AppTab, TeamStats } from './types';
import { searchSeminaryNews, editImageWithGemini, generateVideo } from './services/geminiService';

const TEAMS_A = [
  "Philosophy One",
  "Philosophy Two",
  "Philosophy Three",
  "Spiritual Team A"
];

const TEAMS_B = [
  "Philosophy One",
  "Philosophy Two",
  "Philosophy Three",
  "Spiritual Team B"
];

const generateInitialStats = (teams: string[]): TeamStats[] => {
  return teams.map(name => {
    const played = 6;
    const won = Math.floor(Math.random() * 4);
    const drawn = Math.floor(Math.random() * 2);
    const lost = played - (won + drawn);
    const goalsFor = Math.floor(Math.random() * 12) + won;
    const goalsAgainst = Math.floor(Math.random() * 8) + lost;
    
    return {
      id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 5),
      name,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      points: (won * 3) + drawn
    };
  });
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.League);
  const [teamAStats] = useState<TeamStats[]>(generateInitialStats(TEAMS_A));
  const [teamBStats] = useState<TeamStats[]>(generateInitialStats(TEAMS_B));
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Media State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [mediaPrompt, setMediaPrompt] = useState('');
  const [generatedResult, setGeneratedResult] = useState<{ type: 'image' | 'video', url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const result = await searchSeminaryNews(searchQuery);
      setSearchResult(result);
    } catch (error) {
      console.error(error);
      alert("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = async () => {
    if (!selectedImage) return;
    setIsProcessingMedia(true);
    try {
      const result = await editImageWithGemini(selectedImage, mediaPrompt || "Make this photo look like a professional match poster with St. Paul's Seminary colors (Maroon and Gold) and add the text 'Vas Mihi Electionis'.");
      if (result) {
        setGeneratedResult({ type: 'image', url: result });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to edit image.");
    } finally {
      setIsProcessingMedia(false);
    }
  };

  const handleGenerateVideo = async () => {
    setIsProcessingMedia(true);
    try {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }

      const prompt = mediaPrompt || "A cinematic highlight reel of the Sowtuomian League football match at St. Paul's Seminary, featuring students in maroon and gold, cheers, and clerical collars in the background.";
      const result = await generateVideo(prompt, selectedImage || undefined);
      setGeneratedResult({ type: 'video', url: result });
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      } else {
        alert("Video generation failed. Ensure you have a paid API key for Veo.");
      }
    } finally {
      setIsProcessingMedia(false);
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === AppTab.League && (
        <div className="space-y-12 animate-fadeIn">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="cinzel text-3xl font-bold text-[#800000] mb-2">Championship Standings</h2>
            <div className="w-24 h-1 bg-[#d4af37] mx-auto mb-4"></div>
            <p className="text-gray-600">
              Official standings for the St. Paul's Catholic Seminary Sowtuomian League. 
              The tournament features the Philosophy classes and the Spiritual Year split into two distinct competition brackets.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <LeagueTable title="Sowtuomian League: Team A" teams={teamAStats} />
            <LeagueTable title="Sowtuomian League: Team B" teams={teamBStats} />
          </div>
        </div>
      )}

      {activeTab === AppTab.Search && (
        <div className="max-w-4xl mx-auto py-10 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="cinzel text-2xl font-bold text-[#800000] mb-6 flex items-center gap-2">
              <i className="fa-solid fa-compass"></i> Seminary Navigator
            </h3>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask about St. Paul's Seminary, Sowtuomian history, or league rules..."
                className="flex-grow p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800000] focus:border-transparent outline-none shadow-inner"
              />
              <button 
                disabled={isSearching}
                className="bg-[#800000] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#5d0000] transition-all disabled:opacity-50"
              >
                {isSearching ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Search'}
              </button>
            </form>

            {searchResult && (
              <div className="prose max-w-none text-gray-700 bg-gray-50 p-6 rounded-xl border-l-4 border-[#d4af37]">
                <div className="whitespace-pre-wrap leading-relaxed">{searchResult.text}</div>
                {searchResult.sources.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-3">Sources & References</h4>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.sources.map((chunk: any, i: number) => (
                        <a 
                          key={i} 
                          href={chunk.web?.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs bg-[#800000]/10 text-[#800000] px-3 py-1 rounded-full hover:bg-[#800000]/20 transition-colors"
                        >
                          <i className="fa-solid fa-link mr-1"></i>
                          {chunk.web?.title || 'Source'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === AppTab.Media && (
        <div className="max-w-5xl mx-auto py-10 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="cinzel text-2xl font-bold text-[#800000] mb-6 flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles"></i> Media Studio
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all bg-gray-50/50 overflow-hidden relative"
                >
                  {selectedImage ? (
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-2"></i>
                      <p className="text-sm text-gray-500">Click to upload match photo</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">AI Creative Prompt</label>
                  <textarea 
                    value={mediaPrompt}
                    onChange={(e) => setMediaPrompt(e.target.value)}
                    placeholder="e.g. 'Turn this into a cinematic match poster for Team A vs Philosophy One' or 'A dramatic goal celebrate video'"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800000] outline-none min-h-[100px]"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleEditImage}
                    disabled={isProcessingMedia || !selectedImage}
                    className="flex-1 bg-[#800000] text-white py-4 rounded-xl font-bold hover:bg-[#5d0000] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessingMedia ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-image"></i>}
                    Edit Photo
                  </button>
                  <button 
                    onClick={handleGenerateVideo}
                    disabled={isProcessingMedia}
                    className="flex-1 bg-[#d4af37] text-white py-4 rounded-xl font-bold hover:bg-[#c49e27] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessingMedia ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-film"></i>}
                    Generate Video
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
                {isProcessingMedia ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 border-4 border-[#800000] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-[#800000] font-bold animate-pulse">Gemini is crafting your media...</p>
                    <p className="text-xs text-gray-500">This may take a minute for video generation.</p>
                  </div>
                ) : generatedResult ? (
                  <div className="w-full space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Generated Result</p>
                    {generatedResult.type === 'image' ? (
                      <img src={generatedResult.url} alt="Generated" className="w-full rounded-xl shadow-lg border-2 border-white" />
                    ) : (
                      <video src={generatedResult.url} controls className="w-full rounded-xl shadow-lg border-2 border-white" />
                    )}
                    <a 
                      href={generatedResult.url} 
                      download={`stpauls-media-${Date.now()}`}
                      className="inline-flex items-center gap-2 text-[#800000] font-bold hover:underline"
                    >
                      <i className="fa-solid fa-download"></i> Download Media
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <i className="fa-solid fa-photo-film text-gray-200 text-6xl"></i>
                    <p className="text-gray-400">Your AI-generated media will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
