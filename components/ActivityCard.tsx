import React from 'react';
import { Activity } from '../types';
import { Clock, AlertCircle, CheckCircle2, Package, Tag, Heart } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (activity: Activity) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, index, isFavorite, onToggleFavorite }) => {
  // Generate a predictable seed for the image based on the title length + index
  const imageSeed = activity.title.length + index * 57;
  
  const getCategoryColor = (cat: string) => {
    if (cat === 'Sensory Play') return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 h-full relative group/card">
      <div className="h-40 bg-gray-200 relative overflow-hidden group">
        <img 
          src={`https://picsum.photos/seed/${imageSeed}/500/300`} 
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm border ${getCategoryColor(activity.category)}`}>
            {activity.category}
          </span>
        </div>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(activity);
        }}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all active:scale-95 z-10"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart 
          size={20} 
          className={`transition-colors duration-200 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400 hover:text-rose-400'}`} 
        />
      </button>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight pr-6">{activity.title}</h3>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Clock size={14} />
          <span>{activity.duration}</span>
        </div>

        <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-1">
          {activity.description}
        </p>

        <div className="space-y-3 mt-auto">
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
              <p className="text-xs text-orange-800 font-medium">
                <span className="font-bold">Safety:</span> {activity.safetyTip}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Package size={12} /> Materials
            </h4>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
              {activity.materials.slice(0, 4).map((item, i) => (
                <li key={i} className="flex items-center gap-1.5 text-xs text-gray-700">
                  <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                  <span className="truncate">{item}</span>
                </li>
              ))}
              {activity.materials.length > 4 && (
                <li className="text-xs text-gray-400 pl-4">+ {activity.materials.length - 4} more</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;