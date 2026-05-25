import type { Course } from "../types";

export interface CourseCatalog {
  courses: Course[];
  courseMap: Record<string, Course>;
  getMainSlotId: (id: string) => string;
  getSlotIds: (id: string) => string[];
  isPrereqSatisfied: (prereqId: string, completedIds: Set<string>) => boolean;
  getUnlocks: (id: string) => Course[];
  edgeKey: (from: string, to: string) => string;
  getHighlightedEdgeKeys: (hoveredId: string | null) => Set<string>;
  getUnlockCourseIds: (hoveredId: string | null) => Set<string>;
  getPrereqEdges: () => { from: string; to: string }[];
  groupCoursesByRow: (
    year: number,
    term: "fall" | "spring",
  ) => { row: number; primary: Course; alternatives: Course[] }[];
}

export function buildCourseCatalog(courses: Course[]): CourseCatalog {
  const courseMap = Object.fromEntries(
    courses.map((c) => [c.id, c]),
  ) as Record<string, Course>;

  const getMainSlotId = (id: string): string => {
    const c = courseMap[id];
    return c?.replacesMain ?? id;
  };

  const getSlotIds = (id: string): string[] => {
    const main = getMainSlotId(id);
    const alts = courses
      .filter((c) => c.replacesMain === main)
      .map((c) => c.id);
    return [main, ...alts];
  };

  const isPrereqSatisfied = (
    prereqId: string,
    completedIds: Set<string>,
  ): boolean => {
    const slot = getSlotIds(prereqId);
    return slot.some((sid) => completedIds.has(sid));
  };

  const getUnlocks = (id: string): Course[] => {
    const slots = new Set(getSlotIds(id));
    return courses.filter(
      (c) => !c.replacesMain && c.prereqs.some((p) => slots.has(p)),
    );
  };

  const edgeKey = (from: string, to: string) => `${from}->${to}`;

  const getPrereqEdges = (): { from: string; to: string }[] => {
    const edges: { from: string; to: string }[] = [];
    for (const c of courses) {
      const to = getMainSlotId(c.id);
      for (const p of c.prereqs) {
        const from = getMainSlotId(p);
        if (courseMap[from]) edges.push({ from, to });
      }
    }
    return edges;
  };

  const getHighlightedEdgeKeys = (hoveredId: string | null): Set<string> => {
    if (!hoveredId) return new Set();
    const hoveredSlot = getMainSlotId(hoveredId);
    const fromSlots = new Set(getSlotIds(hoveredId));
    const keys = new Set<string>();
    for (const { from, to } of getPrereqEdges()) {
      if (fromSlots.has(from) || to === hoveredSlot) {
        keys.add(edgeKey(from, to));
      }
    }
    return keys;
  };

  const getUnlockCourseIds = (hoveredId: string | null): Set<string> => {
    if (!hoveredId) return new Set();
    const fromSlots = new Set(getSlotIds(hoveredId));
    const ids = new Set<string>();
    for (const c of courses) {
      if (c.prereqs.some((p) => fromSlots.has(getMainSlotId(p)))) {
        ids.add(c.id);
      }
    }
    return ids;
  };

  const groupCoursesByRow = (
    year: number,
    term: "fall" | "spring",
  ): { row: number; primary: Course; alternatives: Course[] }[] => {
    const cell = courses.filter((c) => c.year === year && c.term === term);
    const byRow = new Map<number, { primary: Course; alternatives: Course[] }>();
    for (const c of cell) {
      if (c.replacesMain) {
        const row = byRow.get(c.row);
        if (row) row.alternatives.push(c);
        else {
          const main = courseMap[c.replacesMain];
          if (main) {
            byRow.set(c.row, { primary: main, alternatives: [c] });
          }
        }
      } else if (!byRow.has(c.row)) {
        byRow.set(c.row, { primary: c, alternatives: [] });
      } else {
        byRow.get(c.row)!.primary = c;
      }
    }
    return [...byRow.entries()]
      .sort(([a], [b]) => a - b)
      .map(([row, g]) => ({ row, ...g }));
  };

  return {
    courses,
    courseMap,
    getMainSlotId,
    getSlotIds,
    isPrereqSatisfied,
    getUnlocks,
    edgeKey,
    getHighlightedEdgeKeys,
    getUnlockCourseIds,
    getPrereqEdges,
    groupCoursesByRow,
  };
}
