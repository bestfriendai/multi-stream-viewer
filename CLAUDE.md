# Claude Code Instructions for This Project

## Important Rules

### Dependency Management
- **ALWAYS** verify that new npm packages are properly saved to package.json when installing
- When running `npm install <package>`, always use the `--save` flag explicitly or verify the package appears in package.json
- After installing any new dependency, always check that it's listed in package.json before committing
- If adding code that imports a new package, immediately install and save it to dependencies

### Build Verification
- Before pushing to GitHub, always run `npm run build` locally to catch any build errors
- If the build fails due to missing dependencies, install them with `npm install <package> --save`
- Common issue: Vercel builds fail when dependencies are not in package.json even if they work locally

### Testing Commands
- Run `npm run build` before committing major changes
- Run `npm run typecheck` to check TypeScript types
- Run `npm run lint` to check for linting issues (though some warnings are acceptable)

### Git Workflow
- Always test builds before pushing to main branch
- Include clear commit messages explaining what was changed
- If a Vercel build fails, check the error log for missing dependencies first

## Project-Specific Notes
- This is a Next.js 15.3.4 project using Turbopack
- Authentication is handled by Clerk (optional sign-in)
- The app should remain fully functional without authentication
- Protected routes: /dashboard, /profile, /settings, /saved-layouts