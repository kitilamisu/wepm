import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_COMICS, COMPANIES, GENRES, AGES } from './data';
import { Comic, CategoryData, SiteConfig, CategoryDefinition } from './types';
import ComicCard from './components/ComicCard';
import ComicDetail from './components/ComicDetail';
import FilterGroup from './components/FilterGroup';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { Search, Filter, X, Grid, List, Menu, Lock, ShieldCheck, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const STORAGE_KEY_COMICS = 'kocca_comics_db_v1';
  const STORAGE_KEY_CATEGORIES = 'kocca_categories_data_v2';
  const STORAGE_KEY_CAT_DEFS = 'kocca_categories_defs_v1';
  const STORAGE_KEY_CONFIG = 'kocca_site_config_v1';

  // --- Initial Data Setup ---

  const DEFAULT_CAT_DEFS: CategoryDefinition[] = [
    { id: 'companies', label: 'Company', isSystem: true, type: 'single' },
    { id: 'genres', label: 'Genre', isSystem: true, type: 'multiple' },
    { id: 'statuses', label: 'Status', isSystem: true, type: 'single' },
    { id: 'formats', label: 'Format', isSystem: true, type: 'single' },
    { id: 'distributions', label: 'Distribution', isSystem: true, type: 'single' },
    { id: 'ages', label: 'Age Rating', isSystem: true, type: 'single' },
    // Hidden from sidebar filters but used in Admin/Detail
    { id: 'targetAges', label: 'Target Age', isSystem: true, type: 'multiple' }, 
    { id: 'genders', label: 'Target Gender', isSystem: true, type: 'single' },
  ];

  const DEFAULT_CATEGORIES: CategoryData = {
    companies: COMPANIES,
    genres: GENRES,
    ages: AGES,
    targetAges: ["10's", "20's", "30's", "40's", "50's", "All Ages"],
    formats: ["Webcomic", "Paperback", "E-Book", "Animation"],
    distributions: ["Digital", "Printed", "All"],
    statuses: ["Ongoing", "Completed", "Planned"],
    genders: ["Male", "Female", "ALL"]
  };

  // --- State Initialization ---

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { mainTitle: "KOCCA", subTitle: "Frankfurt Book Fair", logoText: "K", logoImageUrl: "" };
  });

  const [categoryDefs, setCategoryDefs] = useState<CategoryDefinition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAT_DEFS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CAT_DEFS;
  });

  const [categories, setCategories] = useState<CategoryData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CATEGORIES;
  });

  const [comics, setComics] = useState<Comic[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMICS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return MOCK_COMICS;
  });

  // --- Persistence ---
  useEffect(() => { localStorage.setItem(STORAGE_KEY_COMICS, JSON.stringify(comics)); }, [comics]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CAT_DEFS, JSON.stringify(categoryDefs)); }, [categoryDefs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(siteConfig)); }, [siteConfig]);

  // --- Filter State ---
  // Store selected filters in a Record keyed by category ID
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [view, setView] = useState<'list' | 'detail' | 'admin'>('list');
  const [selectedComicId, setSelectedComicId] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // --- Helpers ---

  const toggleFilter = (catId: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[catId] || [];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value) 
        : [...current, value];
      return { ...prev, [catId]: updated };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setSearchQuery('');
  };

  const handleResetData = () => {
    if (window.confirm("Reset all data (Comics, Categories & Settings) to default?")) {
      setComics(MOCK_COMICS);
      setCategories(DEFAULT_CATEGORIES);
      setCategoryDefs(DEFAULT_CAT_DEFS);
      localStorage.removeItem(STORAGE_KEY_COMICS);
      localStorage.removeItem(STORAGE_KEY_CATEGORIES);
      localStorage.removeItem(STORAGE_KEY_CAT_DEFS);
    }
  };

  // --- Filtering Logic ---

  const filteredComics = useMemo(() => {
    return comics.filter(comic => {
      // 1. Check Search
      const matchSearch = 
        comic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        comic.originalTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      // 2. Check Dynamic Filters
      // We iterate over all keys in selectedFilters. If a comic fails any active filter, return false.
      for (const [catId, selectedOptions] of Object.entries(selectedFilters)) {
        if (!selectedOptions || selectedOptions.length === 0) continue;

        const def = categoryDefs.find(d => d.id === catId);
        if (!def) continue;

        if (def.isSystem) {
          // Map system keys to Comic fields
          let comicValue: any;
          if (catId === 'companies') comicValue = comic.company;
          else if (catId === 'genres') comicValue = comic.genre;
          else if (catId === 'ages') comicValue = comic.age;
          else if (catId === 'statuses') comicValue = comic.status;
          else if (catId === 'formats') comicValue = comic.format;
          else if (catId === 'distributions') comicValue = comic.distributionType;
          else if (catId === 'genders') comicValue = comic.targetDemographic?.gender;
          else if (catId === 'targetAges') comicValue = comic.targetDemographic?.ageRanges;
          
          if (Array.isArray(comicValue)) {
            // If comic has array (e.g. genre), check if ANY selected option is present (OR logic within category)
            // Or usually filters are AND logic across categories, OR within category.
            if (!comicValue.some(v => selectedOptions.includes(v))) return false;
          } else {
            // Single value (e.g. company), check if it matches ANY selected
            // Fuzzy match for format "Webcomic / Paperback"
            if (catId === 'formats') {
               if (!selectedOptions.some(opt => (comicValue as string)?.includes(opt))) return false;
            } else {
               if (!selectedOptions.includes(comicValue as string)) return false;
            }
          }
        } else {
          // Custom Fields
          const customVals = comic.customValues?.[catId] || [];
          if (!customVals.some(v => selectedOptions.includes(v))) return false;
        }
      }

      return true;
    });
  }, [comics, selectedFilters, searchQuery, categoryDefs]);

  // --- View Rendering Helpers ---
  
  const handleComicClick = (id: string) => {
    setSelectedComicId(id);
    setView('detail');
    window.scrollTo(0,0);
  };

  // System Categories that shouldn't appear in sidebar filters (Target Age/Gender usually strictly for detail/admin)
  // You can adjust this list if you WANT them in sidebar
  const SIDEBAR_EXCLUDED_IDS = ['targetAges', 'genders'];

  const renderContent = () => {
    if (view === 'admin') {
      if (!isAdminAuthenticated) return <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />;
      return (
        <AdminDashboard 
          comics={comics}
          categories={categories}
          categoryDefs={categoryDefs}
          siteConfig={siteConfig}
          onSave={(c) => setComics(prev => {
             const idx = prev.findIndex(x => x.id === c.id);
             if (idx >= 0) {
               const newC = [...prev]; newC[idx] = c; return newC;
             }
             return [c, ...prev];
          })}
          onDelete={(id) => setComics(prev => prev.filter(c => c.id !== id))}
          onUpdateCategories={setCategories}
          onUpdateCategoryDefs={setCategoryDefs}
          onUpdateSiteConfig={setSiteConfig}
          onExit={() => setView('list')}
        />
      );
    }

    if (view === 'detail') {
       const selectedComic = comics.find(c => c.id === selectedComicId);
       if (selectedComic) return <ComicDetail comic={selectedComic} onBack={() => setView('list')} />;
    }

    // List View
    const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0) || searchQuery;

    return (
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`
          lg:w-72 flex-shrink-0 
          ${isMobileMenuOpen ? 'fixed inset-0 z-40 bg-[#0d1117] p-6 overflow-y-auto' : 'hidden lg:block'}
        `}>
          <div className="lg:sticky lg:top-36 pb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold flex items-center gap-2">
                <Filter size={18} className="text-emerald-500" />
                Filters
              </h2>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 underline">
                  Reset All
                </button>
              )}
            </div>

            {categoryDefs
              .filter(def => !SIDEBAR_EXCLUDED_IDS.includes(def.id))
              .map((def, idx) => (
              <div key={def.id}>
                <FilterGroup 
                  title={def.label} 
                  options={categories[def.id] || []} 
                  selected={selectedFilters[def.id] || []} 
                  onChange={(val) => toggleFilter(def.id, val)}
                  // Cycle colors for variety
                  colorTheme={['green', 'blue', 'purple'][idx % 3] as any}
                />
                <div className="w-full h-px bg-gray-800 my-6"></div>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">IP Data Base</h2>
              <p className="text-sm text-gray-500">
                Displaying <span className="text-white font-mono">{filteredComics.length}</span> titles
              </p>
            </div>
             <div className="flex items-center gap-3">
              <div className="hidden md:flex bg-gray-800 rounded-md p-0.5 border border-gray-700">
                <button className="p-1.5 rounded bg-gray-700 text-white shadow-sm"><Grid size={16}/></button>
                <button className="p-1.5 rounded text-gray-500 hover:text-gray-300"><List size={16}/></button>
              </div>
            </div>
          </div>

          {filteredComics.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredComics.map(comic => (
                <ComicCard 
                  key={comic.id} 
                  comic={comic} 
                  onClick={() => handleComicClick(comic.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-lg bg-gray-900/50">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium text-gray-400">No comics found</p>
              <button 
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans">
      <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur border-b border-gray-800 transition-all">
        <div className="max-w-[1600px] mx-auto px-6 h-32 flex items-center justify-between">
          <div className="flex items-center gap-5 cursor-pointer" onClick={() => setView('list')}>
            <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden shadow-2xl shadow-emerald-900/30 ring-1 ring-white/10">
              {siteConfig.logoImageUrl ? (
                <img src={siteConfig.logoImageUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-emerald-600 flex items-center justify-center font-bold text-white text-4xl">
                   {siteConfig.logoText.substring(0, 2)}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center gap-1">
              <h1 className="text-4xl font-bold text-white tracking-tight leading-none">{siteConfig.mainTitle}</h1>
              <span className="text-gray-400 font-normal text-lg">{siteConfig.subTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {view === 'list' && (
               <div className="hidden md:block relative">
                <input 
                  type="text" 
                  placeholder="Search titles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-sm rounded-full px-4 py-2 w-72 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-500"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
             )}
             
             <div className="flex items-center gap-2">
               {isAdminAuthenticated && view === 'admin' && (
                 <button onClick={handleResetData} className="p-2 rounded-full text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors" title="Reset Data">
                   <RotateCcw size={20} />
                 </button>
               )}
               <button 
                 onClick={() => { setView('admin'); setIsMobileMenuOpen(false); }}
                 className={`p-2 rounded-full transition-colors ${view === 'admin' ? 'text-emerald-500 bg-emerald-900/20' : 'text-gray-500 hover:text-white'}`}
               >
                 {isAdminAuthenticated ? <ShieldCheck size={28} /> : <Lock size={28} />}
               </button>
             </div>
          </div>
          <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;