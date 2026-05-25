/** Back-compat re-exports — prefer `tracks` + `courseCatalog` for new code. */
import { buildCourseCatalog } from "./courseCatalog";
import { ceCourses } from "./ceCourses";

const ce = buildCourseCatalog(ceCourses);

export const courses = ce.courses;
export const courseMap = ce.courseMap;
export const getMainSlotId = ce.getMainSlotId;
export const getSlotIds = ce.getSlotIds;
export const isPrereqSatisfied = ce.isPrereqSatisfied;
export const getUnlocks = ce.getUnlocks;
export const edgeKey = ce.edgeKey;
export const getHighlightedEdgeKeys = ce.getHighlightedEdgeKeys;
export const getUnlockCourseIds = ce.getUnlockCourseIds;
export const getPrereqEdges = ce.getPrereqEdges;
export const groupCoursesByRow = ce.groupCoursesByRow;
