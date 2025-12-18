import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { College, Building, Floor, Place, PathConnection, NavigationResult } from '@/types/navigation';
import { sampleColleges, sampleBuildings, sampleFloors, samplePlaces, sampleConnections } from '@/data/mock-data';
import { buildNavigationGraph, findShortestPath } from '@/lib/navigation-algorithm';

interface NavigationStore {
  // Data
  colleges: College[];
  buildings: Building[];
  floors: Floor[];
  places: Place[];
  connections: PathConnection[];
  
  // Selected state
  selectedCollegeId: string | null;
  selectedBuildingId: string | null;
  selectedFloorId: string | null;
  
  // Navigation state
  startPlaceId: string | null;
  endPlaceId: string | null;
  navigationResult: NavigationResult | null;
  preferAccessible: boolean;
  
  // Actions
  setSelectedCollege: (id: string | null) => void;
  setSelectedBuilding: (id: string | null) => void;
  setSelectedFloor: (id: string | null) => void;
  setStartPlace: (id: string | null) => void;
  setEndPlace: (id: string | null) => void;
  setPreferAccessible: (prefer: boolean) => void;
  calculateRoute: () => void;
  clearNavigation: () => void;
  
  // Admin actions
  addCollege: (college: Omit<College, 'id' | 'createdAt'>) => void;
  addBuilding: (building: Omit<Building, 'id'>) => void;
  addFloor: (floor: Omit<Floor, 'id'>) => void;
  addPlace: (place: Omit<Place, 'id'>) => void;
  addConnection: (connection: Omit<PathConnection, 'id'>) => void;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  deletePlace: (id: string) => void;
  
  // Getters
  getCollegeBuildings: () => Building[];
  getBuildingFloors: () => Floor[];
  getFloorPlaces: () => Place[];
  searchPlaces: (query: string) => Place[];
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      // Initialize with sample data
      colleges: sampleColleges,
      buildings: sampleBuildings,
      floors: sampleFloors,
      places: samplePlaces,
      connections: sampleConnections,
      
      selectedCollegeId: null,
      selectedBuildingId: null,
      selectedFloorId: null,
      startPlaceId: null,
      endPlaceId: null,
      navigationResult: null,
      preferAccessible: false,
      
      setSelectedCollege: (id) => set({ 
        selectedCollegeId: id, 
        selectedBuildingId: null, 
        selectedFloorId: null,
        startPlaceId: null,
        endPlaceId: null,
        navigationResult: null
      }),
      
      setSelectedBuilding: (id) => set({ 
        selectedBuildingId: id, 
        selectedFloorId: null 
      }),
      
      setSelectedFloor: (id) => set({ selectedFloorId: id }),
      
      setStartPlace: (id) => set({ startPlaceId: id, navigationResult: null }),
      
      setEndPlace: (id) => set({ endPlaceId: id, navigationResult: null }),
      
      setPreferAccessible: (prefer) => set({ preferAccessible: prefer, navigationResult: null }),
      
      calculateRoute: () => {
        const { startPlaceId, endPlaceId, places, connections, floors, buildings, preferAccessible } = get();
        
        if (!startPlaceId || !endPlaceId) return;
        
        const graph = buildNavigationGraph(places, connections, floors, buildings);
        const result = findShortestPath(graph, startPlaceId, endPlaceId, preferAccessible);
        
        set({ navigationResult: result });
      },
      
      clearNavigation: () => set({
        startPlaceId: null,
        endPlaceId: null,
        navigationResult: null
      }),
      
      addCollege: (collegeData) => {
        const newCollege: College = {
          ...collegeData,
          id: `college-${Date.now()}`,
          createdAt: new Date()
        };
        set((state) => ({ colleges: [...state.colleges, newCollege] }));
      },
      
      addBuilding: (buildingData) => {
        const newBuilding: Building = {
          ...buildingData,
          id: `building-${Date.now()}`
        };
        set((state) => ({ buildings: [...state.buildings, newBuilding] }));
      },
      
      addFloor: (floorData) => {
        const newFloor: Floor = {
          ...floorData,
          id: `floor-${Date.now()}`
        };
        set((state) => ({ floors: [...state.floors, newFloor] }));
      },
      
      addPlace: (placeData) => {
        const newPlace: Place = {
          ...placeData,
          id: `place-${Date.now()}`
        };
        set((state) => ({ places: [...state.places, newPlace] }));
      },
      
      addConnection: (connectionData) => {
        const newConnection: PathConnection = {
          ...connectionData,
          id: `conn-${Date.now()}`
        };
        set((state) => ({ connections: [...state.connections, newConnection] }));
      },
      
      updatePlace: (id, updates) => {
        set((state) => ({
          places: state.places.map((p) => 
            p.id === id ? { ...p, ...updates } : p
          )
        }));
      },
      
      deletePlace: (id) => {
        set((state) => ({
          places: state.places.filter((p) => p.id !== id),
          connections: state.connections.filter(
            (c) => c.fromPlaceId !== id && c.toPlaceId !== id
          )
        }));
      },
      
      getCollegeBuildings: () => {
        const { buildings, selectedCollegeId } = get();
        if (!selectedCollegeId) return [];
        return buildings.filter((b) => b.collegeId === selectedCollegeId);
      },
      
      getBuildingFloors: () => {
        const { floors, selectedBuildingId } = get();
        if (!selectedBuildingId) return [];
        return floors
          .filter((f) => f.buildingId === selectedBuildingId)
          .sort((a, b) => a.floorNumber - b.floorNumber);
      },
      
      getFloorPlaces: () => {
        const { places, selectedFloorId } = get();
        if (!selectedFloorId) return [];
        return places.filter((p) => p.floorId === selectedFloorId);
      },
      
      searchPlaces: (query) => {
        const { places, buildings, selectedCollegeId } = get();
        if (!selectedCollegeId || !query.trim()) return [];
        
        const collegeBuildingIds = buildings
          .filter((b) => b.collegeId === selectedCollegeId)
          .map((b) => b.id);
        
        const lowerQuery = query.toLowerCase();
        return places
          .filter((p) => collegeBuildingIds.includes(p.buildingId))
          .filter((p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            (p.code && p.code.toLowerCase().includes(lowerQuery)) ||
            p.type.toLowerCase().includes(lowerQuery)
          )
          .slice(0, 10);
      }
    }),
    {
      name: 'campus-navigator-storage',
      partialize: (state) => ({
        colleges: state.colleges,
        buildings: state.buildings,
        floors: state.floors,
        places: state.places,
        connections: state.connections
      })
    }
  )
);
