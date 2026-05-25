import { useEffect, useState } from "react";
import { useAutoHideScrollbar } from "../hooks/useAutoHideScrollbar";
import { useTrackContext } from "../context/TrackContext";
import {
  socOfferingsSnapshot,
  type ElectiveOption,
  type SocTopicEntry,
} from "../data/electives";
import { fetchEce332Offerings, type SocCourse } from "../utils/fetchSoc";

type SocTerm = "fall2025" | "spring2026" | "fall2026" | "live";

const SOC_SNAPSHOT_CODES: Record<Exclude<SocTerm, "live">, readonly string[]> = {
  fall2025: socOfferingsSnapshot.fall2025,
  spring2026: socOfferingsSnapshot.spring2026,
  fall2026: socOfferingsSnapshot.fall2026,
};

function matchesSoc(code: string, term: SocTerm, live?: SocCourse[]): boolean {
  if (term === "live") {
    return live?.some((c) => c.courseString === code) ?? false;
  }
  return SOC_SNAPSHOT_CODES[term].includes(code);
}

function ElectiveGroup({
  title,
  items,
  socTerm,
  liveCourses,
}: {
  title: string;
  items: ElectiveOption[];
  socTerm: SocTerm;
  liveCourses?: SocCourse[];
}) {
  const offered = items.filter((e) => matchesSoc(e.code, socTerm, liveCourses));
  const notScheduled = items.filter(
    (e) => !matchesSoc(e.code, socTerm, liveCourses),
  );

  return (
    <div className="elective-group">
      <h4>{title}</h4>
      {offered.length > 0 && (
        <>
          <p className="elective-subhead">Scheduled this term ({offered.length})</p>
          <ul className="elective-list">
            {offered.map((e) => (
              <li key={e.id}>
                <strong className="elective-course-title">{e.title}</strong>
                <span className="elective-course-meta">
                  {e.code} · {e.credits} credits
                  {e.offered && e.offered !== "both" && (
                    <span className="term-tag"> · typical {e.offered}</span>
                  )}
                  {e.note && <span className="elective-note"> · {e.note}</span>}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
      {socTerm !== "live" && notScheduled.length > 0 && (
        <details className="elective-details">
          <summary>Other approved electives ({notScheduled.length})</summary>
          <ul className="elective-list muted">
            {notScheduled.map((e) => (
              <li key={e.id}>
                <strong className="elective-course-title">{e.title}</strong>
                <span className="elective-course-meta">
                  {e.code} · {e.credits} credits
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export function ElectivesPanel() {
  const { track } = useTrackContext();
  const electivesConfig = track.electives;

  const [socTerm, setSocTerm] = useState<SocTerm>("fall2026");
  const [liveCourses, setLiveCourses] = useState<SocCourse[] | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const electivesScrollRef = useAutoHideScrollbar<HTMLDivElement>();

  useEffect(() => {
    if (socTerm !== "live") {
      setLiveCourses(null);
      return;
    }
    setLiveLoading(true);
    setLiveError(null);
    fetchEce332Offerings(2026, 1)
      .then(setLiveCourses)
      .catch((e) =>
        setLiveError(
          e instanceof Error ? e.message : "Could not load live SOC data",
        ),
      )
      .finally(() => setLiveLoading(false));
  }, [socTerm]);

  const topics: SocTopicEntry[] =
    socTerm === "live"
      ? electivesConfig.topicsFromLive(liveCourses ?? [])
      : electivesConfig.topicsFromSnapshot(socTerm);

  return (
    <section className="electives-panel">
      <div className="electives-panel-toolbar">
        <div className="electives-panel-header">
          <h3>{electivesConfig.panelTitle}</h3>
        </div>
        <p className="elective-intro">
          Approved lists from{" "}
          <a
            href={electivesConfig.deptLink}
            target="_blank"
            rel="noreferrer"
          >
            {electivesConfig.deptLinkLabel}
          </a>
          . Offerings from{" "}
          <a
            href="https://classes.rutgers.edu/soc/#home"
            target="_blank"
            rel="noreferrer"
          >
            Rutgers SOC
          </a>
          .
        </p>

        <label className="term-filter">
          SOC term:
          <select
            value={socTerm}
            onChange={(e) => setSocTerm(e.target.value as SocTerm)}
          >
            <option value="fall2026">Fall 2026 (snapshot)</option>
            <option value="spring2026">Spring 2026 (snapshot)</option>
            <option value="fall2025">Fall 2025 (snapshot)</option>
            <option value="live">Live — Spring 2026</option>
          </select>
        </label>

        {liveLoading && <p className="empty-hint">Loading SOC…</p>}
        {liveError && <p className="elective-error">{liveError}</p>}
      </div>

      <div
        ref={electivesScrollRef}
        className="electives-panel-scroll auto-hide-scrollbar"
      >
        {electivesConfig.groups.map((group) => (
          <ElectiveGroup
            key={group.title}
            title={group.title}
            items={group.items}
            socTerm={socTerm}
            liveCourses={liveCourses ?? undefined}
          />
        ))}

        {topics.length > 0 && (
          <div className="elective-group">
            <h4>Topics sections (435/445/446/493/494)</h4>
            <ul className="elective-list">
              {topics.map((t, i) => (
                <li key={`${t.code}-${i}`}>
                  <strong className="elective-course-title">{t.topic}</strong>
                  <span className="elective-course-meta">
                    {t.code}
                    {t.seniorOnly && (
                      <span className="elective-senior-tag"> · Senior only</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
