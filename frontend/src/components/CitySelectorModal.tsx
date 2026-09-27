import React from 'react';
import { MapPin, X, Check } from 'lucide-react';
import { CITIES } from '../mock/data';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>Select Your City</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-3 mb-4">
          BuildConnect provides hyper-local worker dispatch across Tier-2 and Tier-3 hubs in India.
        </p>

        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
          {CITIES.map((city) => {
            const isSelected = city === selectedCity;
            return (
              <button
                key={city}
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-800/50 border-slate-700/50 text-gray-300 hover:border-cyan-500/30 hover:bg-slate-800'
                }`}
              >
                <span>{city}</span>
                {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
