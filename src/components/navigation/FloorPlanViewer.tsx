import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigationStore } from '@/store/navigation-store';
import { Place, PlaceType } from '@/types/navigation';

const typeColors: Record<PlaceType, string> = {
  classroom: 'fill-marker-room',
  laboratory: 'fill-marker-lab',
  office: 'fill-marker-office',
  canteen: 'fill-marker-canteen',
  auditorium: 'fill-primary',
  library: 'fill-primary',
  restroom: 'fill-muted-foreground',
  stairs: 'fill-marker-stairs',
  lift: 'fill-marker-lift',
  entrance: 'fill-success',
  exit: 'fill-destructive',
  corridor: 'fill-muted-foreground',
  sports: 'fill-success',
  parking: 'fill-muted-foreground',
  other: 'fill-muted-foreground',
};

export function FloorPlanViewer() {
  const {
    selectedBuildingId,
    selectedFloorId,
    setSelectedFloor,
    getBuildingFloors,
    getFloorPlaces,
    navigationResult,
    startPlaceId,
    endPlaceId,
    buildings,
    floors,
    connections,
  } = useNavigationStore();

  const buildingFloors = getBuildingFloors();
  const floorPlaces = getFloorPlaces();
  const selectedFloor = floors.find(f => f.id === selectedFloorId);
  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);

  // Get path places for current floor
  const pathPlacesOnFloor = useMemo(() => {
    if (!navigationResult || !selectedFloorId) return new Set<string>();
    return new Set(
      navigationResult.path
        .filter(step => step.floor.id === selectedFloorId)
        .map(step => step.place.id)
    );
  }, [navigationResult, selectedFloorId]);

  // Get connections that are part of the path on current floor
  const pathConnections = useMemo(() => {
    if (!navigationResult || !selectedFloorId) return [];
    
    const pathPlaceIds = navigationResult.path
      .filter(step => step.floor.id === selectedFloorId)
      .map(step => step.place.id);
    
    const pathConns: { from: Place; to: Place }[] = [];
    
    for (let i = 0; i < pathPlaceIds.length - 1; i++) {
      const fromPlace = floorPlaces.find(p => p.id === pathPlaceIds[i]);
      const toPlace = floorPlaces.find(p => p.id === pathPlaceIds[i + 1]);
      if (fromPlace && toPlace) {
        pathConns.push({ from: fromPlace, to: toPlace });
      }
    }
    
    return pathConns;
  }, [navigationResult, selectedFloorId, floorPlaces]);

  const handleFloorChange = (direction: 'up' | 'down') => {
    if (!selectedFloor) return;
    const currentIndex = buildingFloors.findIndex(f => f.id === selectedFloorId);
    const newIndex = direction === 'up' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < buildingFloors.length) {
      setSelectedFloor(buildingFloors[newIndex].id);
    }
  };

  if (!selectedBuildingId || !selectedFloorId) {
    return (
      <div className="flex items-center justify-center h-[400px] rounded-xl border border-dashed border-border bg-secondary/30">
        <div className="text-center">
          <p className="text-muted-foreground">Select a building and floor to view the map</p>
        </div>
      </div>
    );
  }

  const canGoUp = buildingFloors.findIndex(f => f.id === selectedFloorId) < buildingFloors.length - 1;
  const canGoDown = buildingFloors.findIndex(f => f.id === selectedFloorId) > 0;

  return (
    <div className="relative">
      {/* Floor info bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{selectedBuilding?.name}</h3>
          <p className="text-sm text-muted-foreground">{selectedFloor?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFloorChange('down')}
            disabled={!canGoDown}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Badge variant="secondary" className="min-w-[80px] justify-center">
            Floor {selectedFloor?.floorNumber}
          </Badge>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFloorChange('up')}
            disabled={!canGoUp}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Floor plan SVG */}
      <div className="relative rounded-xl border border-border bg-card overflow-hidden floor-plan-grid">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-auto min-h-[400px]"
          style={{ maxHeight: '500px' }}
        >
          {/* Grid background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Draw connections */}
          {connections
            .filter(conn => {
              const from = floorPlaces.find(p => p.id === conn.fromPlaceId);
              const to = floorPlaces.find(p => p.id === conn.toPlaceId);
              return from && to;
            })
            .map(conn => {
              const from = floorPlaces.find(p => p.id === conn.fromPlaceId)!;
              const to = floorPlaces.find(p => p.id === conn.toPlaceId)!;
              const isOnPath = pathConnections.some(
                pc => (pc.from.id === from.id && pc.to.id === to.id) ||
                      (pc.from.id === to.id && pc.to.id === from.id)
              );
              
              return (
                <line
                  key={conn.id}
                  x1={from.position.x}
                  y1={from.position.y}
                  x2={to.position.x}
                  y2={to.position.y}
                  stroke={isOnPath ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                  strokeWidth={isOnPath ? 4 : 2}
                  strokeDasharray={isOnPath ? undefined : '5,5'}
                  className={isOnPath ? 'animate-pulse-slow' : ''}
                />
              );
            })}

          {/* Draw navigation path arrows */}
          {pathConnections.map((conn, i) => {
            const midX = (conn.from.position.x + conn.to.position.x) / 2;
            const midY = (conn.from.position.y + conn.to.position.y) / 2;
            const angle = Math.atan2(
              conn.to.position.y - conn.from.position.y,
              conn.to.position.x - conn.from.position.x
            ) * 180 / Math.PI;
            
            return (
              <g key={`arrow-${i}`} transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
                <polygon
                  points="0,-6 12,0 0,6"
                  className="fill-primary"
                />
              </g>
            );
          })}

          {/* Draw places */}
          {floorPlaces.map((place) => {
            const isStart = place.id === startPlaceId;
            const isEnd = place.id === endPlaceId;
            const isOnPath = pathPlacesOnFloor.has(place.id);
            const isHighlighted = isStart || isEnd || isOnPath;

            return (
              <motion.g
                key={place.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: Math.random() * 0.3 }}
              >
                {/* Pulse ring for start/end */}
                {(isStart || isEnd) && (
                  <circle
                    cx={place.position.x}
                    cy={place.position.y}
                    r={24}
                    className={`${isStart ? 'fill-success' : 'fill-destructive'} opacity-20 animate-pulse-marker`}
                  />
                )}
                
                {/* Main marker */}
                <circle
                  cx={place.position.x}
                  cy={place.position.y}
                  r={isHighlighted ? 16 : 12}
                  className={`
                    ${isStart ? 'fill-success' : isEnd ? 'fill-destructive' : isOnPath ? 'fill-primary' : typeColors[place.type]}
                    stroke-card stroke-2 transition-all duration-200
                  `}
                />
                
                {/* Label */}
                <text
                  x={place.position.x}
                  y={place.position.y + 28}
                  textAnchor="middle"
                  className="fill-foreground text-xs font-medium"
                >
                  {place.code || place.name.slice(0, 10)}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Start</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">End</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-marker-stairs" />
          <span className="text-xs text-muted-foreground">Stairs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-marker-lift" />
          <span className="text-xs text-muted-foreground">Lift</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-marker-canteen" />
          <span className="text-xs text-muted-foreground">Canteen</span>
        </div>
      </div>
    </div>
  );
}
