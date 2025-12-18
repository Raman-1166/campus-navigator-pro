import { College, Building, Floor, Place, PathConnection } from '@/types/navigation';

// Sample college data
export const sampleColleges: College[] = [
  {
    id: 'college-1',
    name: 'Delhi Technical University',
    address: 'Shahbad Daulatpur, Main Bawana Road, Delhi-110042',
    gpsLocation: { lat: 28.7499, lng: 77.1171 },
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'college-2',
    name: 'Indian Institute of Technology Delhi',
    address: 'Hauz Khas, New Delhi-110016',
    gpsLocation: { lat: 28.5456, lng: 77.1926 },
    createdAt: new Date('2024-01-15')
  }
];

// Sample buildings
export const sampleBuildings: Building[] = [
  {
    id: 'building-1',
    collegeId: 'college-1',
    name: 'Main Academic Block',
    code: 'MAB',
    floors: 4
  },
  {
    id: 'building-2',
    collegeId: 'college-1',
    name: 'Engineering Block',
    code: 'EB',
    floors: 3
  },
  {
    id: 'building-3',
    collegeId: 'college-1',
    name: 'Library Building',
    code: 'LIB',
    floors: 2
  }
];

// Sample floors
export const sampleFloors: Floor[] = [
  // Main Academic Block floors
  { id: 'floor-1-0', buildingId: 'building-1', floorNumber: 0, name: 'Ground Floor', width: 800, height: 600 },
  { id: 'floor-1-1', buildingId: 'building-1', floorNumber: 1, name: 'First Floor', width: 800, height: 600 },
  { id: 'floor-1-2', buildingId: 'building-1', floorNumber: 2, name: 'Second Floor', width: 800, height: 600 },
  { id: 'floor-1-3', buildingId: 'building-1', floorNumber: 3, name: 'Third Floor', width: 800, height: 600 },
  // Engineering Block floors
  { id: 'floor-2-0', buildingId: 'building-2', floorNumber: 0, name: 'Ground Floor', width: 800, height: 600 },
  { id: 'floor-2-1', buildingId: 'building-2', floorNumber: 1, name: 'First Floor', width: 800, height: 600 },
  { id: 'floor-2-2', buildingId: 'building-2', floorNumber: 2, name: 'Second Floor', width: 800, height: 600 },
  // Library floors
  { id: 'floor-3-0', buildingId: 'building-3', floorNumber: 0, name: 'Ground Floor', width: 800, height: 600 },
  { id: 'floor-3-1', buildingId: 'building-3', floorNumber: 1, name: 'First Floor', width: 800, height: 600 },
];

