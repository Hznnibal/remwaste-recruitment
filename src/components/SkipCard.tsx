import { CreditCard, Package, RouteIcon, Ruler, Trash2 } from 'lucide-react';
import React from 'react';

interface Skip {
  id: string;
  name: string;
  price: number;
  dimensions?: string;
  description?: string;
  image?: string;
  capacity?: string;
  allowed_on_road?: boolean;
  allows_heavy_waste?: boolean;
}

interface SkipCardProps {
  skip: Skip;
  onSelect: (skip: Skip) => void;
  isSelected?: boolean;
}

const SkipCard: React.FC<SkipCardProps> = ({ skip, onSelect, isSelected = false }) => {
  return (
    <div
      className={`bg-slate-900/60 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20  group ${isSelected
        ? 'border-blue-400 ring-2 ring-blue-400/30 shadow-lg shadow-blue-500/30'
        : 'border-blue-500/20 hover:border-blue-400/50'
        }`}

    >
      {/* Header with gradient and price */}
      <div className="relative h-48 bg-gradient-to-br from-blue-600/30 via-slate-700/30 to-blue-800/30 rounded-t-2xl overflow-hidden">
        <img
          src="/src/OIG2.jpg"
          alt="Professional Skip"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <div className="bg-orange-500 text-white px-3 py-2 rounded-full text-lg font-bold shadow-lg">
            £{skip.price}
          </div>
        </div>


      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{skip.name}</h3>

        {skip.description && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">{skip.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            {skip.dimensions && (
              <div className="flex items-center text-gray-300">
                <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 border border-blue-400/30">
                  <Ruler className="w-3 h-3 text-blue-400" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Dimensions</span>
                  <span className="text-sm font-medium">{skip.dimensions}</span>
                </div>
              </div>
            )}

            {skip.capacity && (
              <div className="flex items-center text-gray-300">
                <div className="w-6 h-6 bg-teal-500/20 rounded-lg flex items-center justify-center mr-3 border border-teal-400/30">
                  <Package className="w-3 h-3 text-teal-400" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Capacity</span>
                  <span className="text-sm font-medium">{skip.capacity}</span>
                </div>
              </div>
            )}

            <div className="flex items-center text-gray-300">
              <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center mr-3 border border-orange-400/30">
                <CreditCard className="w-3 h-3 text-orange-400" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Price (14 days)</span>
                <span className="text-lg font-bold text-white">£{skip.price}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-gray-300">
              <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 border border-green-400/30">
                <RouteIcon className="w-3 h-3 text-green-400" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Allowed on Road</span>
                <span className="text-sm font-medium">{skip.allowed_on_road ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-300">
              <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3 border border-purple-400/30">
                <Trash2 className="w-3 h-3 text-purple-400" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Heavy Waste</span>
                <span className="text-sm font-medium">{skip.allows_heavy_waste ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform ${isSelected
            ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/30 scale-105'
            : 'bg-slate-800/50 text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/80 hover:to-blue-800/80 hover:text-white border border-blue-500/20 hover:border-transparent hover:scale-105'
            }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(skip);
          }}
        >
          {isSelected ? 'Selected ✓' : 'Select This Skip'}
        </button>
      </div>
    </div>
  );
};

export default SkipCard;