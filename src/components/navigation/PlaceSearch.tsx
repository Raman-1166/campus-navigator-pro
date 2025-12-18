import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigationStore } from '@/store/navigation-store';
import { Place, PlaceType } from '@/types/navigation';

interface PlaceSearchProps {
  placeholder?: string;
  onSelect: (place: Place) => void;
  selectedPlaceId?: string | null;
  excludePlaceId?: string | null;
}

const typeIcons: Record<PlaceType, string> = {
  classroom: '📚',
  laboratory: '🔬',
  office: '💼',
  canteen: '🍽️',
  auditorium: '🎭',
  library: '📖',
  restroom: '🚻',
  stairs: '🚶',
  lift: '🛗',
  entrance: '🚪',
  exit: '🚪',
  corridor: '➡️',
  sports: '⚽',
  parking: '🅿️',
  other: '📍',
};

const typeBadgeVariant: Record<PlaceType, 'default' | 'room' | 'stairs' | 'lift' | 'canteen' | 'lab' | 'office' | 'success'> = {
  classroom: 'room',
  laboratory: 'lab',
  office: 'office',
  canteen: 'canteen',
  auditorium: 'room',
  library: 'room',
  restroom: 'default',
  stairs: 'stairs',
  lift: 'lift',
  entrance: 'success',
  exit: 'success',
  corridor: 'default',
  sports: 'success',
  parking: 'default',
  other: 'default',
};

export function PlaceSearch({ placeholder = 'Search for a place...', onSelect, selectedPlaceId, excludePlaceId }: PlaceSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { searchPlaces, places, floors, buildings } = useNavigationStore();

  const results = query.length > 0 
    ? searchPlaces(query).filter(p => p.id !== excludePlaceId)
    : [];

  const selectedPlace = selectedPlaceId 
    ? places.find(p => p.id === selectedPlaceId) 
    : null;
  
  const selectedFloor = selectedPlace 
    ? floors.find(f => f.id === selectedPlace.floorId) 
    : null;
  
  const selectedBuilding = selectedPlace 
    ? buildings.find(b => b.id === selectedPlace.buildingId) 
    : null;

  const handleSelect = (place: Place) => {
    onSelect(place);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelect(null as any);
    setQuery('');
  };

  if (selectedPlace) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <span>{typeIcons[selectedPlace.type]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{selectedPlace.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {selectedBuilding?.name} • {selectedFloor?.name}
          </p>
        </div>
        <button
          onClick={handleClear}
          className="p-1 hover:bg-secondary rounded-md transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
        />
      </div>

      {isOpen && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-card shadow-card-lg overflow-hidden"
        >
          {results.map((place) => {
            const floor = floors.find(f => f.id === place.floorId);
            const building = buildings.find(b => b.id === place.buildingId);
            
            return (
              <button
                key={place.id}
                onClick={() => handleSelect(place)}
                className="flex w-full items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left border-b border-border last:border-0"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">
                  {typeIcons[place.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">{place.name}</span>
                    {place.code && (
                      <Badge variant="secondary" className="text-xs">
                        {place.code}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {building?.name} • {floor?.name}
                  </p>
                </div>
                <Badge variant={typeBadgeVariant[place.type] || 'default'}>
                  {place.type}
                </Badge>
              </button>
            );
          })}
        </motion.div>
      )}

      {isOpen && query.length > 0 && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-card shadow-card-lg p-6 text-center"
        >
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No places found</p>
        </motion.div>
      )}
    </div>
  );
}
