# Footer

The product footer: copyright, legal links and any extra navigation.

`<footer hlx-footer>` from `@cdx/ngx-branding`, with optional `<hlx-footer-group>` + `[hlxFooterGroupTitle]` columns and `a[cdxFooterLink]` links.

| Input | Type | Default | |
|---|---|---|---|
| `branded` | boolean | `false` | Full Clarivate mark at left, copyright moves to the end |
| `slim` | boolean | `false` | 8px padding |
| `groupCompanyLinks` | boolean | `false` | Puts the legal links under a "Company" group |
| `shouldShowTranslations` | boolean | `false` | Uses `FOOTER.*` translation keys |
| `theme` | `ThemeOptionsBranding` | – | Overrides background and text colour |

- Three layouts: **Row** (default), **Logo row** (`branded`, only when the logo isn't in the header) and **Column** (link groups). See Foundations › Branding.
- Built-in links: Legal center, Privacy notice, Cookie policy, and Manage cookie preferences when OneTrust is ready.
- `spacing-3` × `spacing-4` padding, `border-secondary` top rule, `text-secondary` text; links 14/24 regular, copyright 14/24 semibold, columns 120–160px wide.

Consumer supplies: extra links or groups as content. Keep the legal links; don't restyle them.

Preview: live — the real Angular component with the shipped Helix theme, rendered from the Storybook stories in `packages/storybook/src/stories/footer.stories.ts` (`Branding/Footer`): **Row**, **Logo row**, **Column** and **Slim**, then the Playground with that story file's controls.
