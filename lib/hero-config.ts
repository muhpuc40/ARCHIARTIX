/**
 * Home hero timing — edit these numbers to change the rhythm.
 *   animated hero  (animatedSeconds)  →  image 1 … image N (slideSeconds each)  →  animated hero again → repeat
 */
export const HERO_TIMING = {
  /** How long the animated hero is shown before the images start, and again after the last image. */
  animatedSeconds: 20,
  /** How long each admin-uploaded image stays on screen. */
  slideSeconds: 10,
} as const;
