/** Owner-selected campaign presentation. Caller facts and preview widths stay outside UI. */
export const FOCUS_MARQUEE_CAMPAIGN_PRESET = Object.freeze({
  motion: 'spring',
  direction: 'left',
  timing: Object.freeze({ hold: 1.1, exit: .25, enter: .25, settle: .04 }),
  springTuning: Object.freeze({ stretch: .06, squash: .03, overshoot: 4, popLift: 3, nudge: 4 }),
  edgeBlur: 1.5,
  edgeBlurStart: .75,
  spacing: 1,
  centerEmphasis: Object.freeze({ scale: 1.16, lift: 4, range: .5 }),
  badgeAppearance: Object.freeze({ size: 'md', shape: 'rounded', textTone: 'navy' }),
  speed: 38,
});
