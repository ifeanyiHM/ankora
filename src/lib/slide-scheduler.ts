export interface SlideTiming {
  /** How long each card holds a slide, by card position. Repeats if there are more cards than entries. */
  holds: number[];
  /** Each change also waits a random 0..jitterMs extra, so the rhythm never feels mechanical. */
  jitterMs: number;
  /** Minimum time between ANY two cards changing slide. Keep it above the crossfade length so two crossfades never overlap. */
  minGapMs: number;
  /** Extra delay on each card's first change (card position × this), so the row doesn't start in unison. */
  staggerMs: number;
}

/**
 * Plans slide changes for several cards that each have their own hold time, while guaranteeing
 * no two cards ever change within `minGapMs` of each other. Pure (no timers), so it's testable:
 * call peek() to learn which card changes next and when, then commit() once it has.
 * `active[i]` is false for cards with nothing to rotate; they're never scheduled.
 */
export function createSchedule(active: boolean[], timing: SlideTiming, rand: () => number = Math.random) {
  const hold = (card: number) => timing.holds[card % timing.holds.length];
  const due = active.map((isActive, i) => (isActive ? hold(i) + i * timing.staggerMs + rand() * timing.jitterMs : Infinity));
  let lastChange = -Infinity;

  return {
    /** The card that changes next and the time (ms since start) it will. `at` is Infinity if nothing is left to rotate. */
    peek(): { card: number; at: number } {
      let card = 0;
      for (let i = 1; i < due.length; i++) if (due[i] < due[card]) card = i;
      return { card, at: Math.max(due[card], lastChange + timing.minGapMs) };
    },
    /** Records that `card` changed at `at`, and schedules its next change. */
    commit(card: number, at: number): void {
      lastChange = at;
      due[card] = at + hold(card) + rand() * timing.jitterMs;
    },
  };
}
