# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Vercel Deployment Instructions

## Requirements
- Ensure `tailwind.config.js` and `postcss.config.js` are present and valid.
- Static assets should be in the `public` folder.
- Use Vite build scripts: `npm run build`.

## Deploy Steps
1. Push your frontend code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com/) and import your repo.
3. Set build command to `npm run build` and output directory to `dist`.
4. Environment variables (if any) should be set in Vercel dashboard.

## Troubleshooting
- If TailwindCSS styles are missing, check `tailwind.config.js` content paths.
- Ensure all dependencies are installed: `npm install`.
- For custom domains, configure in Vercel dashboard.

## Useful Links
- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev/guide/static-deploy.html)
- [TailwindCSS Docs](https://tailwindcss.com/docs/installation)
