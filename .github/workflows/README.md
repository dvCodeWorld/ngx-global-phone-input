# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the ngx-global-phone-input library.

## Workflows

### 1. `ci.yml` - Continuous Integration
**Triggers:** Push to main/develop, Pull Requests
**Purpose:** Run tests and build checks on multiple Node.js versions

**Features:**
- Tests on Node.js 16.x, 18.x, 20.x
- Runs unit tests with coverage
- Builds the library
- Uploads coverage to Codecov
- Verifies build artifacts

### 2. `publish.yml` - NPM Publishing
**Triggers:** 
- GitHub Release published
- Manual workflow dispatch

**Purpose:** Automatically publish to NPM when a release is created

**Features:**
- Runs tests before publishing
- Builds the library
- Publishes to NPM registry
- Creates GitHub release (if manually triggered)

**Required Secrets:**
- `NPM_TOKEN`: Your NPM access token

### 3. `release.yml` - Release Creation
**Triggers:** Manual workflow dispatch only

**Purpose:** Create a new release with version bumping

**Features:**
- Updates package.json version
- Creates Git tag
- Generates changelog
- Creates GitHub release
- Uploads build artifacts

## Setup Instructions

### 1. NPM Token Setup
1. Go to [npmjs.com](https://www.npmjs.com/) → Account → Access Tokens
2. Create a new **Automation** token
3. In your GitHub repository: Settings → Secrets and variables → Actions
4. Add new secret: `NPM_TOKEN` with your token value

### 2. GitHub Token
The `GITHUB_TOKEN` is automatically provided by GitHub Actions.

## Usage

### Publishing to NPM

#### Option 1: Automatic (Recommended)
1. Create a GitHub release:
   - Go to your repository → Releases → Create a new release
   - Tag: `v1.1.0` (or your version)
   - Title: `Release v1.1.0`
   - Description: Add release notes
   - Click "Publish release"
2. The `publish.yml` workflow will automatically run and publish to NPM

#### Option 2: Manual Trigger
1. Go to Actions → Publish to NPM → Run workflow
2. Enter the version number (e.g., `1.1.0`)
3. Click "Run workflow"

### Creating a Release
1. Go to Actions → Create Release → Run workflow
2. Fill in:
   - **Version**: `1.1.0`
   - **Release type**: `minor` (for new features)
   - **Pre-release**: `false` (for stable releases)
3. Click "Run workflow"

### Monitoring CI
- All pushes and PRs automatically trigger the CI workflow
- Check the Actions tab to see test results
- Failed tests will block merging (if branch protection is enabled)

## Workflow Status Badges

Add these to your README.md:

```markdown
[![CI](https://github.com/dvCodeWorld/ngx-global-phone-input/workflows/CI/badge.svg)](https://github.com/dvCodeWorld/ngx-global-phone-input/actions/workflows/ci.yml)
[![Publish](https://github.com/dvCodeWorld/ngx-global-phone-input/workflows/Publish%20to%20NPM/badge.svg)](https://github.com/dvCodeWorld/ngx-global-phone-input/actions/workflows/publish.yml)
[![npm version](https://badge.fury.io/js/ngx-global-phone-input.svg)](https://badge.fury.io/js/ngx-global-phone-input)
```

## Troubleshooting

### NPM Publish Fails
- Check that `NPM_TOKEN` secret is set correctly
- Verify the token has publish permissions
- Ensure the version number hasn't been published before

### Tests Fail
- Check test output in the Actions tab
- Ensure all dependencies are properly installed
- Verify the build completes successfully

### Release Creation Fails
- Check that you have write permissions to the repository
- Verify the version format (e.g., `1.1.0`, not `v1.1.0`)
- Ensure the tag doesn't already exist
