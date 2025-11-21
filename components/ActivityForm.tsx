import React, { useState } from 'react';
import { AgeGroup, ActivityRequest } from '../types';
import { Baby, Armchair, Palette, Search, Footprints } from 'lucide-react';

interface ActivityFormProps {
  onSubmit: (request: ActivityRequest) => void;
  isLoading: boolean;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit, isLoading }) => {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(AgeGroup.TODDLER_YOUNG);
  const [interests, setInterests] = useState('');
  const [materials, setMaterials] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ageGroup,
      childInterests: interests,
      materialsAvailable: materials
    });
  };

  const getIconForAge = (age: AgeGroup) => {
    switch (age) {
      case AgeGroup.INFANT_YOUNG:
      case AgeGroup.INFANT_OLDER:
        return <Baby className="mb-2 w-6 h-6" />;
      case AgeGroup.TODDLER_YOUNG:
      case AgeGroup.TODDLER_OLDER:
        return <Footprints className="mb-2 w-6 h-6" />;
      case AgeGroup.PRESCHOOL:
        return <Armchair className="mb-2 w-6 h-6" />;
      default:
        return <Palette className="mb-2 w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-primary-50 p-6 border-b border-primary-100">
        <h2 className="text-xl font-bold text-primary-900 mb-2">Find the perfect activity</h2>
        <p className="text-primary-700 text-sm">Tell us a little about your little one and we'll handle the creativity.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Age Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">How old is the child?</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {(Object.values(AgeGroup) as AgeGroup[]).map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => setAgeGroup(age)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 h-full ${
                  ageGroup === age
                    ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500 ring-offset-2'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 text-gray-600'
                }`}
              >
                {getIconForAge(age)}
                <span className="text-xs font-medium text-center leading-tight">{age}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Optional Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="interests" className="block text-sm font-semibold text-gray-700">
              Current Interests <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              id="interests"
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., dinosaurs, space, water..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="materials" className="block text-sm font-semibold text-gray-700">
              Materials on hand <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              id="materials"
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="e.g., cardboard boxes, crayons..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-primary-500/30'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Personalized Plan...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Generate Activity Plan
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;