export function isCycle(A: number[], B: number[]): boolean {
  const N = A.length;

  if (N === 0) return false;
  if (A.length !== B.length) return false;

  // Build edge map: source -> destination
  const edgeMap = new Map<number, number>();
  for (let i = 0; i < N; i++) {
    // Check for multiple outgoing edges from same vertex
    if (edgeMap.has(A[i])) {
      return false;
    }
    edgeMap.set(A[i], B[i]);
  }

  // Check that all vertices 1 to N have outgoing edges
  for (let v = 1; v <= N; v++) {
    if (!edgeMap.has(v)) {
      return false;
    }
  }

  // Check in-degree (each vertex should have exactly one incoming edge)
  const inDegree = new Map<number, number>();
  for (let i = 0; i < N; i++) {
    inDegree.set(B[i], (inDegree.get(B[i]) || 0) + 1);
  }
  for (let v = 1; v <= N; v++) {
    if (inDegree.get(v) !== 1) {
      return false;
    }
  }

  // Follow edges from vertex 1 and count visited vertices
  let current = 1;
  let count = 0;
  const visited = new Set<number>();

  while (!visited.has(current)) {
    visited.add(current);
    count++;
    current = edgeMap.get(current)!;
  }

  // Should visit all N vertices and return to vertex 1
  return count === N && current === 1;
}
