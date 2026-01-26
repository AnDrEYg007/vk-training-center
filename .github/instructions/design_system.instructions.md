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

## 4. TABS / SECTION NAVIGATION (Strict)
**Rule:** All internal section/tab navigation (main tabs, sub-tabs, nested navigation) MUST use the unified **underline tab style** with `border-b-2`. Do NOT create alternative tab styles (rounded tabs, pill buttons, etc.).

**Standard Tab Class Function:**
```tsx
const tabClass = (tabName: string) => `py-2 px-2 text-sm font-medium border-b-2 transition-colors ${
    activeTab === tabName 
        ? 'border-indigo-600 text-indigo-600' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
}`;
```

**Container Structure:**
```tsx
<div className="px-4 pt-2 bg-white border-b border-gray-200">
    <div className="flex gap-4">
        <button onClick={() => setActiveTab('tab1')} className={tabClass('tab1')}>Tab 1</button>
        <button onClick={() => setActiveTab('tab2')} className={tabClass('tab2')}>Tab 2</button>
    </div>
</div>
```

**Key Specs:**
- **Active state:** `border-indigo-600 text-indigo-600` (indigo underline + text)
- **Inactive state:** `border-transparent text-gray-500`
- **Hover:** `hover:text-gray-700 hover:border-gray-300`
- **Spacing:** `gap-4` between tabs, `px-2 py-2` padding on each tab
- **Font:** `text-sm font-medium`

**This applies to:**
- Main page tabs (Settings, User Management, etc.)
- Sub-section tabs (Logs -> Callback API / Tokens)
- Any nested logical section switchers

---

## 5. COLORS & THEMING

---

## 5. NOTIFICATIONS & CONFIRMATIONS
**Rule:** NEVER use native browser methods: `alert()`, `confirm()`, or `prompt()`. These are strictly prohibited for UX consistency.

### Feedback Notifications (Toasts)
- **Position:** Bottom-right corner.
- **Behavior:** Automatically disappear after a few seconds or when clicked.
- **Implementation:** Use the global `showAppToast(message, type)` bridge.
- **Purpose:** Non-blocking feedback like "Saved", "Copied", or background errors.

### Confirmation Modals
- **Rule:** Use a modal window for actions requiring explicit user consent (e.g., deletions, destructive edits).
- **Z-Index:** Must appear above all other elements with a darkened backdrop (`bg-black/50`).
- **Interactive Elements:**
    - **Confirm:** Primary button (Green) or Danger button (Red).
    - **Cancel:** Secondary button (Gray).
- **Dismissal:** Must be closeable via the "Cancel" button or clicking outside if safe.
