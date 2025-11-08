# Publishing ngx-global-phone-input v1.1.0 to NPM

## Pre-Publication Checklist ✅

- [x] Version updated to 1.1.0
- [x] Library built successfully
- [x] All tests passing
- [x] CHANGELOG.md created
- [x] Git tag v1.1.0 created
- [x] All changes committed

## Step-by-Step Publishing Guide

### 1. Verify NPM Login
```bash
npm whoami
```
If not logged in:
```bash
npm login
```

### 2. Navigate to Distribution Folder
```bash
cd dist/global-phone-input
```

### 3. Verify Package Contents
Check that the following files are present:
- `package.json` (with version 1.1.0)
- `README.md`
- `index.d.ts` (TypeScript declarations)
- `fesm2022/`, `esm2020/` folders
- `src/assets/images/flags/` (249 flag images)

### 4. Test Package Locally (Optional)
```bash
npm pack
```
This creates `ngx-global-phone-input-1.1.0.tgz` for testing.

### 5. Publish to NPM
```bash
npm publish
```

### 6. Verify Publication
Check your package:
- Visit: https://www.npmjs.com/package/ngx-global-phone-input
- Or run: `npm info ngx-global-phone-input`

### 7. Push to GitHub
```bash
cd ../..
git push origin main
git push origin v1.1.0
```

## What's New in v1.1.0

### 🆕 New Features
- **Configurable Caching**: `[enableCache]="true|false"`
- **Default Country Code**: `defaultCountryCode="+91"`
- **249 Flag Images**: High-quality PNG flags included
- **Enhanced Documentation**: Comprehensive examples and API reference

### 💥 Breaking Changes
- Removed hardcoded default country (was India +91)
- `defaultCountryCode` only accepts dial codes with '+' (e.g., '+91', '+1')
- No longer supports country codes ('IN') or names ('India')

### 📝 Migration Guide
**Before (v1.0.0):**
```typescript
<global-phone-input formControlName="phone">
<!-- Automatically defaulted to India (+91) -->
```

**After (v1.1.0):**
```typescript
<global-phone-input 
  defaultCountryCode="+91"
  [enableCache]="true"
  formControlName="phone">
```

## Usage Examples for v1.1.0

### Basic Usage
```typescript
<global-phone-input
  defaultCountryCode="+1"
  formControlName="phoneNumber">
</global-phone-input>
```

### Advanced Configuration
```typescript
<global-phone-input
  defaultCountryCode="+44"
  [enableCache]="false"
  [useImageFlags]="true"
  label="Business Phone"
  placeholder="Enter phone number"
  [required]="true"
  formControlName="phoneNumber">
</global-phone-input>
```

### Multiple Countries
```typescript
<!-- US -->
<global-phone-input defaultCountryCode="+1" formControlName="usPhone">
<!-- UK -->
<global-phone-input defaultCountryCode="+44" formControlName="ukPhone">
<!-- India -->
<global-phone-input defaultCountryCode="+91" formControlName="inPhone">
```

## Installation for Users

```bash
npm install ngx-global-phone-input@1.1.0 google-libphonenumber
npm install @angular/material @angular/cdk @angular/forms
npm install --save-dev @types/google-libphonenumber
```

## Support

- **GitHub**: https://github.com/dvCodeWorld/ngx-global-phone-input
- **Issues**: https://github.com/dvCodeWorld/ngx-global-phone-input/issues
- **NPM**: https://www.npmjs.com/package/ngx-global-phone-input

---

🎉 **Ready to publish ngx-global-phone-input v1.1.0!**
