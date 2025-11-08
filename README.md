# ngx-global-phone-input

[![npm version](https://badge.fury.io/js/ngx-global-phone-input.svg)](https://badge.fury.io/js/ngx-global-phone-input)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-16%2B-red.svg)](https://angular.io/)

A comprehensive Angular library for international phone number input with country selection, validation using Google's libphonenumber, auto-detection, and Material Design integration.

## ✨ Features

- 🌍 **Complete Country Support** - All countries with their flags, dial codes, and native names
- 📱 **Smart Validation** - Uses Google's libphonenumber for industry-standard validation
- 🎯 **Auto-Detection** - Automatically detects user's country based on IP geolocation
- 🎨 **Material Design** - Seamless integration with Angular Material
- 🔧 **Reactive Forms** - Full support for Angular Reactive Forms with ControlValueAccessor
- 🚀 **TypeScript** - Written in TypeScript with full type definitions
- 📦 **Standalone Component** - Works with Angular standalone components
- 🎭 **Flexible Display** - Support for both emoji and image flags (249 country flag images included)
- 🔄 **Format Options** - Multiple phone number format outputs (E164, National, International)
- ⚡ **Performance** - Optimized with caching and efficient country detection
- 🧪 **Well Tested** - Comprehensive unit test coverage

## 📦 Installation

```bash
npm install ngx-global-phone-input google-libphonenumber
```

### Install Peer Dependencies

```bash
npm install @angular/material @angular/cdk @angular/forms
```

### Install Type Definitions (for TypeScript)

```bash
npm install --save-dev @types/google-libphonenumber
```

## 🚀 Quick Start

### 1. Import Required Modules

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GlobalPhoneInputComponent } from 'ngx-global-phone-input';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ReactiveFormsModule, GlobalPhoneInputComponent],
  template: `
    <form [formGroup]="myForm">
      <global-phone-input
        formControlName="phoneNumber"
        label="Phone Number"
        placeholder="Enter your phone number"
        [required]="true">
      </global-phone-input>
    </form>
  `
})
export class ExampleComponent {
  myForm = new FormGroup({
    phoneNumber: new FormControl('')
  });
}
```

### 2. Add Material Theme (if not already added)

In your `styles.css`:

```css
@import '~@angular/material/prebuilt-themes/indigo-pink.css';
```

## 📖 API Reference

### Component Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string` | `undefined` | Label for the input field |
| `placeholder` | `string` | `'Enter mobile number'` | Placeholder text |
| `required` | `boolean` | `false` | Whether the field is required |
| `disabled` | `boolean` | `false` | Whether the field is disabled |
| `id` | `string` | `undefined` | Unique identifier for the component |
| `name` | `string` | `undefined` | Name attribute for the input |
| `useImageFlags` | `boolean` | `false` | Use image flags instead of emoji flags |

### Component Outputs

| Output | Type | Description |
|--------|------|-------------|
| `countryChanged` | `EventEmitter<Country>` | Emitted when country selection changes |
| `mobileChanged` | `EventEmitter<string>` | Emitted when mobile number changes |

### Public Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getFullPhoneNumber()` | `string` | Get complete phone number with country code |
| `getE164PhoneNumber()` | `string` | Get E164 formatted number (+1234567890) |
| `getNationalPhoneNumber()` | `string` | Get national formatted number |
| `getInternationalPhoneNumber()` | `string` | Get international formatted number |
| `isPhoneNumberValid()` | `boolean` | Check if current number is valid |
| `getPhoneNumberType()` | `PhoneNumberType` | Get the type of phone number |
| `clearGeolocationCache()` | `void` | Clear cached geolocation data |

## 🎯 Usage Examples

### Basic Usage with Reactive Forms

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalPhoneInputComponent } from 'ngx-global-phone-input';

@Component({
  selector: 'app-phone-form',
  template: `
    <form [formGroup]="phoneForm" (ngSubmit)="onSubmit()">
      <global-phone-input
        formControlName="phone"
        label="Mobile Number"
        placeholder="Enter your mobile number"
        [required]="true"
        (countryChanged)="onCountryChanged($event)"
        (mobileChanged)="onMobileChanged($event)">
      </global-phone-input>
      
      <button type="submit" [disabled]="phoneForm.invalid">
        Submit
      </button>
    </form>
    
    <div *ngIf="phoneForm.get('phone')?.errors?.['required']">
      Phone number is required
    </div>
    <div *ngIf="phoneForm.get('phone')?.errors?.['invalidNumber']">
      Please enter a valid phone number
    </div>
  `
})
export class PhoneFormComponent {
  phoneForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.phoneForm.valid) {
      const phoneValue = this.phoneForm.get('phone')?.value;
      console.log('Phone number:', phoneValue);
    }
  }

  onCountryChanged(country: any) {
    console.log('Country changed:', country);
  }

  onMobileChanged(mobile: string) {
    console.log('Mobile changed:', mobile);
  }
}
```

### Advanced Usage with Custom Validation

```typescript
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GlobalPhoneInputComponent } from 'ngx-global-phone-input';

