/** Pinned foundations from Bubba's Brand Studio brand release 1.0.0. */
export const tokens = {
  brandVersion: '1.0.0',
  colors: {
    blue: '#007CE8',
    red: '#CC0000',
    redHover: '#A80000',
    navy: '#03256C',
    night: '#001845',
    ink: '#131B23',
    muted: '#526075',
    line: '#D9E8FB',
    white: '#FFFFFF',
    gold: '#FED766',
    disabled: '#F0F2F5',
    disabledText: '#6B727E',
  },
  spacing: { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48, 16: 64 },
  radius: { control: 4, panel: 12 },
  touchTarget: { minimum: 44, default: 48 },
} as const;

export type BubbaTokens = typeof tokens;
