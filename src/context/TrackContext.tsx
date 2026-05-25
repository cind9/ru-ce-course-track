import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { TrackDefinition } from "../data/tracks";
import { createPlannerUtils, type PlannerUtils } from "../utils/planner";

interface TrackContextValue {
  track: TrackDefinition;
  planner: PlannerUtils;
}

const TrackContext = createContext<TrackContextValue | null>(null);

export function TrackProvider({
  track,
  children,
}: {
  track: TrackDefinition;
  children: ReactNode;
}) {
  const planner = useMemo(
    () => createPlannerUtils(track.catalog, track.residencyRequired),
    [track],
  );

  return (
    <TrackContext.Provider value={{ track, planner }}>
      {children}
    </TrackContext.Provider>
  );
}

export function useTrackContext(): TrackContextValue {
  const ctx = useContext(TrackContext);
  if (!ctx) {
    throw new Error("useTrackContext must be used within TrackProvider");
  }
  return ctx;
}
