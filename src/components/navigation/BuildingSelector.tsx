import { motion } from 'framer-motion';
import { Building2, ChevronRight, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigationStore } from '@/store/navigation-store';

export function BuildingSelector() {
  const { 
    selectedBuildingId, 
    selectedFloorId,
    setSelectedBuilding, 
    setSelectedFloor,
    getCollegeBuildings,
    floors
  } = useNavigationStore();

  const buildings = getCollegeBuildings();

  if (buildings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No buildings found for this college
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Building Selection */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {buildings.map((building, index) => {
          const isSelected = building.id === selectedBuildingId;
          const buildingFloors = floors.filter(f => f.buildingId === building.id);
          
          return (
            <motion.div
              key={building.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                hover
                onClick={() => {
                  setSelectedBuilding(building.id);
                  // Auto-select ground floor
                  const groundFloor = buildingFloors.find(f => f.floorNumber === 0);
                  if (groundFloor) {
                    setSelectedFloor(groundFloor.id);
                  }
                }}
                className={`${isSelected ? 'ring-2 ring-primary shadow-glow' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`
                      flex h-12 w-12 shrink-0 items-center justify-center rounded-lg
                      ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
                      transition-colors duration-200
                    `}>
                      <Building2 className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">
                        {building.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {building.code}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {building.floors} floors
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight className={`h-5 w-5 transition-colors ${
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Floor Selection */}
      {selectedBuildingId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-medium text-muted-foreground">Select Floor</h4>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {floors
              .filter(f => f.buildingId === selectedBuildingId)
              .sort((a, b) => a.floorNumber - b.floorNumber)
              .map((floor) => {
                const isSelected = floor.id === selectedFloorId;
                
                return (
                  <button
                    key={floor.id}
                    onClick={() => setSelectedFloor(floor.id)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isSelected 
                        ? 'bg-primary text-primary-foreground shadow-card' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }
                    `}
                  >
                    {floor.name}
                  </button>
                );
              })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
