# GitHub Repository Setup Guide

This guide will help you create a GitHub repository for your `ngx-global-phone-input` library.

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface

1. **Go to GitHub**: Visit [github.com](https://github.com) and sign in
2. **Create New Repository**: Click the "+" icon → "New repository"
3. **Repository Settings**:
   - **Repository name**: `ngx-global-phone-input`
   - **Description**: `A comprehensive Angular library for international phone number input with country selection, validation using Google's libphonenumber, auto-detection, and Material Design integration.`
   - **Visibility**: Public (recommended for open source libraries)
   - **Initialize**: ❌ Don't check "Add a README file" (we already have one)
   - **Add .gitignore**: ❌ Don't add (we already have one)
   - **Choose a license**: ❌ Don't add (we already have MIT license)

4. **Click "Create repository"**

### Option B: Using GitHub CLI (if installed)

```bash
gh repo create ngx-global-phone-input --public --description "A comprehensive Angular library for international phone number input with country selection, validation using Google's libphonenumber, auto-detection, and Material Design integration."
```

## Step 2: Connect Local Repository to GitHub

After creating the GitHub repository, you'll see instructions. Use these commands:

```bash
# Add the remote origin (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ngx-global-phone-input.git

# Rename the default branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Step 3: Update Repository URLs

After creating the repository, update the URLs in your project files:

### 1. Update `projects/global-phone-input/package.json`

Replace `your-username` with your actual GitHub username:

```json
{
  "homepage": "https://github.com/YOUR_USERNAME/ngx-global-phone-input#readme",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/ngx-global-phone-input.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/ngx-global-phone-input/issues"
  }
}
```

### 2. Update `README.md`

Replace the GitHub issue URL:
```markdown
If you have any questions or issues, please [open an issue](https://github.com/YOUR_USERNAME/ngx-global-phone-input/issues) on GitHub.
```

### 3. Commit and Push Changes

```bash
git add .
git commit -m "Update GitHub repository URLs"
git push origin main
```

## Step 4: Set Up Repository Settings

### Repository Topics/Tags
Add these topics to help with discoverability:
- `angular`
- `typescript`
- `phone-input`
- `international`
- `material-design`
- `libphonenumber`
- `validation`
- `country-code`
- `angular-library`
- `npm-package`

### Branch Protection (Optional)
For production libraries, consider setting up branch protection rules:
1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable "Require pull request reviews before merging"

## Step 5: Create GitHub Releases

### Manual Release
1. Go to your repository → Releases
2. Click "Create a new release"
3. **Tag version**: `v1.0.0`
4. **Release title**: `v1.0.0 - Initial Release`
5. **Description**: 
   ```markdown
   ## 🎉 Initial Release
   
   ### Features
   - 🌍 Complete country support with flags and dial codes
   - 📱 Smart validation using Google's libphonenumber
   - 🎯 Auto-detection based on IP geolocation
   - 🎨 Angular Material integration
   - 🔧 Reactive Forms support
   - 🚀 TypeScript support
   - 📦 Standalone component
   - 🧪 Comprehensive unit tests (83 tests)
   
   ### Installation
   ```bash
   npm install ngx-global-phone-input google-libphonenumber
   ```
   
   See [README.md](https://github.com/YOUR_USERNAME/ngx-global-phone-input#readme) for detailed usage instructions.
   ```

### Automated Releases with GitHub Actions

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: ng test global-phone-input --watch=false --browsers=ChromeHeadless
        
      - name: Build library
        run: ng build global-phone-input
        
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
```

## Step 6: Set Up NPM Publishing (Optional)

### GitHub Actions for NPM Publishing

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
          
      - run: npm ci
      - run: ng test global-phone-input --watch=false --browsers=ChromeHeadless
      - run: ng build global-phone-input
      - run: cd dist/global-phone-input && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Note**: You'll need to add your NPM token as a GitHub secret:
1. Repository Settings → Secrets and variables → Actions
2. Add `NPM_TOKEN` with your npm access token

## Step 7: Add Repository Badges

Update your README.md with actual badges:

```markdown
[![npm version](https://badge.fury.io/js/ngx-global-phone-input.svg)](https://badge.fury.io/js/ngx-global-phone-input)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-16%2B-red.svg)](https://angular.io/)
[![Build Status](https://github.com/YOUR_USERNAME/ngx-global-phone-input/workflows/CI/badge.svg)](https://github.com/YOUR_USERNAME/ngx-global-phone-input/actions)
```

## Verification Checklist

After setup, verify:

- ✅ Repository is public and accessible
- ✅ README.md displays correctly
- ✅ License file is visible
- ✅ All source code is pushed
- ✅ Repository URLs in package.json are correct
- ✅ Topics/tags are added for discoverability
- ✅ First release is created
- ✅ GitHub Actions are working (if set up)

## Need Help?

- [GitHub Documentation](https://docs.github.com/)
- [Creating a repository](https://docs.github.com/en/get-started/quickstart/create-a-repo)
- [GitHub CLI](https://cli.github.com/)

Your library is now ready to be shared with the world! 🚀