// Sample places for Main Academic Block Ground Floor
export const samplePlaces: Place[] = [
  // Ground Floor - Main Academic Block
  { id: 'place-1', floorId: 'floor-1-0', buildingId: 'building-1', name: 'Main Entrance', type: 'entrance', code: 'ENT-1', position: { x: 400, y: 550 }, isNode: true },
  { id: 'place-2', floorId: 'floor-1-0', buildingId: 'building-1', name: 'Reception', type: 'office', code: 'REC', position: { x: 400, y: 450 }, isNode: true },
  { id: 'place-3', floorId: 'floor-1-0', buildingId: 'building-1', name: 'Corridor Junction A', type: 'corridor', position: { x: 400, y: 350 }, isNode: true },
  { id: 'place-4', floorId: 'floor-1-0', buildingId: 'building-1', name: 'Room 101', type: 'classroom', code: '101', position: { x: 200, y: 350 }, isNode: true },
  { id: 'place-5', floorId: 'floor-1-0', buildingId: 'building-1', name: 'Room 102', type: 'classroom', code: '102', position: { x: 600, y: 350 }, isNode: true },
  { id: 'place-6', floorId: 'floor-1-0', buildingId: 'building-1', name: 'Computer Lab', type: 'laboratory', code: 'CL-1', position: { x: 200, y: 200 }, isNode: true },
  { id: 'place-7', floorId: 'floor-1-0', buildingId: 'building-1', name: 'Canteen', type: 'canteen', code: 'CAN', position: { x: 600, y: 200 }, isNode: true },
  { id: 'place-8', floorId: 'floor-1-0', buildingId: 'building-1', name: 'Stairs A', type: 'stairs', code: 'ST-A', position: { x: 150, y: 100 }, isNode: true },
  { id: 'place-9', floorId: 'floor-1-0', buildingId: 'building-1', name: 'Elevator', type: 'lift', code: 'EL-1', position: { x: 650, y: 100 }, isNode: true },
  { id: 'place-10', floorId: 'floor-1-0', buildingId: 'building-1', name: 'Corridor Junction B', type: 'corridor', position: { x: 400, y: 200 }, isNode: true },
  { id: 'place-11', floorId: 'floor-1-0', buildingId: 'building-1', name: 'Corridor Junction C', type: 'corridor', position: { x: 400, y: 100 }, isNode: true },
  { id: 'place-12', floorId: 'floor-1-0', buildingId: 'building-1', name: 'Restroom', type: 'restroom', code: 'WC-1', position: { x: 700, y: 350 }, isNode: true },
  
  // First Floor - Main Academic Block
  { id: 'place-13', floorId: 'floor-1-1', buildingId: 'building-1', name: 'Stairs A', type: 'stairs', code: 'ST-A', position: { x: 150, y: 100 }, isNode: true },
  { id: 'place-14', floorId: 'floor-1-1', buildingId: 'building-1', name: 'Elevator', type: 'lift', code: 'EL-1', position: { x: 650, y: 100 }, isNode: true },
  { id: 'place-15', floorId: 'floor-1-1', buildingId: 'building-1', name: 'Corridor Junction D', type: 'corridor', position: { x: 400, y: 100 }, isNode: true },
  { id: 'place-16', floorId: 'floor-1-1', buildingId: 'building-1', name: 'Room 201', type: 'classroom', code: '201', position: { x: 200, y: 200 }, isNode: true },
  { id: 'place-17', floorId: 'floor-1-1', buildingId: 'building-1', name: 'Room 202', type: 'classroom', code: '202', position: { x: 400, y: 200 }, isNode: true },
  { id: 'place-18', floorId: 'floor-1-1', buildingId: 'building-1', name: 'Room 203', type: 'classroom', code: '203', position: { x: 600, y: 200 }, isNode: true },
  { id: 'place-19', floorId: 'floor-1-1', buildingId: 'building-1', name: 'Physics Lab', type: 'laboratory', code: 'PL-1', position: { x: 200, y: 350 }, isNode: true },
  { id: 'place-20', floorId: 'floor-1-1', buildingId: 'building-1', name: 'HOD Office', type: 'office', code: 'HOD', position: { x: 600, y: 350 }, isNode: true },
  { id: 'place-21', floorId: 'floor-1-1', buildingId: 'building-1', name: 'Corridor Junction E', type: 'corridor', position: { x: 400, y: 350 }, isNode: true },
  
  // Second Floor - Main Academic Block
  { id: 'place-22', floorId: 'floor-1-2', buildingId: 'building-1', name: 'Stairs A', type: 'stairs', code: 'ST-A', position: { x: 150, y: 100 }, isNode: true },
  { id: 'place-23', floorId: 'floor-1-2', buildingId: 'building-1', name: 'Elevator', type: 'lift', code: 'EL-1', position: { x: 650, y: 100 }, isNode: true },
  { id: 'place-24', floorId: 'floor-1-2', buildingId: 'building-1', name: 'Auditorium', type: 'auditorium', code: 'AUD', position: { x: 400, y: 300 }, isNode: true },
  { id: 'place-25', floorId: 'floor-1-2', buildingId: 'building-1', name: 'Corridor Junction F', type: 'corridor', position: { x: 400, y: 100 }, isNode: true },
  { id: 'place-26', floorId: 'floor-1-2', buildingId: 'building-1', name: 'Seminar Hall', type: 'auditorium', code: 'SH-1', position: { x: 200, y: 200 }, isNode: true },
];

