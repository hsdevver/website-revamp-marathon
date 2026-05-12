# Website revamp marathon

Static HTML/CSS prototypes for the 2026 website sprint.

## Browse locally

Open `index.html` in the repo root for an overview of prototypes. The **Industry** prototype lives in `industry/`.

## Publish to GitHub (hsdevver)

GitHub CLI could not create the remote from this environment (token / auth). On your machine, after `gh auth login`:

```bash
cd website-revamp-marathon
git init
git add .
git commit -m "Add overview index and industry prototype"
gh repo create website-revamp-marathon --public --source=. --remote=origin --push
```

Or create an empty repo named `website-revamp-marathon` under **hsdevver** in the GitHub UI, then:

```bash
git remote add origin https://github.com/hsdevver/website-revamp-marathon.git
git push -u origin main
```

Replace `main` with your default branch if different.
