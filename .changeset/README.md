# Changesets

Every PR that changes what apps get adds a changeset: run `npm run changeset`, pick the bump and describe the change for the app developer reading the changelog.

Merging to `main` opens a "Version packages" PR. Merging that one bumps the version, writes `CHANGELOG.md` and publishes to GitHub Packages.
