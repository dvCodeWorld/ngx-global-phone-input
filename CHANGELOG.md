# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-11-09

### Added
- **Configurable Caching**: New `enableCache` input parameter to control country detection caching
- **Default Country Code**: New `defaultCountryCode` input parameter for setting default country
- **Enhanced Service**: Updated `GlobalPhoneInputService.getCountryData()` to support optional caching
- **Flag Images**: Added 249 high-quality country flag images for `useImageFlags` option
- **Comprehensive Documentation**: Enhanced README with configuration examples and API reference

### Changed
- **Breaking**: Removed hardcoded `DEFAULT_COUNTRY_CODE` constant (was '+91' for India)
- **Breaking**: `defaultCountryCode` only accepts dial codes with '+' format (e.g., '+91', '+1', '+44')
- **Simplified Logic**: Removed complex country finding by name/code, now only supports dial codes
- **Cache Key**: Updated localStorage cache key from 'giddh_country_data_cache' to 'ngx_global_phone_input_country_cache'

### Removed
- **Breaking**: Removed support for setting default country by country code ('IN') or country name ('India')
- Removed `findCountryByIdentifier` method (internal)
- Removed hardcoded fallback to India as default country

### Fixed
- Improved TypeScript type safety for input parameters
- Enhanced error handling for invalid default country codes

### Migration Guide
If you were relying on the automatic fallback to India (+91), you now need to explicitly set:
```typescript
<global-phone-input defaultCountryCode="+91" ...>
```

## [1.0.0] - 2024-11-08

### Added
- Initial release of ngx-global-phone-input
- International phone number input with country selection
- Google libphonenumber integration for validation
- Auto country detection based on IP geolocation
- Angular Material design integration
- Reactive Forms support (ControlValueAccessor)
- TypeScript support with full type definitions
- Standalone component support
- Multiple phone number format outputs (E164, National, International)
- Comprehensive unit test coverage (83 tests)
- MIT License
