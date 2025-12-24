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
  const rawSteps: {
    node: GraphNode;
    distance: number;
    isFloorChange: boolean;
    direction: NavigationStep['direction'];
  }[] = [];

  // 1. Convert path IDs to raw step data
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

    if (lastFloorId !== null && lastFloorId !== node.floor.id) {
      floorsTraversed++;
    }
    lastFloorId = node.floor.id;

    rawSteps.push({ node, distance, isFloorChange, direction });
  }

  // 2. Consolidate Steps
  const consolidatedSteps: NavigationStep[] = [];

  if (rawSteps.length > 0) {
    // Add Start
    consolidatedSteps.push({
      instruction: `Start at ${rawSteps[0].node.place.name}`,
      place: rawSteps[0].node.place,
      floor: rawSteps[0].node.floor,
      building: rawSteps[0].node.building,
      distance: 0,
      direction: 'straight',
      isFloorChange: false
    });

    let currentSegmentDistance = 0;

    // Iterate from second node to second-to-last
    for (let i = 0; i < rawSteps.length - 1; i++) {
      const current = rawSteps[i];
      const next = rawSteps[i + 1];

      currentSegmentDistance += current.distance;

      // Check if we need to emit a step
      // A step is emitted if:
      // 1. It's a floor change
      // 2. It's a significant turn
      // 3. It's the last segment

      const isLastSegment = i === rawSteps.length - 2;

      if (current.isFloorChange) {
        consolidatedSteps.push({
          instruction: current.direction === 'up'
            ? `Go up to ${next.node.floor.name} (${next.node.place.type === 'stairs' ? 'Stairs' : 'Elevator'})`
            : `Go down to ${next.node.floor.name} (${next.node.place.type === 'stairs' ? 'Stairs' : 'Elevator'})`,
          place: current.node.place,
          floor: current.node.floor,
          building: current.node.building,
          distance: currentSegmentDistance,
          direction: current.direction,
          isFloorChange: true
        });
        currentSegmentDistance = 0;
      } else if (!isLastSegment) {
        // Turn detection
        const prevNode = rawSteps[i].node; // Actually current for geometry context? 
        // Wait, to calculate angle at Node B, we need A->B and B->C.
        // rawSteps[i] is the step *leaving* node i. 
        // rawSteps[i-1] was entering node i.

        // Let's look at i as the "Current Point". 
        // Vector 1: i-1 -> i
        // Vector 2: i -> i+1

        if (i > 0) {
          const p1 = rawSteps[i - 1].node.place.position;
          const p2 = rawSteps[i].node.place.position;
          const p3 = rawSteps[i + 1].node.place.position;

          const turn = calculateTurnDirection(p1, p2, p3);

          if (turn !== 'straight') {
            // We are at p2 (current.node), turning to go to p3
            // Emit the instructions for the segment LEADING UP TO this turn
            consolidatedSteps.push({
              instruction: `Go forward for ${Math.round(currentSegmentDistance)}m, then turn ${turn}`,
              place: current.node.place,
              floor: current.node.floor,
              building: current.node.building,
              distance: currentSegmentDistance,
              direction: turn,
              isFloorChange: false
            });
            currentSegmentDistance = 0;
          }
        }
      }
    }

    // Add Arrival
    const lastStep = rawSteps[rawSteps.length - 1];

    // If there is leftover distance from the last segment(s)
    if (currentSegmentDistance > 0) {
      consolidatedSteps.push({
        instruction: `Go forward for ${Math.round(currentSegmentDistance)}m to arrive`,
        place: lastStep.node.place,
        floor: lastStep.node.floor,
        building: lastStep.node.building,
        distance: currentSegmentDistance,
        direction: 'straight',
        isFloorChange: false
      });
    }

    consolidatedSteps.push({
      instruction: `Arrived at ${lastStep.node.place.name}`,
      place: lastStep.node.place,
      floor: lastStep.node.floor,
      building: lastStep.node.building,
      distance: 0,
      direction: 'straight',
      isFloorChange: false
    });
  }

  const totalSteps = Math.round(totalDistance / METERS_PER_STEP);
  const estimatedTime = Math.round(totalDistance / WALKING_SPEED_MPS);

  return {
    path: consolidatedSteps,
    totalDistance: Math.round(totalDistance),
    totalSteps: consolidatedSteps.length, // Steps = instructions now
    estimatedTime,
    floorsTraversed
  };
}

/**
 * Calculate turn direction based on 3 points (2D vectors)
 */
function calculateTurnDirection(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): 'left' | 'right' | 'straight' {
  // Vector A: p1 -> p2
  const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
  // Vector B: p2 -> p3
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

  // Cross product (2D)
  // CP = x1*y2 - y1*x2
  const crossProduct = v1.x * v2.y - v1.y * v2.x;

  // Dot product for angle magnitude checking (to ignore slight deviations)
  // but for grid-like corridors, CP is usually enough.

  // Threshold for "straight" to allow minor jitter
  const threshold = 100; // Depends on coordinate scale.
  // Assuming standard coordinates, 0 is straight.

  // Normalize vectors to be safe? 
  // For simple grid turns, let's just use the sign of CP.
  // However, we should check we aren't just continuing straight.

  // Angle check
  const angle1 = Math.atan2(v1.y, v1.x);
  const angle2 = Math.atan2(v2.y, v2.x);
  let angleDiff = angle2 - angle1;

  // Normalize to -PI to +PI
  while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
  while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

  const angleDeg = angleDiff * (180 / Math.PI);

  if (Math.abs(angleDeg) < 25) return 'straight'; // < 25 degrees is straight
  if (angleDeg > 0) return 'right';
  return 'left';
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
