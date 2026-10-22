# Changesets

Every pull request that changes a published package (`packages/*`) adds a
changeset describing the change and its semver bump:

```bash
pnpm changeset
```

On `main`, the **Release** workflow collects pending changesets into a
"Version packages" pull request. Merging that pull request publishes the bumped
`@ux-sting/*` packages and the `ux-sting` CLI to npm (needs the `NPM_TOKEN`
repository secret). Apps and examples are private and never published.
