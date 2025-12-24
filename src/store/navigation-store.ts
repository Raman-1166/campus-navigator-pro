import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { College, Building, Floor, Place, PathConnection, NavigationResult } from '@/types/navigation';
import { sampleColleges, sampleBuildings, sampleFloors, samplePlaces, sampleConnections } from '@/data/mock-data';
import { buildNavigationGraph, findShortestPath } from '@/lib/navigation-algorithm';
import { api } from '@/services/api';

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

  // College CRUD
  addCollege: (college: Omit<College, 'id' | 'createdAt'>) => void;
  updateCollege: (id: string, updates: Partial<College>) => void;
  deleteCollege: (id: string) => void;

  // Building CRUD
  addBuilding: (building: Omit<Building, 'id'>) => void;
  updateBuilding: (id: string, updates: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;

  // Floor CRUD
  addFloor: (floor: Omit<Floor, 'id'>) => void;
  updateFloor: (id: string, updates: Partial<Floor>) => void;
  deleteFloor: (id: string) => void;

  // Place CRUD
  addPlace: (place: Omit<Place, 'id'>) => void;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  deletePlace: (id: string) => void;

  // Connection CRUD
  addConnection: (connection: Omit<PathConnection, 'id'>) => void;
  updateConnection: (id: string, updates: Partial<PathConnection>) => void;
  deleteConnection: (id: string) => void;

  fetchData: () => Promise<void>;

  // Utility getters
  getCollegeBuildings: () => Building[];
  getBuildingFloors: () => Floor[];
  getFloorPlaces: () => Place[];
  searchPlaces: (query: string) => Place[];
  getCollegeById: (id: string) => College | undefined;
  getBuildingById: (id: string) => Building | undefined;
  getFloorById: (id: string) => Floor | undefined;
  getPlaceById: (id: string) => Place | undefined;

  // Cascade info helpers
  getBuildingCountForCollege: (collegeId: string) => number;
  getFloorCountForBuilding: (buildingId: string) => number;
  getPlaceCountForFloor: (floorId: string) => number;
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      // Initialize with empty arrays (fetch from API)
      colleges: [],
      buildings: [],
      floors: [],
      places: [],
      connections: [],

      // ... (state vars)

      fetchData: async () => {
        try {
          const data = await api.data.getColleges();
          const connectionsData = await api.data.getConnections(); // Assume this exists in API service

          const flatColleges: College[] = [];
          const flatBuildings: Building[] = [];
          const flatFloors: Floor[] = [];
          const flatPlaces: Place[] = [];
          const flatConnections: PathConnection[] = [];

          if (connectionsData) {
            connectionsData.forEach((c: any) => {
              flatConnections.push({
                id: String(c.id),
                fromPlaceId: String(c.fromPlaceId),
                toPlaceId: String(c.toPlaceId),
                distance: c.distance || 10, // Default distance if missing
                type: c.type as any || 'corridor',
                isAccessible: true
              });
            });
          }

          data.forEach((c: any) => {
            flatColleges.push({
              id: String(c.id),
              name: c.name,
              address: c.address,
              status: 'active',
              gpsLocation: c.gpsLocation || { lat: 0, lng: 0 },
              createdAt: c.createdAt ? new Date(c.createdAt) : new Date()
            });

            if (c.Buildings) {
              c.Buildings.forEach((b: any) => {
                flatBuildings.push({
                  id: String(b.id),
                  collegeId: String(c.id),
                  name: b.name,
                  code: b.code || '',
                  floors: b.Floors?.length || 0,
                  description: b.description
                });

                if (b.Floors) {
                  b.Floors.forEach((f: any) => {
                    flatFloors.push({
                      id: String(f.id),
                      buildingId: String(b.id),
                      floorNumber: f.level,
                      name: f.name,
                      width: 800,
                      height: 600
                    });

                    if (f.Rooms) {
                      f.Rooms.forEach((r: any) => {
                        let pos = { x: 100, y: 100 };
                        if (r.coordinates) {
                          const [x, y] = r.coordinates.split(',');
                          pos = { x: parseInt(x) || 100, y: parseInt(y) || 100 };
                        }

                        flatPlaces.push({
                          id: String(r.id),
                          floorId: String(f.id),
                          buildingId: String(b.id),
                          name: r.name,
                          type: (r.type as any) || 'classroom',
                          position: pos,
                          isNode: true
                        });
                      });
                    }
                  });
                }
              });
            }
          });

          set({
            colleges: flatColleges,
            buildings: flatBuildings,
            floors: flatFloors,
            places: flatPlaces,
            connections: flatConnections
          });
        } catch (e) {
          console.error("Failed to fetch data:", e);
        }
      },

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

      // College CRUD
      addCollege: async (collegeData) => {
        try {
          const newCollege = await api.data.createCollege(collegeData);
          set((state) => ({ colleges: [...state.colleges, newCollege] }));
        } catch (error) {
          console.error("Failed to add college:", error);
          // Optional: Trigger a toast or error state here
        }
      },

      updateCollege: (id, updates) => {
        set((state) => ({
          colleges: state.colleges.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          )
        }));
      },

      deleteCollege: (id) => {
        const { buildings, floors, places, connections } = get();

        // Get all building IDs for this college
        const collegeBuildingIds = buildings.filter(b => b.collegeId === id).map(b => b.id);

        // Get all floor IDs for these buildings
        const buildingFloorIds = floors.filter(f => collegeBuildingIds.includes(f.buildingId)).map(f => f.id);

        // Get all place IDs for these floors
        const floorPlaceIds = places.filter(p => buildingFloorIds.includes(p.floorId)).map(p => p.id);

        set((state) => ({
          colleges: state.colleges.filter((c) => c.id !== id),
          buildings: state.buildings.filter((b) => b.collegeId !== id),
          floors: state.floors.filter((f) => !collegeBuildingIds.includes(f.buildingId)),
          places: state.places.filter((p) => !buildingFloorIds.includes(p.floorId)),
          connections: state.connections.filter(
            (c) => !floorPlaceIds.includes(c.fromPlaceId) && !floorPlaceIds.includes(c.toPlaceId)
          ),
          selectedCollegeId: state.selectedCollegeId === id ? null : state.selectedCollegeId,
          selectedBuildingId: collegeBuildingIds.includes(state.selectedBuildingId || '') ? null : state.selectedBuildingId,
          selectedFloorId: buildingFloorIds.includes(state.selectedFloorId || '') ? null : state.selectedFloorId
        }));
      },

      // Building CRUD
      addBuilding: async (buildingData) => {
        try {
          const newBuilding = await api.data.createBuilding(buildingData);
          set((state) => ({ buildings: [...state.buildings, newBuilding] }));
        } catch (error) {
          console.error("Failed to add building:", error);
        }
      },

      updateBuilding: (id, updates) => {
        set((state) => ({
          buildings: state.buildings.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
          )
        }));
      },

      deleteBuilding: (id) => {
        const { floors, places, connections } = get();

        // Get all floor IDs for this building
        const buildingFloorIds = floors.filter(f => f.buildingId === id).map(f => f.id);

        // Get all place IDs for these floors
        const floorPlaceIds = places.filter(p => buildingFloorIds.includes(p.floorId)).map(p => p.id);

        set((state) => ({
          buildings: state.buildings.filter((b) => b.id !== id),
          floors: state.floors.filter((f) => f.buildingId !== id),
          places: state.places.filter((p) => !buildingFloorIds.includes(p.floorId)),
          connections: state.connections.filter(
            (c) => !floorPlaceIds.includes(c.fromPlaceId) && !floorPlaceIds.includes(c.toPlaceId)
          ),
          selectedBuildingId: state.selectedBuildingId === id ? null : state.selectedBuildingId,
          selectedFloorId: buildingFloorIds.includes(state.selectedFloorId || '') ? null : state.selectedFloorId
        }));
      },

      // Floor CRUD
      addFloor: async (floorData) => {
        try {
          const newFloor = await api.data.createFloor(floorData);
          set((state) => ({ floors: [...state.floors, newFloor] }));
        } catch (error) {
          console.error("Failed to add floor:", error);
        }
      },

      updateFloor: (id, updates) => {
        set((state) => ({
          floors: state.floors.map((f) =>
            f.id === id ? { ...f, ...updates, updatedAt: new Date() } : f
          )
        }));
      },

      deleteFloor: (id) => {
        const { places, connections } = get();

        // Get all place IDs for this floor
        const floorPlaceIds = places.filter(p => p.floorId === id).map(p => p.id);

        set((state) => ({
          floors: state.floors.filter((f) => f.id !== id),
          places: state.places.filter((p) => p.floorId !== id),
          connections: state.connections.filter(
            (c) => !floorPlaceIds.includes(c.fromPlaceId) && !floorPlaceIds.includes(c.toPlaceId)
          ),
          selectedFloorId: state.selectedFloorId === id ? null : state.selectedFloorId
        }));
      },

      // Place CRUD
      addPlace: async (placeData) => {
        try {
          const newPlace = await api.data.createPlace(placeData);
          set((state) => ({ places: [...state.places, newPlace] }));
        } catch (error) {
          console.error("Failed to add place:", error);
        }
      },

      updatePlace: (id, updates) => {
        set((state) => ({
          places: state.places.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
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

      // Connection CRUD
      addConnection: (connectionData) => {
        const newConnection: PathConnection = {
          ...connectionData,
          id: `conn-${Date.now()}`
        };
        set((state) => ({ connections: [...state.connections, newConnection] }));
      },

      updateConnection: (id, updates) => {
        set((state) => ({
          connections: state.connections.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          )
        }));
      },

      deleteConnection: (id) => {
        set((state) => ({
          connections: state.connections.filter((c) => c.id !== id)
        }));
      },

      // Getters
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
      },

      getCollegeById: (id) => get().colleges.find(c => c.id === id),
      getBuildingById: (id) => get().buildings.find(b => b.id === id),
      getFloorById: (id) => get().floors.find(f => f.id === id),
      getPlaceById: (id) => get().places.find(p => p.id === id),

      getBuildingCountForCollege: (collegeId) =>
        get().buildings.filter(b => b.collegeId === collegeId).length,

      getFloorCountForBuilding: (buildingId) =>
        get().floors.filter(f => f.buildingId === buildingId).length,

      getPlaceCountForFloor: (floorId) =>
        get().places.filter(p => p.floorId === floorId).length
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
