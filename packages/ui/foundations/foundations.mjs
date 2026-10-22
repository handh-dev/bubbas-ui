// Generated from Brand Studio foundations; do not edit.
/** @typedef {"light" | "dark"} BubbaAppearance */
/** @typedef {"canvas" | "surface" | "raised" | "hover" | "selected" | "text" | "heading" | "muted" | "line" | "border" | "link" | "link-hover" | "focus" | "focus-inner" | "accent" | "action-text" | "action-border" | "disabled-surface" | "disabled-text" | "info" | "info-surface" | "info-border" | "success" | "success-surface" | "success-border" | "warning" | "warning-surface" | "warning-border" | "error" | "error-surface" | "error-border" | "code-surface" | "code-text" | "code-muted" | "selection" | "selection-text" | "scrollbar" | "scrollbar-track" | "shadow-action" | "shadow-panel" | "shadow-dialog" | "content" | "primary" | "primary-hover" | "on-primary" | "overlay"} BubbaRole */
export const foundations = {
  "name": "bubbas",
  "version": "0.4.0",
  "status": "release candidate",
  "brand_release": "1.0.0",
  "reviewed_at": "2026-10-22",
  "source": "tokens/brand.tokens.json",
  "colors": {
    "brand-blue": "#007CE8",
    "action": "#CC0000",
    "action-hover": "#A80000",
    "heading": "#03256C",
    "ink": "#131B23",
    "muted": "#526075",
    "line": "#D9E8FB",
    "border": "#637086",
    "surface": "#FFFFFF",
    "dark": "#171717",
    "on-dark-muted": "#B4B4B4",
    "accent": "#FED766",
    "focus": "#03256C",
    "success": "#23633F",
    "warning": "#805500",
    "error": "#B42318",
    "on-brand": "#000000",
    "surface-subtle": "#F6F7F9",
    "border-subtle": "#E4E6EA"
  },
  "color_roles": {
    "brand-blue": "Brand fields, civic stripes and the bright endpoint of the campaign gradient. Small text uses black or a white/charcoal information surface.",
    "action": "Decisive red primary actions. The red depth recipe uses this accessible starting color and the darker action-hover endpoint.",
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
    "on-brand": "Black text for small information directly on brand blue (5.05:1). Prefer white information panels for longer copy.",
    "surface-subtle": "Quiet preview wells and utility surfaces around expressive brand examples.",
    "border-subtle": "Decorative separators and panel outlines. Use the border token for meaningful control boundaries."
  },
  "logo_inks": {
    "blue": "#0866FF",
    "red": "#D40000",
    "white": "#FFFFFF",
    "border": "#000000"
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
  "type_scale": [
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
  "radii": {
    "control": 4,
    "panel": 12
  },
  "layout": {
    "max_width": 1200,
    "reading_width": 720,
    "gutters": [
      16,
      24,
      32
    ],
    "breakpoints": [
      640,
      960
    ]
  },
  "motion": {
    "feedback_ms": 140,
    "reduced_motion": "Disable transitions and nonessential animation.",
    "enter_ms": 180,
    "exit_ms": 140,
    "easing": "cubic-bezier(0.2, 0, 0, 1)",
    "reduced_motion_ms": 0
  },
  "targets": {
    "default_px": 48,
    "minimum_px": 44
  },
  "contrast_pairs": [
    {
      "foreground": "#FFFFFF",
      "background": "#CC0000",
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
      "foreground": "#000000",
      "background": "#007CE8",
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
      "background": "#007CE8",
      "minimum": 3,
      "usage": "Large display only: 24px regular or 19px bold minimum"
    }
  ],
  "effects": {
    "campaign-blue": "linear-gradient(120deg, #03256C 0%, #007CE8 100%)",
    "action-red": "linear-gradient(180deg, #CC0000 0%, #A80000 100%)"
  },
  "shadows": {
    "action": "0 3px 8px #CC000024",
    "panel": "0 2px 12px #131B2308"
  },
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
      "accent": "#CC0000",
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
      "shadow-action": "0 3px 8px #CC000024",
      "shadow-panel": "0 2px 12px #131B2308",
      "shadow-dialog": "0 20px 100px #00133345",
      "content": "#131B23",
      "primary": "#CC0000",
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
      "primary": "#CC0000",
      "primary-hover": "#A80000",
      "on-primary": "#FFFFFF",
      "overlay": "#000000"
    }
  },
  "theme_contrast_pairs": [
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
  "schema_version": 1,
  "role_types": {
    "canvas": "color",
    "surface": "color",
    "raised": "color",
    "hover": "color",
    "selected": "color",
    "text": "color",
    "heading": "color",
    "muted": "color",
    "line": "color",
    "border": "color",
    "link": "color",
    "link-hover": "color",
    "focus": "color",
    "focus-inner": "color",
    "accent": "color",
    "action-text": "color",
    "action-border": "color",
    "disabled-surface": "color",
    "disabled-text": "color",
    "info": "color",
    "info-surface": "color",
    "info-border": "color",
    "success": "color",
    "success-surface": "color",
    "success-border": "color",
    "warning": "color",
    "warning-surface": "color",
    "warning-border": "color",
    "error": "color",
    "error-surface": "color",
    "error-border": "color",
    "code-surface": "color",
    "code-text": "color",
    "code-muted": "color",
    "selection": "color",
    "selection-text": "color",
    "scrollbar": "color",
    "scrollbar-track": "color",
    "shadow-action": "shadow",
    "shadow-panel": "shadow",
    "shadow-dialog": "shadow",
    "content": "color",
    "primary": "color",
    "primary-hover": "color",
    "on-primary": "color",
    "overlay": "color"
  },
  "focus": {
    "width_px": 3,
    "offset_px": 3,
    "minimum_contrast": 3,
    "strategy": "Visible outer outline plus background separator; restore focus to the invoking control after overlays close."
  },
  "composition": {
    "public": "Expressive approved artwork, short display copy, one clear action and readable facts.",
    "operations": "Calm surfaces, compact information, stable navigation and labeled business states.",
    "marketing_appearance": "A campaign may declare fixed Light or After dark independently of application appearance."
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
  }
};
export const systemVersion = foundations.version;
export const themes = foundations.themes;
export default foundations;
