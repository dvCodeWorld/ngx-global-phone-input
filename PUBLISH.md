# Publishing to NPM

This guide explains how to publish the `ngx-global-phone-input` library to npm.

## Prerequisites

1. **npm account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **npm CLI**: Ensure you have npm installed and are logged in
   ```bash
   npm login
   ```

## Publishing Steps

### 1. Build the Library

```bash
ng build global-phone-input
```

### 2. Navigate to Distribution Folder

```bash
cd dist/global-phone-input
```

### 3. Verify Package Contents

Check that all necessary files are present:
- `package.json` - with correct metadata
- `README.md` - comprehensive documentation
- `LICENSE` - MIT license file
- TypeScript declaration files (`.d.ts`)
- Compiled JavaScript files
- Source maps

### 4. Test the Package Locally (Optional)

```bash
npm pack
```

This creates a `.tgz` file that you can install locally to test:

```bash
npm install ./ngx-global-phone-input-1.0.0.tgz
```

### 5. Publish to npm

For first-time publishing:

```bash
npm publish
```

For subsequent versions, update the version first:

```bash
npm version patch  # for bug fixes
npm version minor  # for new features
npm version major  # for breaking changes
npm publish
```

### 6. Verify Publication

Check your package on npm:
- Visit: `https://www.npmjs.com/package/ngx-global-phone-input`
- Or run: `npm info ngx-global-phone-input`

## Version Management

### Semantic Versioning

Follow [semantic versioning](https://semver.org/):
- **PATCH** (1.0.1): Bug fixes
- **MINOR** (1.1.0): New features (backward compatible)
- **MAJOR** (2.0.0): Breaking changes

### Update Checklist

Before publishing a new version:

1. ✅ Update version in `projects/global-phone-input/package.json`
2. ✅ Update CHANGELOG.md with new features/fixes
3. ✅ Run tests: `ng test global-phone-input`
4. ✅ Build successfully: `ng build global-phone-input`
5. ✅ Update README.md if needed
6. ✅ Commit all changes to git
7. ✅ Create git tag: `git tag v1.0.0`
8. ✅ Push to repository: `git push origin main --tags`

## Automated Publishing (Optional)

Consider setting up GitHub Actions for automated publishing:

```yaml
# .github/workflows/publish.yml
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
      - run: ng build global-phone-input
      - run: cd dist/global-phone-input && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Post-Publication

1. **Update repository URLs** in package.json with actual GitHub repository
2. **Add badges** to README.md with correct npm package name
3. **Create documentation website** (optional)
4. **Announce** on social media, Angular community, etc.

## Troubleshooting

### Common Issues

1. **Package name already exists**
   - Choose a unique name
   - Check availability: `npm info <package-name>`

2. **Permission denied**
   - Ensure you're logged in: `npm whoami`
   - Check package scope/organization permissions

3. **Build errors**
   - Fix TypeScript errors
   - Ensure all dependencies are properly declared

4. **Missing files in published package**
   - Check `.npmignore` file
   - Verify `files` field in package.json

### Support

For issues with publishing:
- [npm documentation](https://docs.npmjs.com/)
- [Angular library publishing guide](https://angular.io/guide/creating-libraries)
