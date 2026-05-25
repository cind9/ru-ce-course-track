import type { Course } from "../types";
import { buildCourseCatalog, type CourseCatalog } from "./courseCatalog";
import { ceCourses } from "./ceCourses";
import { eeCourses } from "./eeCourses";
import {
  computerElectives,
  socOfferingsSnapshot,
  technicalElectives,
  type ElectiveOption,
  type SocTopicEntry,
} from "./electives";
import { electricalElectives, eeTechnicalElectives } from "./eeElectives";
import { getTopicSections, type SocCourse } from "../utils/fetchSoc";

export type DegreeTrack = "ce" | "ee";

export interface TrackElectivesConfig {
  panelTitle: string;
  deptLink: string;
  deptLinkLabel: string;
  groups: { title: string; items: ElectiveOption[] }[];
  topicsFromSnapshot: (
    term: "fall2025" | "spring2026" | "fall2026",
  ) => SocTopicEntry[];
  topicsFromLive: (liveCourses: SocCourse[]) => SocTopicEntry[];
}

export interface TrackDefinition {
  id: DegreeTrack;
  label: string;
  title: string;
  subtitle: string;
  flowchartRef: string;
  residencyRequired: number;
  courses: Course[];
  catalog: CourseCatalog;
  electives: TrackElectivesConfig;
}

const ceCatalog = buildCourseCatalog(ceCourses);
const eeCatalog = buildCourseCatalog(eeCourses);

export const TRACKS: Record<DegreeTrack, TrackDefinition> = {
  ce: {
    id: "ce",
    label: "CE",
    title: "Rutgers ECE Track",
    subtitle:
      "Computer Engineering (ECE) — 4-year flowchart with semester planning. Your plan saves automatically on this device.",
    flowchartRef:
      "https://ece.rutgers.edu/sites/default/files/2024-03/Computer-Engineering-Curriculum-Class-2023%2B.pdf",
    residencyRequired: 51,
    courses: ceCourses,
    catalog: ceCatalog,
    electives: {
      panelTitle: "CE electives",
      deptLink: "https://www.ece.rutgers.edu/computer-engineering-electives",
      deptLinkLabel: "ECE",
      groups: [
        { title: "Computer electives (pick 2)", items: computerElectives },
        { title: "Technical electives (pick 1)", items: technicalElectives },
      ],
      topicsFromSnapshot: (term) =>
        term === "fall2026"
          ? [...socOfferingsSnapshot.topicsFall2026]
          : term === "fall2025"
            ? [...socOfferingsSnapshot.topicsFall2025]
            : [...socOfferingsSnapshot.topicsSpring2026],
      topicsFromLive: (live) =>
        live
          .filter((c) =>
            ["435", "445", "446", "493", "494"].includes(c.courseNumber),
          )
          .flatMap((c) => getTopicSections(c)),
    },
  },
  ee: {
    id: "ee",
    label: "EE",
    title: "Rutgers ECE Track",
    subtitle:
      "Electrical Engineering (ECE) — 4-year flowchart with semester planning. Your plan saves automatically on this device.",
    flowchartRef:
      "https://ece.rutgers.edu/sites/default/files/2025-02/EE-Track-Flow-Chart-2-24-2025.jpg",
    residencyRequired: 51,
    courses: eeCourses,
    catalog: eeCatalog,
    electives: {
      panelTitle: "EE electives",
      deptLink: "https://www.ece.rutgers.edu/electrical-electives",
      deptLinkLabel: "ECE electrical electives",
      groups: [
        {
          title: "Electrical electives (pick 4 total; 1 restricted in junior fall)",
          items: electricalElectives,
        },
        { title: "Technical electives (pick 2)", items: eeTechnicalElectives },
      ],
      topicsFromSnapshot: (term) =>
        term === "fall2026"
          ? [...socOfferingsSnapshot.topicsFall2026]
          : term === "fall2025"
            ? [...socOfferingsSnapshot.topicsFall2025]
            : [...socOfferingsSnapshot.topicsSpring2026],
      topicsFromLive: (live) =>
        live
          .filter((c) =>
            ["435", "445", "446", "493", "494"].includes(c.courseNumber),
          )
          .flatMap((c) => getTopicSections(c)),
    },
  },
};

export const TRACK_ORDER: DegreeTrack[] = ["ce", "ee"];

export function getTrack(id: DegreeTrack): TrackDefinition {
  return TRACKS[id];
}
