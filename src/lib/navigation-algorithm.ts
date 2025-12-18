import { 
  NavigationGraph, 
  GraphNode, 
  GraphEdge, 
  NavigationResult, 
  NavigationStep,
  Place,
  Floor,
  Building,
  PathConnection
} from '@/types/navigation';

// Constants
const METERS_PER_STEP = 0.75;
const WALKING_SPEED_MPS = 1.2; // meters per second

/**
 * Build a navigation graph from places and connections
 */
export function buildNavigationGraph(
  places: Place[],
  connections: PathConnection[],
  floors: Floor[],
  buildings: Building[]
): NavigationGraph {
  const nodes = new Map<string, GraphNode>();
  const edges = new Map<string, GraphEdge[]>();

  // Create floor and building lookup maps
  const floorMap = new Map(floors.map(f => [f.id, f]));
  const buildingMap = new Map(buildings.map(b => [b.id, b]));

  // Add all places as nodes
  places.forEach(place => {
    const floor = floorMap.get(place.floorId);
    const building = buildingMap.get(place.buildingId);
    
    if (floor && building) {
      nodes.set(place.id, {
        id: place.id,
        place,
        floor,
        building
      });
      edges.set(place.id, []);
    }
  });

  // Add connections as edges (bidirectional)
  connections.forEach(conn => {
    const fromEdges = edges.get(conn.fromPlaceId) || [];
    const toEdges = edges.get(conn.toPlaceId) || [];

    fromEdges.push({
      targetId: conn.toPlaceId,
      distance: conn.distance,
      type: conn.type,
      isAccessible: conn.isAccessible
    });

    toEdges.push({
      targetId: conn.fromPlaceId,
      distance: conn.distance,
      type: conn.type,
      isAccessible: conn.isAccessible
    });

    edges.set(conn.fromPlaceId, fromEdges);
    edges.set(conn.toPlaceId, toEdges);
  });

  return { nodes, edges };
}

/**
 * Dijkstra's algorithm for finding the shortest path
 */
export function findShortestPath(
  graph: NavigationGraph,
  startId: string,
  endId: string,
  preferAccessible: boolean = false
): NavigationResult | null {
  const { nodes, edges } = graph;

  if (!nodes.has(startId) || !nodes.has(endId)) {
    return null;
  }

  // Priority queue implementation using array (for simplicity)
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const visited = new Set<string>();

  // Initialize
  nodes.forEach((_, nodeId) => {
    distances.set(nodeId, Infinity);
    previous.set(nodeId, null);
  });
  distances.set(startId, 0);

  // Process nodes
  while (visited.size < nodes.size) {
    // Find unvisited node with minimum distance
    let minNode: string | null = null;
    let minDist = Infinity;

    distances.forEach((dist, nodeId) => {
      if (!visited.has(nodeId) && dist < minDist) {
        minNode = nodeId;
        minDist = dist;
      }
    });

    if (minNode === null || minDist === Infinity) break;
    if (minNode === endId) break;

    visited.add(minNode);

    // Update neighbors
    const nodeEdges = edges.get(minNode) || [];
    nodeEdges.forEach(edge => {
      if (visited.has(edge.targetId)) return;
      
      // If preferring accessible routes, add penalty for non-accessible paths
      let edgeWeight = edge.distance;
      if (preferAccessible && !edge.isAccessible) {
        edgeWeight += 1000; // Large penalty
      }

      const newDist = minDist + edgeWeight;
      const currentDist = distances.get(edge.targetId) || Infinity;

      if (newDist < currentDist) {
        distances.set(edge.targetId, newDist);
        previous.set(edge.targetId, minNode);
      }
    });
  }

  // Reconstruct path
  const path: string[] = [];
  let current: string | null = endId;

  while (current !== null) {
    path.unshift(current);
    current = previous.get(current) || null;
  }

  if (path[0] !== startId) {
    return null; // No path found
  }

  // Build navigation steps
  return buildNavigationResult(graph, path, edges);
}

/**
 * BFS for simple routing (unweighted shortest path)
 */
