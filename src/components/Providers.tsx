"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -80 } }}>
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
