import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchRegions } from '../../regions/regionsSlice';
import { ChevronDown, Search, MapPin } from 'lucide-react';

interface SearchableRegionSelectProps {
  value: number | string;
  onChange: (regionId: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

const SearchableRegionSelect: React.FC<SearchableRegionSelectProps> = ({
  value,
  onChange,
  placeholder = "Select a region",
  disabled = false,
  required = false
}) => {
  const dispatch = useAppDispatch();
  const { regions, status } = useAppSelector(state => state.regions);
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRegions());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (value && regions.length > 0) {
      const region = regions.find(r => r.id === Number(value));
      setSelectedRegion(region);
    } else {
      setSelectedRegion(null);
    }
  }, [value, regions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredRegions = regions.filter(region => {
    if (!searchTerm) return true;
    return (
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (region.description && region.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleRegionSelect = (region: any) => {
    setSelectedRegion(region);
    onChange(region.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    setSelectedRegion(null);
    onChange(null);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  if (status === 'loading') {
    return (
      <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
        <span className="text-gray-500">Loading regions...</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Value Display */}
      <div
        onClick={handleToggle}
        className={`w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between ${
          disabled 
            ? 'bg-gray-100 cursor-not-allowed' 
            : 'bg-white hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'
        } ${isOpen ? 'border-blue-500' : 'border-gray-300'}`}
      >
        <div className="flex items-center flex-1">
          <MapPin size={16} className="text-gray-400 mr-2" />
          <span className={selectedRegion ? 'text-gray-900' : 'text-gray-500'}>
            {selectedRegion 
              ? `${selectedRegion.name} (${selectedRegion.code})`
              : placeholder
            }
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {selectedRegion && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          )}
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search regions..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-40 overflow-y-auto">
            {filteredRegions.length > 0 ? (
              filteredRegions.map((region) => (
                <div
                  key={region.id}
                  onClick={() => handleRegionSelect(region)}
                  className={`px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center ${
                    selectedRegion?.id === region.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  <MapPin size={14} className="text-gray-400 mr-2" />
                                     <div className="flex-1">
                     <div className="font-medium">{region.name}</div>
                     <div className="text-xs text-gray-500">{region.code}</div>
                     {region.description && (
                       <div className="text-xs text-gray-400 truncate">{region.description}</div>
                     )}
                   </div>
                  {selectedRegion?.id === region.id && (
                    <span className="text-blue-600 text-sm">✓</span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-gray-500 text-center">
                {searchTerm ? 'No regions found matching your search' : 'No regions available'}
              </div>
            )}
          </div>

          {/* Clear Option */}
          {selectedRegion && (
            <div className="border-t border-gray-200">
              <div
                onClick={handleClear}
                className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-gray-600 text-sm flex items-center"
              >
                <span className="text-gray-400 mr-2">✕</span>
                Clear selection
              </div>
            </div>
          )}
        </div>
      )}

      {/* Required indicator */}
      {required && !selectedRegion && (
        <p className="text-xs text-red-500 mt-1">Region is required for this role</p>
      )}
    </div>
  );
};

export default SearchableRegionSelect; 