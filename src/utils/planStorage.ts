import type { DegreeTrack } from "../data/tracks";
import { getTrack } from "../data/tracks";
import type { PlannerSemester, Term } from "../types";

const STORAGE_VERSION = 2;
const LEGACY_KEY = "ru-ce-course-track-plan";
const planKey = (track: DegreeTrack) => `ru-ce-course-track-plan-${track}`;
const TRACK_KEY = "ru-ce-course-track-active";

export interface PersistedPlan {
  version: number;
  semesters: PlannerSemester[];
  activeSemesterId: string;
  availableTerm: Term;
  plannerWidth: number;
  electivesHeight: number;
}

export function defaultSemesters(): PlannerSemester[] {
  return [
    {
      id: "sem-default-fall-2025",
      name: "Fall 2025",
      term: "fall",
      slots: [],
    },
    {
      id: "sem-default-spring-2026",
      name: "Spring 2026",
      term: "spring",
      slots: [],
    },
    {
      id: "sem-default-fall-2026",
      name: "Fall 2026",
      term: "fall",
      slots: [],
    },
  ];
}

export function defaultPersistedPlan(): PersistedPlan {
  const semesters = defaultSemesters();
  return {
    version: STORAGE_VERSION,
    semesters,
    activeSemesterId: semesters[0].id,
    availableTerm: "fall",
    plannerWidth: 300,
    electivesHeight: 200,
  };
}

function isTerm(value: unknown): value is Term {
  return value === "fall" || value === "spring";
}

function isDegreeTrack(value: unknown): value is DegreeTrack {
  return value === "ce" || value === "ee";
}

function sanitizeSemesters(
  raw: unknown,
  track: DegreeTrack,
): PlannerSemester[] | null {
  const courseMap = getTrack(track).catalog.courseMap;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const semesters: PlannerSemester[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const id = typeof row.id === "string" ? row.id.trim() : "";
    const name = typeof row.name === "string" ? row.name.trim() : "";
    if (!id || !name || !isTerm(row.term)) continue;

    const slots: PlannerSemester["slots"] = [];
    const seenSlots = new Set<string>();
    if (Array.isArray(row.slots)) {
      for (const slot of row.slots) {
        if (!slot || typeof slot !== "object") continue;
        const s = slot as Record<string, unknown>;
        const slotId = typeof s.slotId === "string" ? s.slotId : "";
        const chosenId = typeof s.chosenId === "string" ? s.chosenId : "";
        if (!slotId || !chosenId || seenSlots.has(slotId)) continue;
        if (!courseMap[slotId] || !courseMap[chosenId]) continue;
        seenSlots.add(slotId);
        slots.push({
          slotId,
          chosenId,
          overridden: s.overridden === true,
        });
      }
    }

    semesters.push({ id, name, term: row.term, slots });
  }

  return semesters.length > 0 ? semesters : null;
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function parsePlan(data: Record<string, unknown>, track: DegreeTrack): PersistedPlan | null {
  const semesters = sanitizeSemesters(data.semesters, track);
  if (!semesters) return null;

  const activeRaw =
    typeof data.activeSemesterId === "string"
      ? data.activeSemesterId
      : semesters[0].id;
  const activeSemesterId = semesters.some((s) => s.id === activeRaw)
    ? activeRaw
    : semesters[0].id;

  const defaults = defaultPersistedPlan();

  return {
    version: STORAGE_VERSION,
    semesters,
    activeSemesterId,
    availableTerm: isTerm(data.availableTerm)
      ? data.availableTerm
      : defaults.availableTerm,
    plannerWidth: clampNumber(data.plannerWidth, 220, 560, defaults.plannerWidth),
    electivesHeight: clampNumber(
      data.electivesHeight,
      100,
      800,
      defaults.electivesHeight,
    ),
  };
}

function migrateLegacyCePlan(): PersistedPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const plan = parsePlan(parsed as Record<string, unknown>, "ce");
    if (plan) {
      window.localStorage.setItem(planKey("ce"), JSON.stringify(plan));
      window.localStorage.removeItem(LEGACY_KEY);
    }
    return plan;
  } catch {
    return null;
  }
}

export function loadActiveTrack(): DegreeTrack {
  if (typeof window === "undefined") return "ce";
  try {
    const raw = window.localStorage.getItem(TRACK_KEY);
    return isDegreeTrack(raw) ? raw : "ce";
  } catch {
    return "ce";
  }
}

export function saveActiveTrack(track: DegreeTrack): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TRACK_KEY, track);
  } catch {
    /* ignore */
  }
}

export function loadPersistedPlan(track: DegreeTrack): PersistedPlan | null {
  if (typeof window === "undefined") return null;

  try {
    let raw = window.localStorage.getItem(planKey(track));
    if (!raw && track === "ce") {
      const legacy = migrateLegacyCePlan();
      if (legacy) return legacy;
      raw = window.localStorage.getItem(planKey("ce"));
    }
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    return parsePlan(parsed as Record<string, unknown>, track);
  } catch {
    return null;
  }
}

export function savePersistedPlan(track: DegreeTrack, plan: PersistedPlan): void {
  if (typeof window === "undefined") return;

  try {
    const payload: PersistedPlan = {
      ...plan,
      version: STORAGE_VERSION,
    };
    window.localStorage.setItem(planKey(track), JSON.stringify(payload));
  } catch {
    /* quota exceeded or private mode */
  }
}
