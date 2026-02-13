import React, { useState } from 'react';
import { Comic, CategoryData, SiteConfig, CategoryDefinition } from '../types';
import { Plus, Edit2, Trash2, X, Save, ArrowLeft, Image as ImageIcon, Upload, Check, Settings, LayoutList, Globe, MoreVertical } from 'lucide-react';

interface AdminDashboardProps {
  comics: Comic[];
  categories: CategoryData;
  categoryDefs: CategoryDefinition[];
  siteConfig: SiteConfig;
  onSave: (comic: Comic) => void;
  onDelete: (id: string) => void;
  onUpdateCategories: (data: CategoryData) => void;
  onUpdateCategoryDefs: (defs: CategoryDefinition[]) => void;
  onUpdateSiteConfig: (config: SiteConfig) => void;
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  comics, 
  categories, 
  categoryDefs,
  siteConfig,
  onSave, 
  onDelete, 
  onUpdateCategories,
  onUpdateCategoryDefs,
  onUpdateSiteConfig,
  onExit 
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'categories' | 'settings'>('content');
  const [editingComic, setEditingComic] = useState<Partial<Comic> | null>(null);

  // --- Category Management State ---
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categoryDefs[0]?.id || '');
  const [newCategoryItem, setNewCategoryItem] = useState('');
  
  // State for adding/editing Category Definitions
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingDefId, setEditingDefId] = useState<string | null>(null);
  const [editingDefLabel, setEditingDefLabel] = useState('');

  // --- Helpers for Comic Editing ---

  const handleEdit = (comic: Comic) => {
    // Ensure customValues object exists
    setEditingComic({ ...comic, customValues: comic.customValues || {} });
  };

  const handleAddNew = () => {
    setEditingComic({
      id: Date.now().toString(),
      title: '',
      company: categories.companies?.[0] || '',
      genre: [],
      age: categories.ages?.[0] || 'All',
      status: categories.statuses?.[0] || 'Ongoing',
      countries: ['Global'],
      imageUrl: 'https://picsum.photos/300/400',
      description: '',
      authors: '',
      platform: '',
      format: categories.formats?.[0] || 'Webcomic',
      distributionType: categories.distributions?.[0] || 'Digital',
      startYear: new Date().getFullYear().toString(),
      targetDemographic: {
        gender: categories.genders?.[0] || 'ALL',
        ageRanges: []
      },
      customValues: {}
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingComic && editingComic.title) {
      onSave(editingComic as Comic);
      setEditingComic(null);
    }
  };

  const handleChange = (field: keyof Comic, value: any) => {
    setEditingComic(prev => prev ? ({ ...prev, [field]: value }) : null);
  };
  
  const handleCustomChange = (catId: string, value: string[]) => {
    setEditingComic(prev => {
      if (!prev) return null;
      return {
        ...prev,
        customValues: {
          ...prev.customValues,
          [catId]: value
        }
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleChange('imageUrl', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdateSiteConfig({...siteConfig, logoImageUrl: reader.result as string});
      reader.readAsDataURL(file);
    }
  };

  const handleDemographicChange = (field: 'gender' | 'ageRanges', value: any) => {
    setEditingComic(prev => {
      if (!prev) return null;
      const currentDemo = prev.targetDemographic || { gender: 'ALL', ageRanges: [] };
      return { ...prev, targetDemographic: { ...currentDemo, [field]: value } };
    });
  };

  const toggleArray = (current: string[] = [], item: string) => {
    return current.includes(item) ? current.filter(i => i !== item) : [...current, item];
  };

  // --- Category Definition Logic ---

  const handleAddCategoryDef = () => {
    if (!newCategoryName.trim()) return;
    const id = newCategoryName.toLowerCase().replace(/\s+/g, '') + '_' + Date.now().toString().slice(-4);
    const newDef: CategoryDefinition = {
      id,
      label: newCategoryName,
      isSystem: false,
      type: 'multiple' // Default to multi-select for custom
    };
    onUpdateCategoryDefs([...categoryDefs, newDef]);
    onUpdateCategories({ ...categories, [id]: [] });
    setNewCategoryName('');
    setIsAddingCategory(false);
    setActiveCategoryId(id);
  };

  const handleDeleteCategoryDef = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure? This will hide this filter from the main page.")) {
      const newDefs = categoryDefs.filter(d => d.id !== id);
      onUpdateCategoryDefs(newDefs);
      if (activeCategoryId === id) setActiveCategoryId(newDefs[0]?.id || '');
    }
  };

  const startEditingDef = (e: React.MouseEvent, def: CategoryDefinition) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingDefId(def.id);
    setEditingDefLabel(def.label);
  };

  const saveEditingDef = () => {
    if (!editingDefLabel.trim()) return;
    onUpdateCategoryDefs(categoryDefs.map(d => d.id === editingDefId ? { ...d, label: editingDefLabel } : d));
    setEditingDefId(null);
  };

  // --- Category Item Logic ---

  const handleAddCategoryItem = () => {
    if (!newCategoryItem.trim()) return;
    const list = categories[activeCategoryId] || [];
    if (list.includes(newCategoryItem.trim())) {
      alert('Exists!'); return;
    }
    onUpdateCategories({ ...categories, [activeCategoryId]: [...list, newCategoryItem.trim()] });
    setNewCategoryItem('');
  };

  const handleDeleteCategoryItem = (e: React.MouseEvent, item: string) => {
    e.preventDefault(); // Prevent form submission if inside a form
    e.stopPropagation();
    if (window.confirm(`Delete "${item}"?`)) {
       const list = categories[activeCategoryId] || [];
       onUpdateCategories({ ...categories, [activeCategoryId]: list.filter(i => i !== item) });
    }
  };

  // --- Render Comic Edit Form ---
  
  const renderComicForm = () => {
    if (!editingComic) return null;
    return (
      <div className="bg-[#161b22] rounded-lg border border-gray-800 p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {editingComic.id && comics.some(c => c.id === editingComic.id) ? 'Edit Comic' : 'New Comic'}
          </h2>
          <button type="button" onClick={() => setEditingComic(null)} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-emerald-500 text-sm uppercase font-bold tracking-wider border-b border-gray-800 pb-2">Basic Info</h3>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1">Title</label>
                <input required value={editingComic.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Original Title</label>
                <input value={editingComic.originalTitle || ''} onChange={(e) => handleChange('originalTitle', e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500" />
              </div>

              {/* Dynamic Field Renderer Loop */}
              {categoryDefs.filter(d => d.isSystem).map(def => {
                 // Mapping System fields to specific Comic properties
                 if (def.id === 'companies') {
                   return (
                     <div key={def.id}>
                       <label className="block text-xs text-gray-500 mb-1">{def.label}</label>
                       <select value={editingComic.company} onChange={(e) => handleChange('company', e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500">
                         {categories[def.id]?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                       </select>
                     </div>
                   );
                 }
                 if (def.id === 'genres') {
                   return (
                     <div key={def.id}>
                        <label className="block text-xs text-gray-500 mb-2">{def.label}</label>
                        <div className="flex flex-wrap gap-2 p-3 bg-[#0d1117] border border-gray-700 rounded">
                          {categories[def.id]?.map(g => (
                            <button key={g} type="button" onClick={() => handleChange('genre', toggleArray(editingComic.genre, g))} className={`text-xs px-2 py-1 rounded border ${editingComic.genre?.includes(g) ? 'bg-emerald-900/50 border-emerald-500 text-emerald-300' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>{g}</button>
                          ))}
                        </div>
                     </div>
                   );
                 }
                 if (def.id === 'statuses') {
                   return (
                      <div key={def.id}>
                       <label className="block text-xs text-gray-500 mb-1">{def.label}</label>
                       <select value={editingComic.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500">
                         {categories[def.id]?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                       </select>
                     </div>
                   )
                 }
                 if (def.id === 'ages') {
                    return (
                      <div key={def.id}>
                       <label className="block text-xs text-gray-500 mb-1">{def.label}</label>
                       <select value={editingComic.age} onChange={(e) => handleChange('age', e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500">
                         {categories[def.id]?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                       </select>
                     </div>
                    )
                 }
                 return null; // Handle other system fields elsewhere or below
              })}

               <div>
                  <label className="block text-xs text-gray-500 mb-1">Description</label>
                  <textarea value={editingComic.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full h-32 bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none resize-none focus:border-emerald-500" />
               </div>
               
               <div>
                  <label className="block text-xs text-gray-500 mb-1">Image</label>
                  <div className="flex gap-2">
                     <label className="cursor-pointer bg-gray-800 px-3 py-2 rounded border border-gray-700 text-sm flex items-center gap-2 hover:border-emerald-500">
                       <Upload size={14} /> Upload
                       <input type="file" onChange={handleImageUpload} className="hidden" />
                     </label>
                     <input value={editingComic.imageUrl} onChange={(e) => handleChange('imageUrl', e.target.value)} placeholder="Image URL" className="flex-1 bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500" />
                  </div>
               </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-emerald-500 text-sm uppercase font-bold tracking-wider border-b border-gray-800 pb-2">Details & Custom</h3>

              {/* Remaining System Fields */}
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">Format</label>
                    <select value={editingComic.format} onChange={(e) => handleChange('format', e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500">
                      {categories.formats?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">Distribution</label>
                    <select value={editingComic.distributionType} onChange={(e) => handleChange('distributionType', e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500">
                      {categories.distributions?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs text-gray-500 mb-1">Target Gender</label>
                   <select value={editingComic.targetDemographic?.gender} onChange={(e) => handleDemographicChange('gender', e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500">
                     {categories.genders?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                 </div>
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Year</label>
                    <input value={editingComic.startYear || ''} onChange={(e) => handleChange('startYear', e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500" />
                 </div>
              </div>
              
              <div>
                  <label className="block text-xs text-gray-500 mb-2">Target Ages</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-[#0d1117] border border-gray-700 rounded">
                    {categories.targetAges?.map(age => (
                      <button key={age} type="button" onClick={() => handleDemographicChange('ageRanges', toggleArray(editingComic.targetDemographic?.ageRanges, age))} className={`text-xs px-2 py-1 rounded border ${editingComic.targetDemographic?.ageRanges?.includes(age) ? 'bg-emerald-900/50 border-emerald-500 text-emerald-300' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>{age}</button>
                    ))}
                  </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Authors</label>
                    <input value={editingComic.authors || ''} onChange={(e) => handleChange('authors', e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Platform</label>
                    <input value={editingComic.platform || ''} onChange={(e) => handleChange('platform', e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-emerald-500" />
                  </div>
              </div>

              {/* Custom Category Render Loop */}
              <div className="pt-4 border-t border-gray-800">
                <h4 className="text-gray-400 text-xs font-bold mb-4 uppercase">Additional Categories</h4>
                {categoryDefs.filter(d => !d.isSystem).map(def => {
                   const selectedValues = editingComic.customValues?.[def.id] || [];
                   return (
                     <div key={def.id} className="mb-4">
                        <label className="block text-xs text-gray-500 mb-2">{def.label}</label>
                        <div className="flex flex-wrap gap-2 p-3 bg-[#0d1117] border border-gray-700 rounded min-h-[50px]">
                           {categories[def.id]?.map(opt => (
                             <button 
                               key={opt} 
                               type="button" 
                               onClick={() => handleCustomChange(def.id, toggleArray(selectedValues, opt))} 
                               className={`text-xs px-2 py-1 rounded border ${selectedValues.includes(opt) ? 'bg-purple-900/50 border-purple-500 text-purple-300' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                             >
                               {opt}
                             </button>
                           ))}
                           {(!categories[def.id] || categories[def.id].length === 0) && <span className="text-gray-600 text-xs italic">No options defined. Add them in Categories tab.</span>}
                        </div>
                     </div>
                   );
                })}
                 {categoryDefs.filter(d => !d.isSystem).length === 0 && (
                   <div className="text-xs text-gray-600 italic">No custom categories added yet.</div>
                 )}
              </div>

            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button type="button" onClick={() => setEditingComic(null)} className="px-4 py-2 rounded text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium flex items-center gap-2"><Save size={18} /> Save</button>
          </div>
        </form>
      </div>
    );
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft size={20} /> Back
          </button>
          <div className="h-6 w-px bg-gray-700"></div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>
      </div>

      <div className="flex border-b border-gray-800 overflow-x-auto">
        <button onClick={() => setActiveTab('content')} className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'content' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-gray-400 hover:text-white'}`}><LayoutList size={16} /> Content</button>
        <button onClick={() => setActiveTab('categories')} className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'categories' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-gray-400 hover:text-white'}`}><Settings size={16} /> Categories</button>
        <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-gray-400 hover:text-white'}`}><Globe size={16} /> General Settings</button>
      </div>

      {activeTab === 'content' && !editingComic && (
        <div className="animate-fade-in">
           <div className="flex justify-end mb-4">
            <button onClick={handleAddNew} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"><Plus size={18} /> Add New Comic</button>
           </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#0d1117] border-b border-gray-800">
                <tr>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase">Image</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase">Title / Company</th>
                  <th className="p-4 text-xs font-medium text-gray-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {comics.map(comic => (
                  <tr key={comic.id} className="hover:bg-[#1c2128] transition-colors">
                    <td className="p-4 w-20"><div className="w-10 h-14 bg-gray-800 rounded overflow-hidden"><img src={comic.imageUrl} alt="" className="w-full h-full object-cover" /></div></td>
                    <td className="p-4"><div className="font-medium text-white">{comic.title}</div><div className="text-xs text-gray-500">{comic.company}</div></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => handleEdit(comic)} className="p-2 text-blue-400 hover:bg-blue-900/30 rounded"><Edit2 size={16} /></button>
                        <button type="button" onClick={() => { if(window.confirm('Delete?')) onDelete(comic.id); }} className="p-2 text-red-400 hover:bg-red-900/30 rounded"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === 'content' && editingComic && renderComicForm()}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
          {/* Sidebar */}
          <div className="bg-[#161b22] border border-gray-800 rounded-lg p-2 h-fit">
             <div className="space-y-1 mb-2">
                {categoryDefs.map(def => (
                   <div 
                      key={def.id} 
                      className={`group flex items-center justify-between px-3 py-2 rounded text-sm cursor-pointer transition-colors ${activeCategoryId === def.id ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900' : 'text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent'}`}
                      onClick={() => setActiveCategoryId(def.id)}
                   >
                      {editingDefId === def.id ? (
                        <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                           <input 
                              autoFocus 
                              value={editingDefLabel} 
                              onChange={e => setEditingDefLabel(e.target.value)} 
                              onKeyDown={e => e.key === 'Enter' && saveEditingDef()}
                              className="w-full bg-black text-white px-1 py-0.5 rounded outline-none border border-emerald-500 text-xs"
                           />
                           <button type="button" onClick={saveEditingDef} className="text-emerald-500 hover:text-white"><Check size={12}/></button>
                        </div>
                      ) : (
                        <>
                          <span className="truncate flex-1">{def.label}</span>
                          <div className="flex items-center gap-1 opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                             <button type="button" onClick={(e) => startEditingDef(e, def)} className="p-1.5 text-gray-500 hover:text-blue-400"><Edit2 size={14} /></button>
                             <button type="button" onClick={(e) => handleDeleteCategoryDef(e, def.id)} className="p-1.5 text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
                          </div>
                        </>
                      )}
                   </div>
                ))}
             </div>
             
             {isAddingCategory ? (
                <div className="px-2 pb-2 animate-fade-in">
                   <input 
                      autoFocus
                      placeholder="Category Name"
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      className="w-full bg-[#0d1117] border border-gray-700 rounded px-2 py-1 text-xs text-white mb-2 outline-none focus:border-emerald-500"
                   />
                   <div className="flex gap-2">
                      <button onClick={handleAddCategoryDef} className="flex-1 bg-emerald-600 text-white text-xs py-1 rounded hover:bg-emerald-500">Add</button>
                      <button onClick={() => setIsAddingCategory(false)} className="flex-1 bg-gray-700 text-gray-300 text-xs py-1 rounded hover:bg-gray-600">Cancel</button>
                   </div>
                </div>
             ) : (
               <button onClick={() => setIsAddingCategory(true)} className="w-full py-2 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-white border-t border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <Plus size={12} /> Add New Category
               </button>
             )}
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3 bg-[#161b22] border border-gray-800 rounded-lg p-6 min-h-[400px]">
            {activeCategoryId && (
              <>
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                   <h3 className="text-lg font-bold text-white capitalize">Manage {categoryDefs.find(d => d.id === activeCategoryId)?.label}</h3>
                   <span className="text-xs text-gray-500">{categoryDefs.find(d => d.id === activeCategoryId)?.isSystem ? 'System Category' : 'Custom Category'}</span>
                </div>
                
                <div className="flex gap-2 mb-6">
                  <input 
                    value={newCategoryItem}
                    onChange={(e) => setNewCategoryItem(e.target.value)}
                    placeholder={`Add new item to ${categoryDefs.find(d => d.id === activeCategoryId)?.label}...`}
                    className="flex-1 bg-[#0d1117] border border-gray-700 rounded px-4 py-2 text-white focus:border-emerald-500 outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategoryItem()}
                  />
                  <button 
                    onClick={handleAddCategoryItem}
                    disabled={!newCategoryItem.trim()}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(categories[activeCategoryId] || []).map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 bg-[#0d1117] border border-gray-700 rounded group hover:border-gray-600">
                      <span className="text-gray-300 text-sm">{item}</span>
                      <button 
                        type="button"
                        onClick={(e) => handleDeleteCategoryItem(e, item)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {(categories[activeCategoryId] || []).length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500 text-sm italic">
                      No options defined yet. Add one above.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-[#161b22] border border-gray-800 rounded-lg p-6 max-w-2xl animate-fade-in">
          <h3 className="text-lg font-bold text-white mb-6">Website General Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Main Title</label>
              <input value={siteConfig.mainTitle} onChange={(e) => onUpdateSiteConfig({...siteConfig, mainTitle: e.target.value})} className="w-full bg-[#0d1117] border border-gray-700 rounded px-4 py-2 text-white focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Sub Title</label>
              <input value={siteConfig.subTitle} onChange={(e) => onUpdateSiteConfig({...siteConfig, subTitle: e.target.value})} className="w-full bg-[#0d1117] border border-gray-700 rounded px-4 py-2 text-white focus:border-emerald-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div>
                <label className="block text-xs text-gray-500 mb-2">Logo Text (Fallback)</label>
                <div className="flex items-center gap-4">
                   <input value={siteConfig.logoText} maxLength={2} onChange={(e) => onUpdateSiteConfig({...siteConfig, logoText: e.target.value})} className="w-24 bg-[#0d1117] border border-gray-700 rounded px-4 py-2 text-white focus:border-emerald-500 outline-none text-center" />
                  {!siteConfig.logoImageUrl && <div className="w-12 h-12 bg-emerald-600 rounded flex items-center justify-center font-bold text-white text-xl">{siteConfig.logoText}</div>}
                </div>
              </div>
               <div>
                <label className="block text-xs text-gray-500 mb-2">Logo Image URL</label>
                 <div className="flex gap-2">
                   <label className="cursor-pointer bg-gray-800 px-3 py-2 rounded border border-gray-700 text-sm flex items-center gap-2 hover:border-emerald-500 text-white">
                     <Upload size={14} /> Upload
                     <input type="file" onChange={handleLogoUpload} className="hidden" />
                   </label>
                   <input value={siteConfig.logoImageUrl || ''} onChange={(e) => onUpdateSiteConfig({...siteConfig, logoImageUrl: e.target.value})} placeholder="https://..." className="flex-1 bg-[#0d1117] border border-gray-700 rounded px-4 py-2 text-white focus:border-emerald-500 outline-none" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;