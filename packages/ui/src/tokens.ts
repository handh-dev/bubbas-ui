/** Generated from the pinned Brand Studio public-safe release. Run pnpm sync:foundations. */
export const tokens = {
  "brandVersion": "1.0.0",
  "systemVersion": "0.5.0",
  "foundationDigest": "6519085b9a56c315f7f2994f562ed6c0d7c0d260f05c687cd47f38020a37cd77",
  "sourceCommit": "31be2db4c6626f5a48d871d6a7a27bac8b7a04b9",
  "colors": {
    "blue": "#0866FF",
    "red": "#D40000",
    "redHover": "#A80000",
    "navy": "#03256C",
    "night": "#001845",
    "ink": "#131B23",
    "muted": "#526075",
    "line": "#D9E8FB",
    "white": "#FFFFFF",
    "gold": "#FED766",
    "disabled": "#F0F2F5",
    "disabledText": "#6B727E"
  },
  "spacing": {
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "6": 24,
    "8": 32,
    "12": 48,
    "16": 64
  },
  "radius": {
    "control": 4,
    "panel": 12
  },
  "touchTarget": {
    "minimum": 44,
    "default": 48
  },
  "layout": {
    "maxWidth": 1200,
    "readingWidth": 720,
    "gutters": [
      16,
      24,
      32
    ],
    "breakpoints": {
      "compact": 640,
      "wide": 960
    }
  },
  "motion": {
    "feedback": 140,
    "reducedMotion": "Disable transitions and nonessential animation."
  },
  "typography": {
    "display": {
      "family": "Eurostile Extd Black Italic, Arial Black, sans-serif",
      "sample": "COME TO BUBBAS.",
      "usage": "Short uppercase display lines at CSS weight 400, normal style, 1.15 line height and zero tracking. The supplied face contains the black italic design; disable font synthesis. No horizontal scaling.",
      "asset_id": "bubbas-font-eurostile-extd-black-italic",
      "redistribution_cleared": false
    },
    "body": {
      "family": "Montserrat, Arial, sans-serif",
      "sample": "Find your closest Bubba’s. Bring the crew.",
      "usage": "400–500 body; 600–700 labels and actions. Use the supplied OFL license.",
      "asset_id": "bubbas-font-montserrat",
      "redistribution_cleared": true
    }
  },
  "typeScale": [
    {
      "role": "Display",
      "mobile_px": 32,
      "desktop_px": 56,
      "line_height": 1.15,
      "weight": 400
    },
    {
      "role": "Page title",
      "mobile_px": 28,
      "desktop_px": 40,
      "line_height": 1.2,
      "weight": 700
    },
    {
      "role": "Section title",
      "mobile_px": 24,
      "desktop_px": 28,
      "line_height": 1.3,
      "weight": 700
    },
    {
      "role": "Body",
      "mobile_px": 16,
      "desktop_px": 18,
      "line_height": 1.6,
      "weight": 400
    },
    {
      "role": "Action / label",
      "mobile_px": 16,
      "desktop_px": 16,
      "line_height": 1.4,
      "weight": 700
    },
    {
      "role": "Supporting",
      "mobile_px": 14,
      "desktop_px": 14,
      "line_height": 1.5,
      "weight": 500
    }
  ],
  "colorRoles": {
    "brand-blue": "Official brand blue from the original logo ink. Brand fields, civic stripes and the bright endpoint of the campaign gradient; use white on-brand text.",
    "action": "Official brand red from the original logo ink. Primary actions and emphasis; white labels remain readable through the darker hover endpoint.",
    "action-hover": "Primary action hover and pressed feedback.",
    "heading": "Headings and underlined links on white; the deep endpoint of the campaign-blue artwork treatment.",
    "ink": "Body text and one-color artwork on light fields.",
    "muted": "Secondary information on white. Keep essential facts readable.",
    "line": "Decorative separators and subtle light-blue fields, not sole control boundaries.",
    "border": "Visible input and control boundaries on white.",
    "surface": "Default information surface and reverse text on dark fields.",
    "dark": "Neutral charcoal for night compositions, closing bands and dark information areas. Keep brand blue in artwork and campaign treatments.",
    "on-dark-muted": "Secondary text on the charcoal dark field. Use surface white for primary text and reverse artwork.",
    "accent": "Small gold accents with navy text; never the whole public-page theme.",
    "focus": "Navy focus outline with a white inner ring for dark surfaces.",
    "success": "Confirmed success with a text label, not stock or stand status inferred from hours.",
    "warning": "Attention or unavailable verification with explanatory text.",
    "error": "Validation and failure messages with a useful next step.",
    "on-brand": "White text on the official logo blue (4.82:1). Use opaque information surfaces for longer copy and check every gradient region behind text.",
    "surface-subtle": "Quiet preview wells and utility surfaces around expressive brand examples.",
    "border-subtle": "Decorative separators and panel outlines. Use the border token for meaningful control boundaries."
  },
  "effects": {
    "campaign-blue": "linear-gradient(120deg, #03256C 0%, #0866FF 100%)",
    "action-red": "linear-gradient(180deg, #D40000 0%, #A80000 100%)"
  },
  "shadows": {
    "action": "0 3px 8px #D4000024",
    "panel": "0 2px 12px #131B2308"
  },
  "opacity": {
    "overlay": {
      "light": 0.4,
      "dark": 0.6
    }
  },
  "recipes": {
    "web": {
      "version": "1.0.0",
      "description": "Framework-free section, content, campaign band and action layout; business facts remain app-owned.",
      "css": "/* Bubba web section recipes 1.0.0 — semantic HTML, no artwork or font binary. */\n.bubba-section { padding: clamp(32px, 6vw, 64px) max(16px, calc((100% - 1200px) / 2)); background: var(--bubba-ui-surface); color: var(--bubba-ui-text); font-family: var(--bubba-font-body); }\n.bubba-content { width: 100%; max-width: 720px; margin-inline: auto; overflow-wrap: anywhere; }\n.bubba-content > :first-child { margin-top: 0; }\n.bubba-content > :last-child { margin-bottom: 0; }\n.bubba-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 24px; }\n:where(.bubba-section, .bubba-campaign-header, .bubba-campaign-footer) .bubba-button:not(.bubba-button-primary):not(.bubba-button-secondary):not(.bubba-button-quiet) { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; max-width: 100%; box-sizing: border-box; padding: 12px 20px; border: 1px solid var(--bubba-ui-action-border); border-radius: var(--bubba-radius-control); background: var(--bubba-color-action); color: var(--bubba-ui-on-primary); font: 700 16px/1.4 var(--bubba-font-body); text-align: center; text-decoration: none; overflow-wrap: anywhere; cursor: pointer; }\n:where(.bubba-section, .bubba-campaign-header, .bubba-campaign-footer) .bubba-button:not(.bubba-button-primary):not(.bubba-button-secondary):not(.bubba-button-quiet):hover { background: var(--bubba-color-action-hover); color: #FFFFFF; }\n:where(.bubba-section, .bubba-campaign-header, .bubba-campaign-footer) .bubba-button:not(.bubba-button-primary):not(.bubba-button-secondary):not(.bubba-button-quiet):focus-visible { outline: 3px solid var(--bubba-ui-focus); outline-offset: 3px; box-shadow: 0 0 0 3px var(--bubba-ui-focus-inner); }\n:where(.bubba-section, .bubba-campaign-header, .bubba-campaign-footer) .bubba-button:not(.bubba-button-primary):not(.bubba-button-secondary):not(.bubba-button-quiet):disabled, :where(.bubba-section, .bubba-campaign-header, .bubba-campaign-footer) .bubba-button:not(.bubba-button-primary):not(.bubba-button-secondary):not(.bubba-button-quiet)[aria-disabled=\"true\"] { background: var(--bubba-ui-disabled-surface); color: var(--bubba-ui-disabled-text); border-color: var(--bubba-ui-border); cursor: not-allowed; }\n.bubba-campaign-header, .bubba-campaign-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px; padding: 24px max(16px, calc((100% - 1200px) / 2)); background: var(--bubba-ui-surface); color: var(--bubba-ui-text); font-family: var(--bubba-font-body); }\n.bubba-campaign-header img, .bubba-campaign-footer img { display: block; max-width: min(100%, 240px); height: auto; }\n.bubba-campaign-header nav, .bubba-campaign-footer nav { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }\n.bubba-campaign-header nav a, .bubba-campaign-footer nav a { display: inline-flex; align-items: center; min-height: 44px; }\n.bubba-campaign-header a:not(.bubba-button), .bubba-campaign-footer a:not(.bubba-button) { color: var(--bubba-ui-link); text-underline-offset: 4px; }\n:is(.bubba-section, .bubba-campaign-header, .bubba-campaign-footer)[data-bubba-composition=\"after-dark\"] { background: var(--bubba-color-dark); color: #FFFFFF; }\n:is(.bubba-section, .bubba-campaign-header, .bubba-campaign-footer)[data-bubba-composition=\"after-dark\"] a:not(.bubba-button) { color: #8DC7FF; }\n:is(.bubba-section, .bubba-campaign-header, .bubba-campaign-footer)[data-bubba-composition=\"after-dark\"] .bubba-button:focus-visible { outline-color: #FFFFFF; box-shadow: 0 0 0 3px #171717; }\n@media (prefers-reduced-motion: reduce) { .bubba-section *, .bubba-campaign-header *, .bubba-campaign-footer * { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }\n:is(.bubba-section, .bubba-campaign-header, .bubba-campaign-footer)[data-bubba-composition=\"after-dark\"] .bubba-button-quiet:not(:disabled):not([aria-disabled=\"true\"]) { color: #8DC7FF; }\n:is(.bubba-section, .bubba-campaign-header, .bubba-campaign-footer)[data-bubba-composition=\"after-dark\"] .bubba-button-quiet:hover:not(:disabled):not([aria-disabled=\"true\"]) { background: #303030; color: #B8DEFF; }\n"
    }
  },
  "contrastPairs": [
    {
      "foreground": "#FFFFFF",
      "background": "#D40000",
      "minimum": 4.5,
      "usage": "Primary action labels"
    },
    {
      "foreground": "#FFFFFF",
      "background": "#171717",
      "minimum": 4.5,
      "usage": "Dark-field primary text"
    },
    {
      "foreground": "#B4B4B4",
      "background": "#171717",
      "minimum": 4.5,
      "usage": "Dark-field secondary text"
    },
    {
      "foreground": "#FFFFFF",
      "background": "#03256C",
      "minimum": 4.5,
      "usage": "Navy fields"
    },
    {
      "foreground": "#131B23",
      "background": "#FFFFFF",
      "minimum": 4.5,
      "usage": "Body copy"
    },
    {
      "foreground": "#526075",
      "background": "#FFFFFF",
      "minimum": 4.5,
      "usage": "Secondary copy"
    },
    {
      "foreground": "#FFFFFF",
      "background": "#0866FF",
      "minimum": 4.5,
      "usage": "Small text on brand blue"
    },
    {
      "foreground": "#03256C",
      "background": "#FED766",
      "minimum": 4.5,
      "usage": "Gold accents"
    },
    {
      "foreground": "#637086",
      "background": "#FFFFFF",
      "minimum": 3,
      "usage": "Control boundaries"
    },
    {
      "foreground": "#FFFFFF",
      "background": "#0866FF",
      "minimum": 4.5,
      "usage": "White text on official logo blue"
    }
  ],
  "themeContrastPairs": [
    {
      "foreground": "text",
      "background": "canvas",
      "minimum": 4.5,
      "usage": "text text on canvas"
    },
    {
      "foreground": "heading",
      "background": "canvas",
      "minimum": 4.5,
      "usage": "heading text on canvas"
    },
    {
      "foreground": "muted",
      "background": "canvas",
      "minimum": 4.5,
      "usage": "muted text on canvas"
    },
    {
      "foreground": "link",
      "background": "canvas",
      "minimum": 4.5,
      "usage": "link text on canvas"
    },
    {
      "foreground": "link-hover",
      "background": "canvas",
      "minimum": 4.5,
      "usage": "link-hover text on canvas"
    },
    {
      "foreground": "accent",
      "background": "canvas",
      "minimum": 4.5,
      "usage": "accent text on canvas"
    },
    {
      "foreground": "border",
      "background": "canvas",
      "minimum": 3,
      "usage": "border boundary on canvas"
    },
    {
      "foreground": "focus",
      "background": "canvas",
      "minimum": 3,
      "usage": "focus boundary on canvas"
    },
    {
      "foreground": "text",
      "background": "surface",
      "minimum": 4.5,
      "usage": "text text on surface"
    },
    {
      "foreground": "heading",
      "background": "surface",
      "minimum": 4.5,
      "usage": "heading text on surface"
    },
    {
      "foreground": "muted",
      "background": "surface",
      "minimum": 4.5,
      "usage": "muted text on surface"
    },
    {
      "foreground": "link",
      "background": "surface",
      "minimum": 4.5,
      "usage": "link text on surface"
    },
    {
      "foreground": "link-hover",
      "background": "surface",
      "minimum": 4.5,
      "usage": "link-hover text on surface"
    },
    {
      "foreground": "accent",
      "background": "surface",
      "minimum": 4.5,
      "usage": "accent text on surface"
    },
    {
      "foreground": "border",
      "background": "surface",
      "minimum": 3,
      "usage": "border boundary on surface"
    },
    {
      "foreground": "focus",
      "background": "surface",
      "minimum": 3,
      "usage": "focus boundary on surface"
    },
    {
      "foreground": "text",
      "background": "raised",
      "minimum": 4.5,
      "usage": "text text on raised"
    },
    {
      "foreground": "heading",
      "background": "raised",
      "minimum": 4.5,
      "usage": "heading text on raised"
    },
    {
      "foreground": "muted",
      "background": "raised",
      "minimum": 4.5,
      "usage": "muted text on raised"
    },
    {
      "foreground": "link",
      "background": "raised",
      "minimum": 4.5,
      "usage": "link text on raised"
    },
    {
      "foreground": "link-hover",
      "background": "raised",
      "minimum": 4.5,
      "usage": "link-hover text on raised"
    },
    {
      "foreground": "accent",
      "background": "raised",
      "minimum": 4.5,
      "usage": "accent text on raised"
    },
    {
      "foreground": "border",
      "background": "raised",
      "minimum": 3,
      "usage": "border boundary on raised"
    },
    {
      "foreground": "focus",
      "background": "raised",
      "minimum": 3,
      "usage": "focus boundary on raised"
    },
    {
      "foreground": "text",
      "background": "hover",
      "minimum": 4.5,
      "usage": "text text on hover"
    },
    {
      "foreground": "heading",
      "background": "hover",
      "minimum": 4.5,
      "usage": "heading text on hover"
    },
    {
      "foreground": "muted",
      "background": "hover",
      "minimum": 4.5,
      "usage": "muted text on hover"
    },
    {
      "foreground": "link",
      "background": "hover",
      "minimum": 4.5,
      "usage": "link text on hover"
    },
    {
      "foreground": "link-hover",
      "background": "hover",
      "minimum": 4.5,
      "usage": "link-hover text on hover"
    },
    {
      "foreground": "accent",
      "background": "hover",
      "minimum": 4.5,
      "usage": "accent text on hover"
    },
    {
      "foreground": "border",
      "background": "hover",
      "minimum": 3,
      "usage": "border boundary on hover"
    },
    {
      "foreground": "focus",
      "background": "hover",
      "minimum": 3,
      "usage": "focus boundary on hover"
    },
    {
      "foreground": "text",
      "background": "selected",
      "minimum": 4.5,
      "usage": "text text on selected"
    },
    {
      "foreground": "heading",
      "background": "selected",
      "minimum": 4.5,
      "usage": "heading text on selected"
    },
    {
      "foreground": "muted",
      "background": "selected",
      "minimum": 4.5,
      "usage": "muted text on selected"
    },
    {
      "foreground": "link",
      "background": "selected",
      "minimum": 4.5,
      "usage": "link text on selected"
    },
    {
      "foreground": "link-hover",
      "background": "selected",
      "minimum": 4.5,
      "usage": "link-hover text on selected"
    },
    {
      "foreground": "accent",
      "background": "selected",
      "minimum": 4.5,
      "usage": "accent text on selected"
    },
    {
      "foreground": "border",
      "background": "selected",
      "minimum": 3,
      "usage": "border boundary on selected"
    },
    {
      "foreground": "focus",
      "background": "selected",
      "minimum": 3,
      "usage": "focus boundary on selected"
    },
    {
      "foreground": "info",
      "background": "info-surface",
      "minimum": 4.5,
      "usage": "info message text"
    },
    {
      "foreground": "info-border",
      "background": "info-surface",
      "minimum": 3,
      "usage": "info message boundary"
    },
    {
      "foreground": "info",
      "background": "surface",
      "minimum": 4.5,
      "usage": "info inline feedback"
    },
    {
      "foreground": "success",
      "background": "success-surface",
      "minimum": 4.5,
      "usage": "success message text"
    },
    {
      "foreground": "success-border",
      "background": "success-surface",
      "minimum": 3,
      "usage": "success message boundary"
    },
    {
      "foreground": "success",
      "background": "surface",
      "minimum": 4.5,
      "usage": "success inline feedback"
    },
    {
      "foreground": "warning",
      "background": "warning-surface",
      "minimum": 4.5,
      "usage": "warning message text"
    },
    {
      "foreground": "warning-border",
      "background": "warning-surface",
      "minimum": 3,
      "usage": "warning message boundary"
    },
    {
      "foreground": "warning",
      "background": "surface",
      "minimum": 4.5,
      "usage": "warning inline feedback"
    },
    {
      "foreground": "error",
      "background": "error-surface",
      "minimum": 4.5,
      "usage": "error message text"
    },
    {
      "foreground": "error-border",
      "background": "error-surface",
      "minimum": 3,
      "usage": "error message boundary"
    },
    {
      "foreground": "error",
      "background": "surface",
      "minimum": 4.5,
      "usage": "error inline feedback"
    },
    {
      "foreground": "action-border",
      "background": "surface",
      "minimum": 3,
      "usage": "Primary action edge on surface"
    },
    {
      "foreground": "action-border",
      "background": "raised",
      "minimum": 3,
      "usage": "Primary action edge on raised"
    },
    {
      "foreground": "disabled-text",
      "background": "disabled-surface",
      "minimum": 3,
      "usage": "Inactive control label (contrast-exempt; retain readable dedicated paint)"
    },
    {
      "foreground": "code-text",
      "background": "code-surface",
      "minimum": 4.5,
      "usage": "Code content"
    },
    {
      "foreground": "code-muted",
      "background": "code-surface",
      "minimum": 4.5,
      "usage": "Code metadata"
    },
    {
      "foreground": "selection-text",
      "background": "selection",
      "minimum": 4.5,
      "usage": "Selected text"
    },
    {
      "foreground": "scrollbar",
      "background": "scrollbar-track",
      "minimum": 3,
      "usage": "Visible scrollbar thumb"
    }
  ],
  "themes": {
    "light": {
      "canvas": "#F7F8FA",
      "surface": "#FFFFFF",
      "raised": "#FFFFFF",
      "hover": "#F6F7F9",
      "selected": "#ECEEF1",
      "text": "#131B23",
      "heading": "#03256C",
      "muted": "#526075",
      "line": "#E4E6EA",
      "border": "#637086",
      "link": "#03256C",
      "link-hover": "#A80000",
      "focus": "#03256C",
      "focus-inner": "#FFFFFF",
      "accent": "#D40000",
      "action-text": "#FFFFFF",
      "action-border": "#A80000",
      "disabled-surface": "#F0F2F5",
      "disabled-text": "#6B727E",
      "info": "#03256C",
      "info-surface": "#F1F5FC",
      "info-border": "#03256C",
      "success": "#23633F",
      "success-surface": "#EAF5EF",
      "success-border": "#23633F",
      "warning": "#805500",
      "warning-surface": "#FFF4D6",
      "warning-border": "#805500",
      "error": "#B42318",
      "error-surface": "#FFF0EF",
      "error-border": "#B42318",
      "code-surface": "#171717",
      "code-text": "#FFFFFF",
      "code-muted": "#B4B4B4",
      "selection": "#D9E8FB",
      "selection-text": "#131B23",
      "scrollbar": "#637086",
      "scrollbar-track": "#F7F8FA",
      "shadow-action": "0 3px 8px #D4000024",
      "shadow-panel": "0 2px 12px #131B2308",
      "shadow-dialog": "0 20px 100px #00133345",
      "content": "#131B23",
      "primary": "#D40000",
      "primary-hover": "#A80000",
      "on-primary": "#FFFFFF",
      "overlay": "#001333"
    },
    "dark": {
      "canvas": "#171717",
      "surface": "#202020",
      "raised": "#292929",
      "hover": "#303030",
      "selected": "#383838",
      "text": "#FFFFFF",
      "heading": "#FFFFFF",
      "muted": "#B4B4B4",
      "line": "#3D3D3D",
      "border": "#858585",
      "link": "#8DC7FF",
      "link-hover": "#B8DEFF",
      "focus": "#FFFFFF",
      "focus-inner": "#202020",
      "accent": "#FF9F99",
      "action-text": "#FFFFFF",
      "action-border": "#EF817A",
      "disabled-surface": "#242424",
      "disabled-text": "#9A9A9A",
      "info": "#8DC7FF",
      "info-surface": "#1D2D3D",
      "info-border": "#8DC7FF",
      "success": "#8DDBA9",
      "success-surface": "#183323",
      "success-border": "#8DDBA9",
      "warning": "#FED766",
      "warning-surface": "#3A2E12",
      "warning-border": "#FED766",
      "error": "#FFAEA8",
      "error-surface": "#3D2020",
      "error-border": "#FFAEA8",
      "code-surface": "#171717",
      "code-text": "#FFFFFF",
      "code-muted": "#B4B4B4",
      "selection": "#383838",
      "selection-text": "#FFFFFF",
      "scrollbar": "#858585",
      "scrollbar-track": "#171717",
      "shadow-action": "0 3px 8px #00000040",
      "shadow-panel": "0 2px 12px #00000020",
      "shadow-dialog": "0 20px 100px #00000080",
      "content": "#FFFFFF",
      "primary": "#D40000",
      "primary-hover": "#A80000",
      "on-primary": "#FFFFFF",
      "overlay": "#000000"
    }
  }
} as const;

export type BubbaTokens = typeof tokens;
