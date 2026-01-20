# AI DESIGN SYSTEM & UI RULES

## 🤖 ROLE & CRITICAL INSTRUCTIONS
You are an Expert Frontend Developer working on the "Content Planner" project.
Your goal is to implement UI strictly according to this Design System.

**CRITICAL RULES:**
1. **READ FIRST:** Before writing code, you MUST check this file for existing patterns.
2. **NO HARDCODING:** Do not use raw hex/rgb values if a Tailwind class or variable exists.
3. **NO REINVENTING:** Do not create new components if a `ui-kit` or `shared/components` alternative exists.
4. **CONSISTENCY:** If you see a task to "Fix UI", verify against these guidelines.

---

## 1. SCROLLBARS (Strict)
**Rule:** Any container requiring scrolling (lists, sidebars, tables, textareas) MUST use the global CSS class `.custom-scrollbar`.

**Usage:**
```tsx
// Correct
<div className="overflow-y-auto custom-scrollbar">
  {content}
</div>

// Incorrect
<div className="overflow-y-scroll"> // Missing styling
<div className="scrollbar-thin"> // Deprecated/Legacy
```

**Technical Definition (Reference only, defined in global CSS):**
- **Track:** Transparent
- **Thumb:** `#D1D5DB` (Tailwind `gray-300`)
- **Thumb Hover:** `#9CA3AF` (Tailwind `gray-400`)
- **Width/Height:** 6px (Thin)
- **Radius:** 3px (Fully rounded)

**Locations requiring this:**
- Project Sidebar
- Story Statistics Block
- Automation History
- Any horizontal scroll lists (e.g., Stories row)

---

## 2. BUTTONS (Standardized)
**Rule:** Use specific color semantic tags. Do not mix rounded sizes (default: `rounded-md`).

### Primary Action (Save / Confirm)
- **Style:** `bg-green-600 text-white hover:bg-green-700`
- **Size:** `px-4 py-2 text-sm font-medium`
- **Radius:** `rounded-md`

### Secondary Action (Cancel / Back)
- **Style:** `bg-gray-200 text-gray-800 hover:bg-gray-300`
- **Size:** `px-4 py-2 text-sm font-medium`
- **Radius:** `rounded-md`

### Interactive Elements / Toggles
- **Primary Brand Color:** `indigo-600` (Used for active states, links, focus rings)

---

## 3. TOGGLES & SWITCHES
**Rule:** Use this exact Tailwind structure for on/off switches (e.g., Active Status).

**Structure Code:**
```tsx
<button 
    className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${isActive ? 'bg-indigo-600' : 'bg-gray-300'}`}
    onClick={toggleAction}
>
    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
</button>
```

**Key Specs:**
- **Container:** `h-6 w-11` (Fixed size)
- **Knob:** `w-4 h-4` (White)
- **Animation:** `transition-colors` and `transition-transform`
- **Offsets:** `translate-x-1` (Off) -> `translate-x-6` (On)

---

## 4. COLORS & THEMING