@Component({
  selector: 'app-advanced-phone',
  template: `
    <global-phone-input
      #phoneInput
      [formControl]="phoneControl"
      label="Business Phone"
      placeholder="Enter business phone number"
      [required]="true"
      [useImageFlags]="true">
    </global-phone-input>
    
    <div class="phone-info" *ngIf="phoneControl.value">
      <p><strong>Full Number:</strong> {{ phoneInput.getFullPhoneNumber() }}</p>
      <p><strong>E164 Format:</strong> {{ phoneInput.getE164PhoneNumber() }}</p>
      <p><strong>National Format:</strong> {{ phoneInput.getNationalPhoneNumber() }}</p>
      <p><strong>International Format:</strong> {{ phoneInput.getInternationalPhoneNumber() }}</p>
      <p><strong>Is Valid:</strong> {{ phoneInput.isPhoneNumberValid() }}</p>
      <p><strong>Number Type:</strong> {{ getNumberTypeString(phoneInput.getPhoneNumberType()) }}</p>
    </div>
  `
})
export class AdvancedPhoneComponent {
  @ViewChild('phoneInput') phoneInput!: GlobalPhoneInputComponent;
  
  phoneControl = new FormControl('');

  getNumberTypeString(type: any): string {
    // Convert PhoneNumberType enum to readable string
    const types: { [key: number]: string } = {
      0: 'Fixed Line',
      1: 'Mobile',
      2: 'Fixed Line or Mobile',
      3: 'Toll Free',
      4: 'Premium Rate',
      5: 'Shared Cost',
      6: 'VOIP',
      7: 'Personal Number',
      8: 'Pager',
      9: 'UAN',
      10: 'Unknown'
    };
    return types[type] || 'Unknown';
  }
}
```

### Setting Initial Values

```typescript
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-preset-phone',
  template: `
    <global-phone-input
      [formControl]="phoneControl"
      label="Phone Number">
    </global-phone-input>
  `
})
export class PresetPhoneComponent implements OnInit {
  phoneControl = new FormControl('');

  ngOnInit() {
    // Set international number (will auto-detect country)
    this.phoneControl.setValue('+919876543210');
    
    // Or set just the mobile number (will use detected/default country)
    // this.phoneControl.setValue('9876543210');
  }
}
```

## 🎭 Flag Display Options

The library supports both emoji flags and image flags:

### Emoji Flags (Default)
```typescript
<global-phone-input
  [useImageFlags]="false"  // Default
  formControlName="phoneNumber">
</global-phone-input>
```

### Image Flags
```typescript
<global-phone-input
  [useImageFlags]="true"
  formControlName="phoneNumber">
</global-phone-input>
```

The library includes **249 high-quality flag images** (PNG format, optimized for web) for all supported countries. Images are automatically loaded from the library's assets and fall back to emoji flags if an image is not found.

## 🎨 Styling

The component uses Angular Material components and can be styled using Angular Material theming:

```scss
// Custom styling
.mobile-number-container {
  .mat-form-field {
    width: 100%;
  }
  
  .country-select-wrapper {
    min-width: 80px;
  }
  
  .flag {
    font-size: 1.2em;
    margin-right: 8px;
  }
  
  .flag-image {
    width: 20px;
    height: 15px;
    margin-right: 8px;
  }
}

// Error styling
.text-danger {
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 4px;
}
```

## 🌍 Supported Countries

The library includes all countries with:
- Country names (English and native)
- ISO country codes
- Dial codes
- Flag emojis
- Validation patterns
- Mobile number formats

## 🔧 Configuration

### Geolocation Service

The component automatically detects the user's country using IP geolocation. The service caches results for 30 days to improve performance.

```typescript
// Clear geolocation cache if needed
@ViewChild('phoneInput') phoneInput!: GlobalPhoneInputComponent;

clearCache() {
  this.phoneInput.clearGeolocationCache();
}
```

### Custom Country Detection

You can disable auto-detection by setting an initial value:

```typescript
ngOnInit() {
  // This will prevent auto-detection
  this.phoneControl.setValue('+1'); // Sets US as default
}
```

## 🧪 Testing

The library includes comprehensive unit tests. To run tests in your project:

```bash
ng test
```

### Testing with the Component

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { GlobalPhoneInputComponent } from 'ngx-global-phone-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        GlobalPhoneInputComponent
      ]
    }).compileComponents();
  });

  // Your tests here
});
```

## 🚀 Building for Production

To build the library:

```bash
ng build ngx-global-phone-input
```

## 📋 Requirements

- Angular 16+
- Angular Material 16+
- Angular CDK 16+
- Angular Forms 16+
- google-libphonenumber ^3.2.0

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google's libphonenumber](https://github.com/google/libphonenumber) for phone number validation
- [Angular Material](https://material.angular.io/) for UI components
- [DB-IP](https://db-ip.com/) for geolocation services

## 📞 Support

If you have any questions or issues, please [open an issue](https://github.com/your-username/ngx-global-phone-input/issues) on GitHub.

---

Made with ❤️ for the Angular community
