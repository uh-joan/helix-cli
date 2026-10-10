# Form layout

A single-column form of Material fields grouped into sections, with inline validation on blur, a required/optional convention, and a docked action bar — laid out with Helix spacing tokens. Status: **beta**.

**When to use** — collecting or editing structured input: a settings page, a create/edit form, a filter builder saved as a form.
**Avoid when** — a single search box or one inline control (use the control alone), or a long multi-step flow (use a Stepper).

## Shape

- **One column**, fields full-width, grouped under section headings.
- **Section spacing** `spacing-4`; field spacing `spacing-2`/`spacing-3`.
- **Labels** always present (`mat-label`); hints in `mat-hint`, errors in `mat-error`.
- **Action bar** at the end: Cancel, then the primary submit on the right.

## Rules

- **Single column** — faster to complete and scan; two fields on a row only when they're a genuine pair (start/end date), never below the `sm` breakpoint.
- **Typed reactive forms** — `FormGroup`/`FormControl` + `inject(FormBuilder)` and signals for derived view state; no `ngModel`/template-driven forms in new code.
- **Sections** — group related fields under a heading; full-width fields unless the data is intrinsically short (a year, a code).
- **Labels, not placeholders** — every field has a `mat-label`; placeholders are optional hints, never the label.
- **Validate on blur** — show validation when a field is touched or on submit, not on every keystroke; messages in `mat-error`.
- **Required convention** — pick one (mark required, or mark optional) and state it once; most Cortellis forms mark required.
- **Field variants** — use the shared variants instead of overriding MDC: `hlx-input-small` / `hlx-input-x-small` for density, and `hlx-field-borderless` for an inline-edit title or a toolbar search where a boxed field is too heavy (the outline appears on hover and focus). Don't hand-roll field chrome with `::ng-deep`.
- **Action bar** — primary submit on the right, Cancel to its left; disable submit while invalid or saving, show a busy state on save.

Avoid: hand-rolled field chrome via `::ng-deep`; multi-column forms that zig-zag; placeholder-as-label; errors on every keystroke; template-driven forms.

Uses: Text input, Select, Checkbox/Radio, Button, Divider.

Preview: live — the pattern's docs-site examples, rendered through the Storybook `Patterns/Form layout/Edit form`, `Patterns/Form layout/Borderless field variant` stories (generated from `packages/docs-website/src/app/pages/patterns`), with the real Angular components and the Helix theme. Interact with it; content is illustrative.
