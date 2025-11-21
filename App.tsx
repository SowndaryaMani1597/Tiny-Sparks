import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ActivityForm from './components/ActivityForm';
import ActivityCard from './components/ActivityCard';
import { Activity, ActivityRequest } from './types';
import { generateActivities } from './services/geminiService';
import { AlertTriangle, Stars, Brain, Sparkles, Heart, List } from 'lucide-react';

type Tab = 'results' | 'favorites';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [favorites, setFavorites] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('results');
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load favorites from local storage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('tinySparksFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  const toggleFavorite = (activity: Activity) => {
    setFavorites(prev => {
      const isFav = prev.some(f => f.id === activity.id);
      let newFavorites;
      
      if (isFav) {
        newFavorites = prev.filter(f => f.id !== activity.id);
      } else {
        newFavorites = [...prev, activity];
      }
      
      localStorage.setItem('tinySparksFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (id: string) => favorites.some(f => f.id === id);

  const handleFormSubmit = async (request: ActivityRequest) => {
    setLoading(true);
    setError(null);
    // Don't clear previous activities immediately to prevent flash if user just wants to try again
    
    try {
      const results = await generateActivities(request);
      setActivities(results);
      setActiveTab('results');
      
      // Smooth scroll to results after a short delay to allow rendering
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Group activities logic
  const getDisplayedActivities = () => {
    if (activeTab === 'favorites') return favorites;
    return activities || [];
  };

  const currentActivities = getDisplayedActivities();
  const developmentalActivities = currentActivities.filter(a => a.category !== 'Sensory Play');
  const sensoryActivities = currentActivities.filter(a => a.category === 'Sensory Play');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 space-y-10">
        
        {/* Hero / Form Section */}
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              Playtime, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">Solved.</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Expert-curated activity plans for every developmental stage. From fine motor skills to sensory exploration.
            </p>
          </div>
          
          <ActivityForm onSubmit={handleFormSubmit} isLoading={loading} />
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
              <AlertTriangle className="text-red-500 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-red-800">Oops! Something went wrong</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tabs Navigation - Only show if we have activities or favorites */}
        {(activities || favorites.length > 0) && (
          <div className="flex justify-center" ref={resultsRef}>
            <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 inline-flex gap-1">
              <button
                onClick={() => setActiveTab('results')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'results' 
                    ? 'bg-primary-50 text-primary-700 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <List size={18} />
                Generated Plan
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'favorites' 
                    ? 'bg-rose-50 text-rose-700 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Heart size={18} className={activeTab === 'favorites' ? 'fill-rose-700' : ''} />
                Saved Favorites ({favorites.length})
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {currentActivities.length > 0 ? (
          <div className="space-y-12 animate-fade-in-up pb-12">
            
            {/* Section 1: Developmental */}
            {developmentalActivities.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Brain size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeTab === 'favorites' ? 'Saved Developmental Activities' : 'Developmental Milestones'}
                    </h2>
                    <p className="text-gray-500 text-sm">Activities designed to build core skills.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {developmentalActivities.map((activity, index) => (
                    <ActivityCard 
                      key={activity.id} 
                      activity={activity} 
                      index={index}
                      isFavorite={isFavorite(activity.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Sensory */}
            {sensoryActivities.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeTab === 'favorites' ? 'Saved Sensory Ideas' : 'Sensory Play Collection'}
                    </h2>
                    <p className="text-gray-500 text-sm">Engaging the five senses for deep learning.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sensoryActivities.map((activity, index) => (
                    <ActivityCard 
                      key={activity.id} 
                      activity={activity} 
                      index={index + 100} 
                      isFavorite={isFavorite(activity.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}
            
          </div>
        ) : (
          // Empty States
          <div className="text-center py-12 opacity-60">
            {activeTab === 'favorites' ? (
              <div className="flex flex-col items-center">
                 <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
                   <Heart className="w-8 h-8 text-gray-400" />
                 </div>
                 <p className="text-gray-600 font-medium">No favorite activities yet.</p>
                 <p className="text-gray-500 text-sm mt-1">Click the heart icon on any activity to save it here!</p>
              </div>
            ) : (
              !loading && !error && (
                <div className="flex flex-col items-center">
                  <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
                     <Stars className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Fill out the form above to generate your custom plan!</p>
                </div>
              )
            )}
          </div>
        )}

      </main>
      
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} TinySparks. Created for busy parents.</p>
        <p className="mt-2 text-xs">Always supervise children during activities. Safety first!</p>
      </footer>
      
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;