export function findPathBFS(
  graph: NavigationGraph,
  startId: string,
  endId: string
): NavigationResult | null {
  const { nodes, edges } = graph;

  if (!nodes.has(startId) || !nodes.has(endId)) {
    return null;
  }

  const queue: string[] = [startId];
  const visited = new Set<string>([startId]);
  const previous = new Map<string, string | null>();
  previous.set(startId, null);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current === endId) {
      // Reconstruct path
      const path: string[] = [];
      let node: string | null = endId;

      while (node !== null) {
        path.unshift(node);
        node = previous.get(node) || null;
      }

      return buildNavigationResult(graph, path, edges);
    }

    const nodeEdges = edges.get(current) || [];
    nodeEdges.forEach(edge => {
      if (!visited.has(edge.targetId)) {
        visited.add(edge.targetId);
        previous.set(edge.targetId, current);
        queue.push(edge.targetId);
      }
    });
  }

  return null;
}

/**
 * Build navigation result from path
 */
function buildNavigationResult(
  graph: NavigationGraph,
  path: string[],
  edges: Map<string, GraphEdge[]>
): NavigationResult {
  const steps: NavigationStep[] = [];
  let totalDistance = 0;
  let floorsTraversed = 0;
  let lastFloorId: string | null = null;

  for (let i = 0; i < path.length; i++) {
    const nodeId = path[i];
    const node = graph.nodes.get(nodeId)!;
    const nextNodeId = path[i + 1];
    
    let distance = 0;
    let direction: NavigationStep['direction'] = 'straight';
    let isFloorChange = false;

    if (nextNodeId) {
      const nodeEdges = edges.get(nodeId) || [];
      const edge = nodeEdges.find(e => e.targetId === nextNodeId);
      distance = edge?.distance || 0;
      totalDistance += distance;

      const nextNode = graph.nodes.get(nextNodeId);
      if (nextNode && nextNode.floor.id !== node.floor.id) {
        isFloorChange = true;
        direction = nextNode.floor.floorNumber > node.floor.floorNumber ? 'up' : 'down';
      }
    }

    // Track floor changes
    if (lastFloorId !== null && lastFloorId !== node.floor.id) {
      floorsTraversed++;
    }
    lastFloorId = node.floor.id;

    // Generate instruction
    const instruction = generateInstruction(node, i, path.length, isFloorChange, direction);

    steps.push({
      instruction,
      place: node.place,
      floor: node.floor,
      building: node.building,
      distance,
      direction,
      isFloorChange
    });
  }

  const totalSteps = Math.round(totalDistance / METERS_PER_STEP);
  const estimatedTime = Math.round(totalDistance / WALKING_SPEED_MPS);

  return {
    path: steps,
    totalDistance: Math.round(totalDistance),
    totalSteps,
    estimatedTime,
    floorsTraversed
  };
}

/**
 * Generate human-readable instruction
 */
function generateInstruction(
  node: GraphNode,
  stepIndex: number,
  totalSteps: number,
  isFloorChange: boolean,
  direction?: NavigationStep['direction']
): string {
  const { place, floor, building } = node;

  if (stepIndex === 0) {
    return `Start at ${place.name} (${building.name}, ${floor.name})`;
  }

  if (stepIndex === totalSteps - 1) {
    return `Arrive at ${place.name} (${building.name}, ${floor.name})`;
  }

  if (isFloorChange) {
    if (place.type === 'stairs') {
      return `Take the stairs ${direction === 'up' ? 'up' : 'down'} to ${floor.name}`;
    }
    if (place.type === 'lift') {
      return `Take the elevator ${direction === 'up' ? 'up' : 'down'} to ${floor.name}`;
    }
  }

  if (place.type === 'corridor') {
    return `Continue through the corridor`;
  }

  return `Pass by ${place.name}`;
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  scale: number = 0.1 // pixels to meters conversion
): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy) * scale;
}

/**
 * Format time in human-readable format
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} sec`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }
  return `${minutes} min ${remainingSeconds} sec`;
}

/**
 * Format distance in human-readable format
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
