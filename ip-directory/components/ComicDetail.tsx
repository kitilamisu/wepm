import React from 'react';
import { Comic } from '../types';
import { ArrowLeft, ExternalLink, ChevronDown } from 'lucide-react';

interface ComicDetailProps {
  comic: Comic;
  onBack: () => void;
}

const ComicDetail: React.FC<ComicDetailProps> = ({ comic, onBack }) => {
  // Styles based on the screenshot provided
  const labelStyle = "w-48 text-gray-500 font-medium text-sm flex-shrink-0";
  const valueStyle = "text-gray-300 text-sm font-light leading-relaxed flex-1";
  
  // Tag Styles
  const pinkTagStyle = "bg-[#4a2b30] text-[#e0a8b1] px-2 py-0.5 text-xs rounded border border-[#6b363f]";
  const blueTagStyle = "bg-[#1e293b] text-[#60a5fa] px-2 py-0.5 text-xs rounded border border-[#334155]";
  const grayTagStyle = "bg-[#2d3748] text-gray-300 px-2 py-0.5 text-xs rounded border border-[#4a5568]";
  const greenTagStyle = "bg-[#1f3528] text-[#6ee7b7] px-2 py-0.5 text-xs rounded border border-[#2d5d45]";

  return (
    <div className="animate-fade-in pb-20">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to List</span>
      </button>

      {/* Main Container */}
      <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-24">
        
        {/* Left Column: Info */}
        <div className="flex-1 space-y-10">
          
          {/* Header */}
          <div>
             {/* Logo Placeholder - In a real app, this would be the Company Logo image */}
             <div className="bg-[#e65100] text-white text-[10px] font-bold inline-block px-2 py-1 rounded mb-4">
              {comic.company.split(' ')[0]}
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              {comic.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs mb-1">IP Name (kr)</span>
                <span className="text-gray-300 font-medium">{comic.originalTitle || '-'}</span>
              </div>
              
              <div className="flex flex-col">
                 <span className="text-gray-500 text-xs mb-1">Genre</span>
                 <div className="flex gap-2">
                    {comic.genre.map(g => (
                      <span key={g} className={blueTagStyle}>{g}</span>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col">
                 <span className="text-gray-500 text-xs mb-1">Service Status</span>
                 <span className={`${grayTagStyle} self-start`}>{comic.status}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-800 w-full" />

          {/* Properties List */}
          <div className="space-y-6">
            <h3 className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-6">Properties</h3>

            {/* Row: Target Gender */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <span className={labelStyle}>Target Gender</span>
              <div className={valueStyle}>
                <span className={pinkTagStyle}>{comic.targetDemographic?.gender || 'ALL'}</span>
              </div>
            </div>

            {/* Row: Target Age */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <span className={labelStyle}>Target age</span>
              <div className={valueStyle}>
                <div className="flex gap-2">
                  {comic.targetDemographic?.ageRanges 
                    ? comic.targetDemographic.ageRanges.map(a => <span key={a} className={pinkTagStyle}>{a}</span>)
                    : <span className={pinkTagStyle}>{comic.age === 'All' ? 'All Ages' : comic.age}</span>
                  }
                </div>
              </div>
            </div>

            {/* Row: Service Started */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <span className={labelStyle}>Service Started in</span>
              <div className={valueStyle}>
                <span className={pinkTagStyle}>{comic.startYear || '2023'}</span>
              </div>
            </div>

            {/* Row: Platform */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <span className={labelStyle}>*platform</span>
              <div className={valueStyle}>
                 <span className="block mb-2 text-white font-medium">{comic.platform || 'General'}</span>
                 {comic.platform && (
                   <span className={pinkTagStyle}>{comic.platform.toLowerCase()}</span>
                 )}
              </div>
            </div>

             {/* Row: Storyline */}
             <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <span className={labelStyle}>Storyline</span>
              <div className={`${valueStyle} text-gray-400`}>
                {comic.description}
              </div>
            </div>

             {/* Row: Writer */}
             <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <span className={labelStyle}>Writer</span>
              <div className={valueStyle}>
                {comic.authors || 'Unknown'}
              </div>
            </div>

             {/* Row: Type */}
             <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <span className={labelStyle}>type</span>
              <div className={valueStyle}>
                <span className={pinkTagStyle}>{comic.format || 'Webcomic'}</span>
              </div>
            </div>

             {/* Row: Languages */}
             <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <span className={labelStyle}>*Translational languages</span>
              <div className={valueStyle}>
                {comic.countries.join(', ')}
              </div>
            </div>

             {/* Row: Company */}
             <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
              <span className={labelStyle}>Company</span>
              <div className={`${valueStyle} font-bold text-white flex items-center gap-2`}>
                <span className="text-orange-500">■</span> {comic.company}
              </div>
            </div>

             {/* Row: Hope Distribution */}
             <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <span className={labelStyle}>Hope Distribution Type</span>
              <div className={valueStyle}>
                 <span className={greenTagStyle}>{comic.distributionType || 'Digital'}</span>
              </div>
            </div>

             {/* More details toggle (Visual only) */}
             <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
               <span className={labelStyle}></span>
               <button className="text-gray-500 text-xs flex items-center gap-1 hover:text-white mt-2">
                 <ChevronDown size={14} /> View 1 more property
               </button>
             </div>

          </div>

          {/* Links Section */}
          <div className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <span className={labelStyle}>KR Service Link</span>
              <a 
                href={`https://${comic.promotionalLink || '#'}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-gray-400 hover:text-white underline underline-offset-4 text-sm flex items-center gap-2"
              >
                {comic.promotionalLink || 'Link not available'}
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: Image */}
        <div className="w-full lg:w-[450px] flex-shrink-0">
           <div className="sticky top-24">
             <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-2xl border border-gray-800 bg-[#0d1117]">
               <img 
                 src={comic.imageUrl} 
                 alt={comic.title} 
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
               
               {/* Logo Overlay placeholder */}
               <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-white font-bold text-xs border border-white/20">
                 {comic.company.split(' ')[0]}
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ComicDetail;