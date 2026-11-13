# Repository instructions

- Use pnpm for dependencies and scripts. Include the lockfile when dependencies change.
- Run `pnpm format`, `pnpm format:check`, and `pnpm build` before pushing frontend changes.
- Create topic branches from the latest `dev`. Use `feat/<topic>` for features, `fix/<topic>` for fixes, and `doc/<topic>` for documentation.
- After verification, merge the topic branch into `dev` and push `dev` to `origin`.
- The repository owner opens the pull request from `dev` to `main` and merges it.
- Use training images when testing the prototype. Keep capture data local until a review backend is implemented.
- Update README.md when setup commands change, ARCHITECTURE.md when data flow changes, and FEATURES.md when the available workflow changes.
