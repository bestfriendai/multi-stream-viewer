# Claude Code Instructions for This Project

## 7 Claude Rules

1. **First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.**
2. **The plan should have a list of todo items that you can check off as you complete them**
3. **Before you begin working, check in with me and I will verify the plan.**
4. **Then, begin working on the todo items, marking them as complete as you go.**
5. **Please every step of the way just give me a high level explanation of what changes you made**
6. **Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.**
7. **Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.**

## Project-Specific Notes
- This is a Next.js 15.3.4 project using Turbopack
- Authentication is handled by Clerk (optional sign-in)
- The app should remain fully functional without authentication
- Protected routes: /dashboard, /profile, /settings, /saved-layouts

## Important Reminders
- **ALWAYS** verify that new npm packages are properly saved to package.json when installing
- When running `npm install <package>`, always use the `--save` flag explicitly
- Before pushing to GitHub, always run `npm run build` locally to catch any build errors
- Common issue: Vercel builds fail when dependencies are not in package.json even if they work locally