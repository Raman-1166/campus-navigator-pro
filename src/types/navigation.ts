// Core data types for the indoor navigation system

export interface College {
  id: string;
  name: string;
  address: string;
  description?: string;
  status: 'active' | 'inactive';
  gpsLocation: {
    lat: number;
    lng: number;
  };
  logoUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Building {
  id: string;
  collegeId: string;
  name: string;
  code: string; // Short code like "MB" for Main Building
  description?: string;
  floors: number;
  gpsLocation?: {
    lat: number;
    lng: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
  name: string; // e.g., "Ground Floor", "First Floor"
  floorPlanUrl?: string;
  width: number; // Canvas width
  height: number; // Canvas height
  createdAt?: Date;
  updatedAt?: Date;
}

export type PlaceType = 
  | 'classroom' 
  | 'laboratory' 
  | 'office' 
  | 'canteen' 
  | 'auditorium' 
  | 'library'
  | 'restroom'
  | 'stairs' 
  | 'lift' 
  | 'entrance'
  | 'exit'
  | 'corridor'
  | 'sports'
  | 'parking'
  | 'other';

export interface Place {
  id: string;
  floorId: string;
  buildingId: string;
  name: string;
  type: PlaceType;
  code?: string; // Room number like "101", "A-203"
  description?: string;
  position: {
    x: number;
    y: number;
  };
  // For corridor segments, we use start and end points
  isNode: boolean; // True for rooms, stairs, lifts; false for corridor waypoints
  connectedTo?: string[]; // IDs of connected places/nodes
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PathConnection {
  id: string;
  fromPlaceId: string;
  toPlaceId: string;
  distance: number; // in meters
  isAccessible: boolean; // wheelchair accessible
  type: 'corridor' | 'stairs' | 'lift';
}

// Graph representation for navigation
export interface NavigationGraph {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge[]>;
}

export interface GraphNode {
  id: string;
  place: Place;
  floor: Floor;
  building: Building;
}

export interface GraphEdge {
  targetId: string;
  distance: number;
  type: 'corridor' | 'stairs' | 'lift';
  isAccessible: boolean;
}

// Navigation result
export interface NavigationResult {
  path: NavigationStep[];
  totalDistance: number; // in meters
  totalSteps: number; // footsteps (1 step = 0.75m)
  estimatedTime: number; // in seconds (assuming 1.2 m/s walking speed)
  floorsTraversed: number;
}

export interface NavigationStep {
  instruction: string;
  place: Place;
  floor: Floor;
  building: Building;
  distance: number; // distance to next step in meters
  direction?: 'straight' | 'left' | 'right' | 'up' | 'down';
  isFloorChange: boolean;
}

// Search result for places
export interface SearchResult {
  place: Place;
  floor: Floor;
  building: Building;
  fullName: string; // Combined display name
}
