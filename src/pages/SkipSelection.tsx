import { AlertCircle, ArrowRight, Calendar, Check, Filter, Loader2, MapPin, Minus, Plus, Search, ShoppingCart, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import SkipCard from '../components/SkipCard';

interface Skip {
  id: string;
  name: string;
  price: number;
  dimensions?: string;
  description?: string;
  image?: string;
  capacity?: string;
  size?: number; // Pour le filtrage par taille
}
// Composant pour la barre de progression
const ProgressBar: React.FC<{ currentStep: number; totalSteps: number; onStepClick: (stepNumber: number) => void }> = ({ currentStep, totalSteps, onStepClick }) => {
  const steps = [
    { number: 1, title: "Location", description: "Enter postcode" },
    { number: 2, title: "Service", description: "Choose service type" },
    { number: 3, title: "Skip Size", description: "Select your skip", active: true },
    { number: 4, title: "Duration", description: "Rental period" },
    { number: 5, title: "Details", description: "Contact & delivery info" },
    { number: 6, title: "Payment", description: "Complete booking" }
  ];

  const handleStepClick = (stepNumber: number) => {
    // Permettre le clic seulement sur les étapes précédentes ou l'étape actuelle
    if (stepNumber <= currentStep) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="bg-slate-950/60 backdrop-blur-sm border-b border-blue-500/20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Choose Your Skip Size</h1>
            <div className="flex items-center mt-2 text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Lowestoft, NR32</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</div>
            <div className="text-lg font-semibold text-white">Select Skip Size</div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  onClick={() => handleStepClick(step.number)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${step.number < currentStep
                    ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600 hover:scale-110'
                    : step.number === currentStep
                      ? 'bg-blue-500 text-white ring-4 ring-blue-500/20 cursor-pointer hover:bg-blue-600'
                      : 'bg-slate-700 text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                  title={
                    step.number < currentStep
                      ? `Go back to ${step.title}`
                      : step.number === currentStep
                        ? `Current step: ${step.title}`
                        : `Complete previous steps to unlock ${step.title}`
                  }
                >
                  {step.number < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-xs font-medium transition-colors ${step.number === currentStep ? 'text-blue-300' :
                    step.number < currentStep ? 'text-green-400' : 'text-gray-500'
                    }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${step.number < currentStep ? 'bg-green-500' : 'bg-slate-700'
                  }`} />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

const SkipSelection: React.FC = () => {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [days, setDays] = useState(14);
  const [postcode] = useState('NR32');
  const [area] = useState('Lowestoft');
  const [currentStep] = useState(3);

  // États pour les filtres
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sizeFilter, setSizeFilter] = useState<string>('all'); // 'all', 'small', 'medium', 'large'

  useEffect(() => {
    const fetchSkips = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform the API response to our Skip interface
        const transformedSkips: Skip[] = data.map((item: any, index: number) => {

          // Dimensions aléatoires entre 3 et 7 pieds
          const length = Math.floor(Math.random() * 5) + 3;
          const width = Math.floor(Math.random() * 5) + 3;
          const height = Math.floor(Math.random() * 5) + 3;

          return {
            id: item.id || `skip-${index}`,
            name: `${item.size} Yard Skip`,
            price: parseFloat((item.price_before_vat * (1 + item.vat / 100)).toFixed(2)),
            dimensions: `${length}ft * ${width}ft * ${height}ft`,
            capacity: `${item.size} cubic yards`,
            description: item.description || 'Perfect for household and garden waste removal',
            size: item.size // Conserve la taille originale pour le filtrage
          };
        });

        setSkips(transformedSkips);

        // Initialiser les limites de prix en fonction des données réelles
        if (transformedSkips.length > 0) {
          const prices = transformedSkips.map(skip => skip.price);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange({ min: minPrice, max: maxPrice });
        }
      } catch (err) {
        console.error('Error fetching skips:', err);
        setError('Failed to load skip options. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkips();
  }, [postcode, area]);

  const handleSkipSelect = (skip: Skip) => {
    setSelectedSkip(skip);
    setShowCart(true);
    setDays(14);
    console.log('Selected skip:', skip);
  };

  const closeCart = () => {
    setShowCart(false);
    setTimeout(() => setSelectedSkip(null), 300);
  };

  const handleStepClick = (stepNumber: number) => {
    // Gérer la navigation entre les étapes
    if (stepNumber <= currentStep) {
      switch (stepNumber) {
        case 1:
          alert('Retour à l\'étape 1: Sélection de la localisation');
          // Ici vous pourriez rediriger vers la page de sélection de localisation
          break;
        case 2:
          alert('Retour à l\'étape 2: Choix du type de service');
          // Ici vous pourriez rediriger vers la page de sélection de service
          break;
        case 3:
          // Étape actuelle, ne rien faire ou rafraîchir la page
          console.log('Déjà sur l\'étape 3');
          break;
        default:
          break;
      }
    }
  };

  // Filtrage des skips
  const filteredSkips = useMemo(() => {
    return skips.filter(skip => {
      // Filtre par prix
      const priceMatch = skip.price >= priceRange.min && skip.price <= priceRange.max;

      // Filtre par taille
      let sizeMatch = true;
      if (sizeFilter !== 'all' && skip.size) {
        switch (sizeFilter) {
          case 'small':
            sizeMatch = skip.size <= 4;
            break;
          case 'medium':
            sizeMatch = skip.size > 4 && skip.size <= 8;
            break;
          case 'large':
            sizeMatch = skip.size > 8;
            break;
        }
      }

      return priceMatch && sizeMatch;
    });
  }, [skips, priceRange, sizeFilter]);


  const handleContinue = () => {
    console.log('Proceeding to payment with:', {
      skip: selectedSkip,
      days,
      total: selectedSkip ? selectedSkip.price * (days / 14) : 0
    });
    alert(`Proceeding to payment for ${selectedSkip?.name} - ${days} days - Total: £${selectedSkip ? selectedSkip.price * (days / 14) : 0}`);
  };

  const increaseDays = () => {
    setDays(days + 14);
  };

  const decreaseDays = () => {
    setDays(Math.max(14, days - 14));
  };

  const resetFilters = () => {
    if (skips.length > 0) {
      const prices = skips.map(skip => skip.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange({ min: minPrice, max: maxPrice });
    }
    setSizeFilter('all');
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="text-center relative z-10">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-300">Finding the best skip options for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      <ProgressBar currentStep={currentStep} totalSteps={6} onStepClick={handleStepClick} />
      {/* Header */}
      <div className="backdrop-blur-sm mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${showFilters
                  ? 'bg-blue-500/20 border-blue-400/30 text-blue-300'
                  : 'bg-slate-800/50 border-slate-600/30 text-gray-300 hover:bg-slate-700/50'
                  }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>

            </div>
          </div>


          {/* Filtres */}
          {showFilters && (
            <div className="mt-6 bg-slate-900/60 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Filtre par prix */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Price Range: £{priceRange.min} - £{priceRange.max}
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Min Price</label>
                      <input
                        type="range"
                        min={skips.length > 0 ? Math.floor(Math.min(...skips.map(s => s.price))) : 0}
                        max={skips.length > 0 ? Math.ceil(Math.max(...skips.map(s => s.price))) : 1000}
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Max Price</label>
                      <input
                        type="range"
                        min={skips.length > 0 ? Math.floor(Math.min(...skips.map(s => s.price))) : 0}
                        max={skips.length > 0 ? Math.ceil(Math.max(...skips.map(s => s.price))) : 1000}
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>

                {/* Filtre par taille */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Skip Size</label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Sizes', count: skips.length },
                      { value: 'small', label: 'Small (≤4 yards)', count: skips.filter(s => s.size && s.size <= 4).length },
                      { value: 'medium', label: 'Medium (5-8 yards)', count: skips.filter(s => s.size && s.size > 4 && s.size <= 8).length },
                      { value: 'large', label: 'Large (>8 yards)', count: skips.filter(s => s.size && s.size > 8).length }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sizeFilter"
                          value={option.value}
                          checked={sizeFilter === option.value}
                          onChange={(e) => setSizeFilter(e.target.value)}
                          className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-300">
                          {option.label} ({option.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-end">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {error && (
          <div className="mb-8 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-orange-400 mr-2" />
              <span className="text-orange-300">{error}</span>
            </div>
            <p className="text-sm text-orange-400 mt-1">Showing sample data for demonstration.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkips.map((skip) => (
            <SkipCard
              key={skip.id}
              skip={skip}
              onSelect={handleSkipSelect}
              isSelected={selectedSkip?.id === skip.id}
            />
          ))}
        </div>

        {filteredSkips.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No skips match your filters</h3>
            <p className="text-gray-400 mb-4">Try adjusting your price range or size preferences.</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Sliding Cart */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-slate-950/95 backdrop-blur-xl border-l border-blue-500/20 transform transition-transform duration-300 ease-in-out z-50 ${showCart ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {selectedSkip && (
          <div className="h-full flex flex-col">
            {/* Cart Header */}
            <div className="p-6 border-b border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <ShoppingCart className="w-6 h-6 text-blue-400 mr-2" />
                  <h3 className="text-lg font-semibold text-white">Your Selection</h3>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Skip Details */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-6">
                <div className="w-full h-48 bg-gradient-to-br from-blue-500/20 to-slate-700/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                  <img
                    src="/src/assets/skip.jpg"
                    alt="Professional Skip"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <h4 className="text-xl font-bold text-white mb-2">{selectedSkip.name}</h4>
                <p className="text-gray-300 text-sm mb-4">{selectedSkip.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-blue-500/20">
                    <span className="text-gray-400">Dimensions:</span>
                    <span className="text-white font-medium">{selectedSkip.dimensions}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-500/20">
                    <span className="text-gray-400">Capacity:</span>
                    <span className="text-white font-medium">{selectedSkip.capacity}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-500/20">
                    <span className="text-gray-400">Price (14 days):</span>
                    <span className="text-white font-medium">£{selectedSkip.price}</span>
                  </div>
                </div>

                {/* Duration Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Rental Duration
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={decreaseDays}
                      disabled={days <= 14}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${days <= 14
                        ? 'bg-slate-800/50 text-gray-500 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                        }`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-white block">{days}</span>
                      <span className="text-sm text-gray-400">days</span>
                    </div>
                    <button
                      onClick={increaseDays}
                      className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Minimum 14 days, increments of 14 days
                  </p>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-blue-500/20 to-slate-700/20 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Duration:</span>
                    <span className="text-white font-medium">{days} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-2xl font-bold text-white">£{selectedSkip.price * (days / 14)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="p-6 border-t border-blue-500/20">
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {showCart && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40"
          onClick={closeCart}
        />
      )}

      {/* Footer */}
      <div className="bg-slate-950/60 backdrop-blur-sm border-t border-blue-500/20 py-8 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            Need help choosing? Contact our team for personalized recommendations.
          </p>
        </div>
      </div>

    </div>
  );
};

export default SkipSelection;