# Technical Implementation Plan: Tarot of the Hours

## 1. Project Overview
**Project Name:** Tarot of the Hours (Interactive Divination)
**Platform:** Web Application (PWA capable, Mobile-First)
**Core Philosophy:** Flat, Mysterious, Elegant. Avoiding skeuomorphism in favor of symbolic minimalism.
**Language:** English

## 2. Design System & Visual Identity

### 2.1. Aesthetic Direction
Inspired by the "Secret Histories" minimalist UI and the reference project, the design will focus on **negative space, typography, and subtle motion**.

*   **Atmosphere:** "The library at midnight", "A quiet ritual", "Digital grimoire".
*   **Keywords:** Ethereal, Geometric, High-Contrast, Fluid.

### 2.2. Color Palette
*   **Backgrounds:**
    *   `Void Black` (#0a0a0a): Main background.
    *   `Deep Slate` (#1a1a1a): Card backs, modal backgrounds.
*   **Accents:**
    *   `Pale Gold` (#d4c4a8): Primary text, borders, active states.
    *   `Muted Crimson` (#8a2c2c): Highlights, "Grail" related elements, warnings.
    *   `Spectral Blue` (#4a5d75): Secondary accents, "Lantern" or "Winter" vibes.
    *   `Ghostly White` (#f0f0f0): High readability text (used sparingly).

### 2.3. Typography
*   **Headings (Serif):** *Cinzel* or *Cormorant Garamond*. Used for Hour names, titles, and major arcana designations.
*   **Body (Sans-Serif):** *Inter* or *Lato* (Light weights). Used for the LLM interpretation text to ensure readability on mobile.
*   **Monospace:** *JetBrains Mono* or *Space Mono*. Used for small UI elements like dates, coordinates, or "loading" cryptic text.

### 2.4. UI Elements
*   **Cards:**
    *   **Front:** The provided images from the `hours/` folder.
    *   **Back:** A flat, geometric pattern (e.g., the Sun-in-Splendour broken wheel or a Moth silhouette) in `Pale Gold` lines on `Deep Slate`.
    *   **Frame:** Thin, 1px gold borders. No heavy 3D bevels.
*   **Icons:**
    *   The `icons/` folder assets will be used as flat SVGs.
    *   They will appear as "stamps" or "watermarks" near the card interpretation.
*   **Input Fields:**
    *   Transparent background, bottom border only (underline style).
    *   Focus state triggers a slow glow effect.

---

## 3. Technical Architecture

### 3.1. Tech Stack
*   **Framework:** **Next.js 14+** (App Router).
    *   *Reason:* Excellent performance, server-side rendering for SEO (if needed), and easy API routes for LLM.
*   **Styling:** **Tailwind CSS**.
    *   *Reason:* Rapid development, easy to maintain consistency, great for responsive design.
*   **Animation:** **Framer Motion**.
    *   *Reason:* The industry standard for React animations. Essential for the "smooth, fluid" feel (card flips, page transitions, text streaming).
*   **State Management:** **Zustand**.
    *   *Reason:* Lightweight and simple for managing the "Deck State", "Selected Cards", and "User Query".
*   **AI Integration:** **Vercel AI SDK** (with OpenAI or compatible provider).
    *   *Reason:* Built-in support for streaming text responses (Typewriter effect).

### 3.2. Directory Structure
```
/app
  /components
    /ui          (Button, Input, Card)
    /ritual      (The specific divination stages)
  /lib
    /constants   (Hours data, Tarot mappings)
    /utils       (Animation variants)
  /public
    /hours       (Card images)
    /icons       (Aspect icons)
```

---

## 4. Detailed UX/UI Flow

### Phase 1: The Threshold (Landing)
*   **Visual:** A blank screen with a single, pulsing symbol (e.g., The Wood).
*   **Interaction:** Tap anywhere to begin.
*   **Animation:** The symbol dissolves into smoke/particles, revealing the title "TAROT OF THE HOURS".

### Phase 2: The Inscription (Input)
*   **Layout:** Centered input field.
*   **Text:** "What knowledge do you seek?" (Placeholder).
*   **Behavior:**
    *   User types question.
    *   "Consult" button fades in only after typing.
    *   On submit, the text blurs and moves to the top of the screen, becoming a persistent header.

### Phase 3: The Selection (Spread)
*   **Layout:**
    *   **Mobile:** A horizontal scrollable carousel of card backs.
    *   **Desktop:** A fan or grid of cards.
*   **Interaction:**
    *   User selects 1, 3, or 5 cards (depending on chosen spread).
    *   Selected cards float out of the deck and move to "slots" in the center.
*   **Animation:**
    *   *Hover:* Cards lift slightly ( `y: -10` ).
    *   *Select:* Card glides to position with a spring physics effect.

### Phase 4: The Revelation (Result)
*   **Transition:** The unselected cards fade into darkness. The selected cards remain.
*   **Reveal Sequence:**
    1.  User taps a card to reveal it.
    2.  **Flip Animation:** 3D rotation ( `rotateY: 180deg` ).
    3.  **Visuals:** The card image is shown. Below it, the Name (e.g., "The Moth") and the Aspect Icons (Moth, Wood) fade in.
    4.  **Interpretation:** The LLM response streams in below the card, letter by letter.

### Phase 5: The Interpretation (LLM Output)
*   **Prompt Engineering:**
    *   *Role:* "You are a scholar of the Invisible Arts."
    *   *Tone:* Cryptic, melancholic, yet insightful. Use metaphors from the game (The Mansus, The Wood, The Glory).
    *   *Structure:*
        *   **The Hour:** Brief description of the entity.
        *   **The Aspect:** What principle is at play (Lantern = Truth/Cruelty, Winter = Silence/End).
        *   **The Answer:** Direct answer to the user's query, wrapped in lore.

---

## 5. Data Schema (Hours)

We will create a `hours.json` or `ts` constant to map the files:

```typescript
type Hour = {
  id: number; // 0 to 39
  name: string; // e.g., "The Sun-in-Rags"
  tarotCard: string; // e.g., "Death"
  aspects: string[]; // ["Winter", "Lantern"]
  imagePath: string; // "/hours/12_sun_in_rags.png"
  keywords: string[]; // ["Endings", "Beauty in decay", "Cold light"]
  description: string; // Lore snippet
};
```

## 6. Animation Strategy (Framer Motion)

*   **Page Transitions:** `AnimatePresence` with `mode="wait"`. Pages fade out and blur (`opacity: 0, filter: blur(10px)`) while the new page fades in.
*   **Card Flip:**
    ```javascript
    <motion.div
      initial={false}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6, animationDirection: "normal" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Front and Back faces */}
    </motion.div>
    ```
*   **Text Streaming:** A custom hook to display text character by character, simulating a typewriter or a spirit writing.

## 7. Mobile Optimization
*   **Touch Targets:** All interactive elements (cards, buttons) must be at least 44x44px.
*   **Gestures:** Swipe to dismiss modals, tap to flip.
*   **Viewport:** Prevent zooming on input focus. Use `dvh` (dynamic viewport height) to handle mobile browser address bars correctly.

## 8. Next Steps
1.  **Initialize Project:** Set up Next.js + Tailwind.
2.  **Asset Import:** Move `hours` and `icons` to `public/`.
3.  **Component Build:** Create the `Card` component and `Spread` layout.
4.  **Logic:** Implement the random shuffle and selection logic.
5.  **AI:** Connect the API route.
