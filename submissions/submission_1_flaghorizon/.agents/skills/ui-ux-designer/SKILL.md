---
name: ui-ux-designer
description: >-
  Use this skill when designing, styling, and polishing modern, high-converting web user interfaces.
  Covers typography, cohesive color palettes, dark/light modes, glassmorphism, micro-interactions,
  responsive layouts, accessibility (WCAG), and demo-winning visual aesthetics that wow hackathon judges.
---

# UI/UX Designer Skill

This skill guides the design, component architecture, and visual polish of web applications to ensure a jaw-dropping first impression, intuitive user experience, and high hackathon evaluation scores.

---

## 1. Hackathon UI/UX Principles: The "5-Second Wow Factor"

Hackathon judges spend an average of 2-3 minutes reviewing a project. The UI must instantly communicate **polish, utility, and innovation**.

1. **Anti-Generic Aesthetic**: Never use default browser styles or plain unstyled HTML. Avoid basic bootstrap looks or raw un-themed components.
2. **Cohesive Color Harmony**: Stick to a strictly defined palette (60-30-10 rule: 60% neutral background/surfaces, 30% secondary structure/cards, 10% high-energy accent/call-to-action).
3. **Intentional Hierarchy**: One primary heading (`h1`), clear subtitle, prominent action buttons, and structured information grouping.
4. **Delightful Micro-Interactions**: Hover lifts, smooth transitions (`150ms-250ms ease-out`), subtle glowing borders, and crisp loading skeletons.
5. **No Broken States**: Never display raw JSON error dumps, broken image icons, or unaligned text.

---

## 2. Design System Tokens & Color Palette

### Modern Curated Dark Theme (Recommended for Hackathons)
```css
:root {
  /* Surfaces & Backgrounds */
  --bg-primary: #0a0d14;       /* Deep obsidian / night */
  --bg-secondary: #121824;     /* Elevated panel surface */
  --bg-tertiary: #1b2333;      /* Interactive card surface */
  --bg-glass: rgba(18, 24, 36, 0.75); /* Frosted glass */

  /* Borders & Dividers */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-prominent: rgba(255, 255, 255, 0.16);
  --border-accent: rgba(99, 102, 241, 0.4);

  /* Typography */
  --text-primary: #f8fafc;     /* Crisp white */
  --text-secondary: #94a3b8;   /* Muted slate */
  --text-tertiary: #64748b;    /* Dim metadata */

  /* Accents & Brand */
  --accent-primary: #6366f1;   /* Electric Indigo */
  --accent-glow: #818cf8;      /* Neon highlight */
  --accent-secondary: #06b6d4; /* Vivid Cyan */
  --accent-success: #10b981;   /* Emerald Green */
  --accent-warning: #f59e0b;   /* Amber */
  --accent-danger: #ef4444;    /* Crimson */

  /* Shadows & Glassmorphism */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.25);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.25);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}
```

---

## 3. Typography Rules

* **Font Stack**: Use modern geometric or grotesque sans-serif typefaces (e.g., `Inter`, `Plus Jakarta Sans`, `Outfit`, or system `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`).
* **Scale**:
  * Hero Display: `2.5rem` to `3.5rem` (`bold` / `800`), gradient text clip.
  * Section Title: `1.75rem` to `2.25rem` (`600` / `700`).
  * Card Header: `1.125rem` to `1.25rem` (`600`).
  * Body: `0.9375rem` to `1rem` (`400` / `line-height: 1.6`).
  * Caption / Badge: `0.75rem` to `0.8125rem` (`500` / `uppercase` / `letter-spacing: 0.05em`).

---

## 4. High-Impact Component Patterns

### A. Frosted Glass Cards (Glassmorphism)
```css
.card-glass {
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.card-glass:hover {
  transform: translateY(-2px);
  border-color: var(--border-accent);
  box-shadow: var(--shadow-glow);
}
```

### B. High-Conversion Hero Action Buttons
```css
.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
  filter: brightness(1.08);
}
```

### C. Live Status Pill / Badge
```css
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}
```

---

## 5. Judge-Ready UX Polish Checklist

Before any hackathon milestone demo, verify:
- [ ] **First Screen Impact**: Hero section features a clear value proposition, active live demo preview, and instant interactive CTA.
- [ ] **Empty States**: If a list is empty, render a sleek illustration or icon + "Get Started by creating your first..." instead of blank space.
- [ ] **Loading States**: Use skeleton placeholders matching card dimensions, rather than a generic unstyled spinner.
- [ ] **Responsive Viewport**: Tested on both 1440px desktop and 390px mobile screens.
- [ ] **Accessibility Contrast**: Text meets WCAG AA contrast against backgrounds.
