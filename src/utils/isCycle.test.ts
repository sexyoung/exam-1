import { isCycle } from './isCycle';

describe('isCycle', () => {
  it('should return true for A=[3,1,2], B=[2,3,1]', () => {
    expect(isCycle([3, 1, 2], [2, 3, 1])).toBe(true);
  });

  it('should return false for A=[1,2,1], B=[2,3,3] (duplicate source)', () => {
    expect(isCycle([1, 2, 1], [2, 3, 3])).toBe(false);
  });

  it('should return false for A=[1,2,3,4], B=[2,1,4,4] (duplicate destination)', () => {
    expect(isCycle([1, 2, 3, 4], [2, 1, 4, 4])).toBe(false);
  });

  it('should return false for A=[1,2,3,4], B=[2,1,4,3] (two disjoint cycles)', () => {
    expect(isCycle([1, 2, 3, 4], [2, 1, 4, 3])).toBe(false);
  });

  it('should return false for A=[1,2,2,3,3], B=[2,3,3,4,5] (multiple edges)', () => {
    expect(isCycle([1, 2, 2, 3, 3], [2, 3, 3, 4, 5])).toBe(false);
  });

  it('should return true for single vertex self-loop A=[1], B=[1]', () => {
    expect(isCycle([1], [1])).toBe(true);
  });

  it('should return false for empty arrays', () => {
    expect(isCycle([], [])).toBe(false);
  });

  it('should return true for A=[1,2], B=[2,1] (simple 2-cycle)', () => {
    expect(isCycle([1, 2], [2, 1])).toBe(true);
  });

  describe('edge cases', () => {
    it('should return false when all edges from same vertex', () => {
      // A = [1, 1, 1], all from vertex 1
      expect(isCycle([1, 1, 1], [2, 3, 1])).toBe(false);
    });

    it('should return false when all edges to same vertex', () => {
      // B = [1, 1, 1], all to vertex 1
      expect(isCycle([1, 2, 3], [1, 1, 1])).toBe(false);
    });

    it('should return false when vertex missing from A', () => {
      // N=3 but vertex 3 has no outgoing edge
      expect(isCycle([1, 2, 1], [2, 1, 3])).toBe(false);
    });

    it('should return false when vertex missing from B', () => {
      // N=3 but vertex 3 has no incoming edge
      expect(isCycle([1, 2, 3], [2, 1, 2])).toBe(false);
    });

    it('should return true for N=1 self-loop', () => {
      expect(isCycle([1], [1])).toBe(true);
    });

    it('should return false for N=1 but edge goes elsewhere', () => {
      // vertex 1 -> vertex 2, but N=1 so vertex 2 is out of range
      expect(isCycle([1], [2])).toBe(false);
    });

    it('should return true for large cycle starting from different vertex order', () => {
      // A = [3, 1, 2], B = [1, 2, 3] means 3->1, 1->2, 2->3
      expect(isCycle([3, 1, 2], [1, 2, 3])).toBe(true);
    });

    it('should return false for three separate self-loops', () => {
      // 1->1, 2->2, 3->3 (three self-loops, not one cycle)
      expect(isCycle([1, 2, 3], [1, 2, 3])).toBe(false);
    });

    it('should return false when graph has unreachable vertex', () => {
      // 1->2, 2->1, 3->3 (vertex 3 is separate)
      expect(isCycle([1, 2, 3], [2, 1, 3])).toBe(false);
    });
  });

  describe('performance tests (N=100,000)', () => {
    const N = 100000;

    it('should handle large valid cycle efficiently', () => {
      // 1 -> 2 -> 3 -> ... -> N -> 1
      const A = Array.from({ length: N }, (_, i) => i + 1);
      const B = Array.from({ length: N }, (_, i) => (i + 1) % N + 1);
      // B = [2, 3, 4, ..., N, 1]

      const start = performance.now();
      const result = isCycle(A, B);
      const elapsed = performance.now() - start;

      expect(result).toBe(true);
      expect(elapsed).toBeLessThan(1000); // should complete within 1 second
    });

    it('should handle large invalid graph efficiently', () => {
      // Two disjoint cycles: 1->2->1, 3->4->3, ...
      const A = Array.from({ length: N }, (_, i) => i + 1);
      const B = Array.from({ length: N }, (_, i) => {
        return i % 2 === 0 ? i + 2 : i;
      });

      const start = performance.now();
      const result = isCycle(A, B);
      const elapsed = performance.now() - start;

      expect(result).toBe(false);
      expect(elapsed).toBeLessThan(1000);
    });
  });
});
