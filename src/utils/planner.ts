import type { CourseCatalog } from "../data/courseCatalog";
import type { Course } from "../types";
import type { PlannerSemester, Term } from "../types";

export interface PlannerUtils {
  residencyRequired: number;
  sumCredits: (chosenIds: string[]) => { credits: number; residency: number };
  allChosenIds: (semesters: PlannerSemester[]) => string[];
  allPlannedSlotIds: (semesters: PlannerSemester[]) => string[];
  plannedSlotIdSet: (semesters: PlannerSemester[]) => Set<string>;
  completedIdsFromSlots: (semesters: PlannerSemester[]) => Set<string>;
  getSlotIdForCourse: (courseId: string) => string;
  getUnmetPrereqs: (courseId: string, completedIds: Set<string>) => Course[];
  formatPrereqError: (missing: Course[]) => string;
  getAvailableCourses: (
    completedIds: Set<string>,
    plannedSlotIds: Set<string>,
    targetTerm: Term,
  ) => Course[];
  isSlotOverridden: (semesters: PlannerSemester[], slotId: string) => boolean;
}

export function createPlannerUtils(
  catalog: CourseCatalog,
  residencyRequired: number,
): PlannerUtils {
  const { courseMap, courses, getMainSlotId, isPrereqSatisfied } = catalog;

  const sumCredits = (chosenIds: string[]) => {
    let credits = 0;
    let residency = 0;
    for (const id of chosenIds) {
      const c = courseMap[id];
      if (c) {
        credits += c.credits;
        residency += c.residencyCredits;
      }
    }
    return { credits, residency };
  };

  const allChosenIds = (semesters: PlannerSemester[]) =>
    semesters.flatMap((s) => s.slots.map((sl) => sl.chosenId));

  const allPlannedSlotIds = (semesters: PlannerSemester[]) =>
    semesters.flatMap((s) => s.slots.map((sl) => sl.slotId));

  const plannedSlotIdSet = (semesters: PlannerSemester[]) =>
    new Set(allPlannedSlotIds(semesters));

  const completedIdsFromSlots = (semesters: PlannerSemester[]) =>
    new Set(allChosenIds(semesters));

  const getSlotIdForCourse = (courseId: string) => getMainSlotId(courseId);

  const getUnmetPrereqs = (courseId: string, completedIds: Set<string>) => {
    const course = courseMap[courseId];
    if (!course) return [];
    return course.prereqs
      .filter((p) => !isPrereqSatisfied(p, completedIds))
      .map((p) => courseMap[p])
      .filter((c): c is Course => Boolean(c));
  };

  const formatPrereqError = (missing: Course[]) => {
    if (missing.length === 0) return "";
    const names = missing.map((c) => c.label).join(", ");
    return missing.length === 1
      ? `${names} is required`
      : `${names} are required`;
  };

  const getAvailableCourses = (
    completedIds: Set<string>,
    plannedSlotIds: Set<string>,
    targetTerm: Term,
  ) =>
    courses.filter((c) => {
      if (c.replacesMain) return false;
      const slotId = c.id;
      if (plannedSlotIds.has(slotId)) return false;
      if (completedIds.has(c.id)) return false;
      if (c.category === "elective") return false;
      const prereqsMet = c.prereqs.every((p) =>
        isPrereqSatisfied(p, completedIds),
      );
      const termOk = c.offered === "both" || c.offered === targetTerm;
      return prereqsMet && termOk;
    });

  const isSlotOverridden = (semesters: PlannerSemester[], slotId: string) => {
    for (const sem of semesters) {
      const slot = sem.slots.find((s) => s.slotId === slotId);
      if (slot?.overridden) return true;
    }
    return false;
  };

  return {
    residencyRequired,
    sumCredits,
    allChosenIds,
    allPlannedSlotIds,
    plannedSlotIdSet,
    completedIdsFromSlots,
    getSlotIdForCourse,
    getUnmetPrereqs,
    formatPrereqError,
    getAvailableCourses,
    isSlotOverridden,
  };
}

/** @deprecated Use createPlannerUtils with CE catalog */
export const ECE_RESIDENCY_REQUIRED = 51;
