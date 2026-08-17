# Contributing

This repository uses `main` as the stable production branch. Development work
should happen on a task branch and be merged through a pull request.

## Local setup

Requirements:

- Git
- Node.js 22.13 or newer

```bash
git clone https://github.com/joaoduenas17/schettini-floor-solutions.git
cd schettini-floor-solutions
npm ci
npm run dev:netlify
```

The local site will be available at the address printed by Next.js, normally
`http://localhost:3000`.

## Branch workflow

Start every task from an updated `main` branch:

```bash
git switch main
git pull
git switch -c feature/project-gallery
```

Commit only the files related to that task, push the branch, and open a pull
request into `main`:

```bash
git add <files>
git commit -m "Build project gallery"
git push -u origin feature/project-gallery
```

Review the Netlify Deploy Preview before merging. Do not push unfinished work
directly to `main`.

## Project images

- Store portfolio images under `public/images/projects/`.
- Use descriptive kebab-case filenames, for example
  `industrial-polished-concrete-01.webp`.
- Use only Schettini Floor Solutions project photography approved for the site.
- Do not publish street addresses or other private client information.
- Keep project categories aligned with the site: `Coatings`,
  `Polished Concrete`, and `Toppings & Overlays`.

Do not commit `.env` files, `node_modules`, `.next`, or other local build output.
