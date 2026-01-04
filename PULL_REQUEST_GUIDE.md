# Creating Pull Request - Step by Step Guide

## Step 1: Create a new repository on GitHub

1. Go to https://github.com/new
2. Repository name: `playwright-testing`
3. Set it to **Public** or **Private** (your choice)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Add remote and push to GitHub

After creating the repository, GitHub will show you commands. Run these commands:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/aytaceskerova/playwright-testing.git

# Push the master branch
git push -u origin master

# Push the feature branch
git push -u origin feature/playwright-typescript-setup
```

## Step 3: Create Pull Request on GitHub

1. Go to your repository: https://github.com/aytaceskerova/playwright-testing
2. You'll see a banner suggesting to create a PR for `feature/playwright-typescript-setup`
3. Click "Compare & pull request"
4. Fill in the PR details:
   - **Title**: "Setup: Install Node.js project and configure Playwright with TypeScript"
   - **Description**: 
     ```
     ## Summary
     Initial setup of Node.js project with Playwright and TypeScript configuration.
     
     ## Changes
     - ✅ Installed Node.js project with npm
     - ✅ Configured Playwright with TypeScript
     - ✅ Set up test directory structure
     - ✅ Added example test for login page
     - ✅ Configured for testing https://qa-course-01.andersenlab.com
     
     ## Testing
     Run tests with: `npm test`
     ```
5. Click "Create pull request"

## Alternative: Using GitHub CLI (if installed later)

If you install GitHub CLI (`gh`), you can create PRs from command line:

```bash
gh auth login
gh repo create playwright-testing --public --source=. --remote=origin --push
gh pr create --title "Setup: Install Node.js project and configure Playwright with TypeScript" --body "Initial setup of Node.js project with Playwright and TypeScript configuration."
```

