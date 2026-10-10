# DatePicker

A `mat-datepicker` on a `matInput` in a `mat-form-field`. Users type a date or pick one from the calendar pop-up.

- The calendar container uses `surface-primary` and `border-radius-default`.
- Requires a date adapter in the app (e.g. `provideNativeDateAdapter()`).

Consumer supplies: the field, adapter and any min/max/filter. Range pickers use the start/end inputs.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/date-picker.stories.ts` (`Components/Date picker`). The top example is its **Date Range** story; the Playground below has that story file's controls.
