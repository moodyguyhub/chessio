# Chessio UI Components

Simplified primitives inspired by Tailwind Plus Catalyst. No external dependencies beyond React and Tailwind CSS.

## Usage

```tsx
import { Button, Input, Card, Badge, Dialog } from "@/components/ui";
```

---

## Button

```tsx
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary"` \| `"secondary"` \| `"outline"` \| `"ghost"` \| `"danger"` | `"primary"` | Visual style |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Button size |
| `fullWidth` | `boolean` | `false` | Full width button |
| `loading` | `boolean` | `false` | Shows spinner, disables button |
| `disabled` | `boolean` | `false` | Disabled state |

---

## Input

```tsx
<Input 
  label="Email"
  type="email"
  placeholder="you@example.com"
  error="Invalid email address"
  helperText="We'll never share your email"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text above input |
| `error` | `string` | — | Error message (turns border red) |
| `helperText` | `string` | — | Helper text below input |
| `fullWidth` | `boolean` | `true` | Full width input |

Plus all standard `<input>` props.

---

## Card

```tsx
<Card hoverable>
  <CardHeader title="Lesson 1" description="Learn the basics" />
  <CardContent>
    {/* Content here */}
  </CardContent>
  <CardFooter>
    <Button>Start Lesson</Button>
  </CardFooter>
</Card>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `noPadding` | `boolean` | `false` | Remove default padding |
| `hoverable` | `boolean` | `false` | Add hover shadow effect |

### Subcomponents

- `CardHeader` — `title` and `description` props
- `CardContent` — Main content area
- `CardFooter` — Actions/buttons area

---

## Badge

```tsx
<Badge color="emerald" size="sm">Completed</Badge>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `"gray"` \| `"emerald"` \| `"amber"` \| `"red"` \| `"blue"` \| `"purple"` | `"gray"` | Badge color |
| `size` | `"sm"` \| `"md"` | `"sm"` | Badge size |

---

## Dialog

```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onClose={() => setOpen(false)} size="md">
  <DialogHeader>
    <DialogTitle>Confirm Action</DialogTitle>
    <DialogDescription>Are you sure you want to continue?</DialogDescription>
  </DialogHeader>
  <DialogContent>
    {/* Additional content */}
  </DialogContent>
  <DialogFooter>
    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </DialogFooter>
</Dialog>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Whether dialog is visible |
| `onClose` | `() => void` | — | Called when dialog should close |
| `size` | `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | `"md"` | Dialog width |

### Subcomponents

- `DialogHeader` — Container for title/description
- `DialogTitle` — Heading text
- `DialogDescription` — Subtext
- `DialogContent` — Main content area
- `DialogFooter` — Actions (buttons)

---

## Design Tokens

These components use Chessio's color palette:

- **Primary**: `emerald-600` (buttons, focus rings)
- **Text**: `slate-900` (headings), `slate-700` (body), `slate-500` (muted)
- **Borders**: `slate-200` (cards), `slate-300` (inputs)
- **Backgrounds**: `white` (cards), `slate-50` (hover states)
- **Error**: `red-600` (text), `red-100` (badges)
- **Success**: `emerald-600` (text), `emerald-100` (badges)
