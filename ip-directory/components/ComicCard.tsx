import React from 'react';
import { Comic } from '../types';
import { Globe, BookOpen, Building2 } from 'lucide-react';

interface ComicCardProps {
  comic: Comic;
  onClick?: () => void;
}

const ComicCard: React.FC<ComicCardProps> = ({ comic, onClick }) => {
  const getGenreColor = (genre: string) => {
    if (genre.includes('Action')) return 'bg-blue-900/50 text-blue-200 border-blue-800';
    if (genre.includes('Romance')) return 'bg-pink-900/50 text-pink-200 border-pink-800';
    if (genre.includes('Thriller')) return 'bg-red-900/50 text-red-200 border-red-800';
    if (genre.includes('BL') || genre.includes('GL')) return 'bg-purple-900/50 text-purple-200 border-purple-800';
    return 'bg-gray-700 text-gray-200 border-gray-600';
  };

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col bg-[#161b22] border border-gray-800 hover:border-gray-600 rounded-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1 h-full cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={comic.imageUrl} 
          alt={comic.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">
          {comic.age}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent p-4 pt-12">
          {/* Tags overlaid on image bottom */}
          <div className="flex flex-wrap gap-1 mb-1">
            {comic.genre.slice(0, 2).map(g => (
              <span key={g} className={`text-[10px] px-1.5 py-0.5 rounded border ${getGenreColor(g)}`}>
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-emerald-400 transition-colors">
          {comic.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-1 font-medium">
          {comic.originalTitle}
        </p>

        <div className="mt-auto space-y-2">
           {/* Company */}
           <div className="flex items-start gap-1.5">
            <Building2 size={12} className="text-gray-500 mt-0.5 shrink-0" />
            <span className="text-[11px] text-gray-400 leading-tight">
              {comic.company}
            </span>
          </div>

          {/* Service Country */}
          <div className="flex items-start gap-1.5">
            <Globe size={12} className="text-gray-500 mt-0.5 shrink-0" />
            <span className="text-[11px] text-gray-400 leading-tight line-clamp-2">
              {comic.countries.join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicCard;