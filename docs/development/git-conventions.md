# Git Conventions
This is a rough guide on the git conventions this project uses.

## Commit Messages
This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit message formatting which
is enforced via [commitlint](https://commitlint.js.org) and [husky](https://typicode.github.io/husky).  

Commit messages should be structured as followed:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

When working on a package commits should be scoped to that package. Available package scopes are:
- `kangojs`
- `class-validation`
- `http-status-codes`
- `express-query-string`
- `express-common-middleware`

Available types are as follows:
- `build` - changes that affect the build system or external dependencies (npm, lerna etc)
- `chore` - minor changes that are not fixes, features or refactors
- `ci` - changes to continuous integration systems (GH actions etc)
- `docs` - changes to documentation only
- `feat` - a new feature
- `fix` - a bug fix
- `refactor` - a code refactor that doesn't add a new feature or fix an issue
- `revert` - a change that reverts previous work
- `style` - changes that only affect code style (linting fixes etc)
- `test` - changes to tests
- `release` - a special type used when doing a package release

When working on an issue this should be referenced in the footer, for example:

```
feat(kangojs): add x feature

more detail on commit...

Refs: #42
```

When making a breaking change (such as a change which affects the public api/interface) this should be
highlighted with `!` in the commit message or `BREAKING CHANGE` in the footer like so:

```
feat(class-validation)!: make x change

BREAKING CHANGE: more detail on change x
```

For more information and examples of conventional commits check [here](https://www.conventionalcommits.org/en/v1.0.0/#summary).

## Branch Naming
Although not enforced branch names should ideally follow a similar structure to the start
of commit messages and should include the issue number too where appropriate. 
For example:
```
<scope>/<type>/short-name
<scope>/<type>/GH-<ticket number>-short-name
```
Where `<scope>` and `<type>` match scopes and types used in commit messages.