// Path connections
export const sampleConnections: PathConnection[] = [
  // Ground Floor connections
  { id: 'conn-1', fromPlaceId: 'place-1', toPlaceId: 'place-2', distance: 10, isAccessible: true, type: 'corridor' },
  { id: 'conn-2', fromPlaceId: 'place-2', toPlaceId: 'place-3', distance: 10, isAccessible: true, type: 'corridor' },
  { id: 'conn-3', fromPlaceId: 'place-3', toPlaceId: 'place-4', distance: 20, isAccessible: true, type: 'corridor' },
  { id: 'conn-4', fromPlaceId: 'place-3', toPlaceId: 'place-5', distance: 20, isAccessible: true, type: 'corridor' },
  { id: 'conn-5', fromPlaceId: 'place-3', toPlaceId: 'place-10', distance: 15, isAccessible: true, type: 'corridor' },
  { id: 'conn-6', fromPlaceId: 'place-10', toPlaceId: 'place-6', distance: 20, isAccessible: true, type: 'corridor' },
  { id: 'conn-7', fromPlaceId: 'place-10', toPlaceId: 'place-7', distance: 20, isAccessible: true, type: 'corridor' },
  { id: 'conn-8', fromPlaceId: 'place-10', toPlaceId: 'place-11', distance: 10, isAccessible: true, type: 'corridor' },
  { id: 'conn-9', fromPlaceId: 'place-11', toPlaceId: 'place-8', distance: 25, isAccessible: true, type: 'corridor' },
  { id: 'conn-10', fromPlaceId: 'place-11', toPlaceId: 'place-9', distance: 25, isAccessible: true, type: 'corridor' },
  { id: 'conn-11', fromPlaceId: 'place-5', toPlaceId: 'place-12', distance: 10, isAccessible: true, type: 'corridor' },
  
  // Floor connections (stairs and elevator)
  { id: 'conn-12', fromPlaceId: 'place-8', toPlaceId: 'place-13', distance: 5, isAccessible: false, type: 'stairs' },
  { id: 'conn-13', fromPlaceId: 'place-9', toPlaceId: 'place-14', distance: 3, isAccessible: true, type: 'lift' },
  
  // First Floor connections
  { id: 'conn-14', fromPlaceId: 'place-13', toPlaceId: 'place-15', distance: 25, isAccessible: true, type: 'corridor' },
  { id: 'conn-15', fromPlaceId: 'place-14', toPlaceId: 'place-15', distance: 25, isAccessible: true, type: 'corridor' },
  { id: 'conn-16', fromPlaceId: 'place-15', toPlaceId: 'place-16', distance: 20, isAccessible: true, type: 'corridor' },
  { id: 'conn-17', fromPlaceId: 'place-15', toPlaceId: 'place-17', distance: 10, isAccessible: true, type: 'corridor' },
  { id: 'conn-18', fromPlaceId: 'place-15', toPlaceId: 'place-18', distance: 20, isAccessible: true, type: 'corridor' },
  { id: 'conn-19', fromPlaceId: 'place-17', toPlaceId: 'place-21', distance: 15, isAccessible: true, type: 'corridor' },
  { id: 'conn-20', fromPlaceId: 'place-21', toPlaceId: 'place-19', distance: 20, isAccessible: true, type: 'corridor' },
  { id: 'conn-21', fromPlaceId: 'place-21', toPlaceId: 'place-20', distance: 20, isAccessible: true, type: 'corridor' },
  
  // Second floor connections
  { id: 'conn-22', fromPlaceId: 'place-13', toPlaceId: 'place-22', distance: 5, isAccessible: false, type: 'stairs' },
  { id: 'conn-23', fromPlaceId: 'place-14', toPlaceId: 'place-23', distance: 3, isAccessible: true, type: 'lift' },
  { id: 'conn-24', fromPlaceId: 'place-22', toPlaceId: 'place-25', distance: 25, isAccessible: true, type: 'corridor' },
  { id: 'conn-25', fromPlaceId: 'place-23', toPlaceId: 'place-25', distance: 25, isAccessible: true, type: 'corridor' },
  { id: 'conn-26', fromPlaceId: 'place-25', toPlaceId: 'place-26', distance: 20, isAccessible: true, type: 'corridor' },
  { id: 'conn-27', fromPlaceId: 'place-25', toPlaceId: 'place-24', distance: 20, isAccessible: true, type: 'corridor' },
];

// Helper function to get all places for a specific college
export function getPlacesForCollege(collegeId: string): Place[] {
  const buildingIds = sampleBuildings
    .filter(b => b.collegeId === collegeId)
    .map(b => b.id);
  return samplePlaces.filter(p => buildingIds.includes(p.buildingId));
}

// Helper function to search places
export function searchPlaces(query: string, collegeId: string): Place[] {
  const places = getPlacesForCollege(collegeId);
  const lowerQuery = query.toLowerCase();
  return places.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    (p.code && p.code.toLowerCase().includes(lowerQuery)) ||
    p.type.toLowerCase().includes(lowerQuery)
  );
}
