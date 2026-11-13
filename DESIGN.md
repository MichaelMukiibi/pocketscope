# Design

PocketScope is a mobile-first throat capture prototype for health workers. The landing page introduces the workflow, and the capture demo lets visitors try it with a training image.

## Screens

| Route      | Purpose                                                          | Primary action                          |
| ---------- | ---------------------------------------------------------------- | --------------------------------------- |
| `/`        | Explain what PocketScope does and how the demo works.            | Try the capture demo                    |
| `/capture` | Take or select an image, check the preview, and save it locally. | Save capture after an image is selected |

On narrow screens, stack the landing page content and place the capture checklist below the preview. On wider screens, keep the checklist alongside the preview. Keep saved captures below the capture area.

## Visual style

Use the Tailwind theme in [frontend/src/style.css](frontend/src/style.css) for shared tokens. The landing page styles live in [frontend/src/landing.css](frontend/src/landing.css).

| Role                        | Color     |
| --------------------------- | --------- |
| Primary actions and accents | `#126653` |
| Main text                   | `#152c28` |
| Secondary text              | `#4e6862` |
| Borders and dividers        | `#d6e4df` |
| Image preview background    | `#eaf3ef` |
| Page background             | `#f4f8f7` |

Use Inter with a system sans-serif fallback. Pair Lucide icons with visible action labels, and give icon-only controls an accessible name. Keep interactive controls keyboard-accessible with a visible focus state.

## Capture feedback

- Show the selected image before saving and let the user retake it or choose another file.
- Ask the user to check that both tonsillar areas, the soft palate, and the uvula are visible, well lit, and in focus.
- Pair connection indicators with text. Show save confirmation and error messages next to the relevant action.
- Use wording that reflects the current prototype. Image review is manual, and saved captures stay in the current browser.
