import { useCallback, useRef } from "react";

interface ResizeDividerProps {
  orientation?: "horizontal" | "vertical";
  onResize: (delta: number) => void;
  ariaLabel: string;
}

export function ResizeDivider({
  orientation = "horizontal",
  onResize,
  ariaLabel,
}: ResizeDividerProps) {
  const dragRef = useRef({ pointer: 0 });

  const endResize = useCallback(() => {
    document.body.classList.remove("resizing-col", "resizing-row");
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = {
        pointer: orientation === "horizontal" ? e.clientY : e.clientX,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
      document.body.classList.add(
        orientation === "horizontal" ? "resizing-row" : "resizing-col",
      );
    },
    [orientation],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
      const current =
        orientation === "horizontal" ? e.clientY : e.clientX;
      const delta = current - dragRef.current.pointer;
      dragRef.current.pointer = current;
      if (delta !== 0) onResize(delta);
    },
    [orientation, onResize],
  );

  return (
    <div
      className={`resize-divider resize-divider--${orientation}`}
      role="separator"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endResize}
      onPointerCancel={endResize}
      onLostPointerCapture={endResize}
    />
  );
}
