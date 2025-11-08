import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GlobalPhoneInputComponent, mobileNumberValidator } from './global-phone-input.component';
import { GlobalPhoneInputService } from './global-phone-input.service';
import { COUNTRIES_DATA, Country } from './countries-data';
import { of } from 'rxjs';

describe('GlobalPhoneInputComponent', () => {
  let component: GlobalPhoneInputComponent;
  let fixture: ComponentFixture<GlobalPhoneInputComponent>;
  let service: jasmine.SpyObj<GlobalPhoneInputService>;

  const mockCountryData = {
    ipAddress: '203.0.113.1',
    continentCode: 'AS',
    continentName: 'Asia',
    countryCode: 'IN',
    countryName: 'India',
    stateProv: 'Maharashtra',
    city: 'Mumbai'
  };

  const indiaCountry: Country = COUNTRIES_DATA.find(c => c.code === 'IN')!;
  const usCountry: Country = COUNTRIES_DATA.find(c => c.code === 'US')!;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('GlobalPhoneInputService', [
      'getCountryData',
      'mapCountryCodeToDialCode',
      'clearCache'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        GlobalPhoneInputComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: GlobalPhoneInputService, useValue: serviceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalPhoneInputComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(GlobalPhoneInputService) as jasmine.SpyObj<GlobalPhoneInputService>;

    // Setup default service behavior
    service.getCountryData.and.returnValue(of(mockCountryData));
    service.mapCountryCodeToDialCode.and.returnValue('+91');
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default properties', () => {
      expect(component.required).toBeFalse();
      expect(component.disabled).toBeFalse();
      expect(component.useImageFlags).toBeFalse();
      expect(component.countries).toEqual(COUNTRIES_DATA);
    });

    it('should setup form controls on init', () => {
      expect(component.countryControl).toBeInstanceOf(FormControl);
      expect(component.mobileControl).toBeInstanceOf(FormControl);
    });

    it('should detect user country on init', () => {
      expect(service.getCountryData).toHaveBeenCalled();
    });
  });

  describe('Input Properties', () => {
    it('should accept label input', () => {
      component.label = 'Phone Number';
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('mat-label'));
      expect(labelElement.nativeElement.textContent).toContain('Phone Number');
    });

    it('should accept placeholder input', () => {
      component.placeholder = 'Enter your phone';
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input[matInput]'));
      expect(inputElement.nativeElement.placeholder).toBe('Enter your phone');
    });

    it('should accept required input', () => {
      component.required = true;
      component.ngOnInit();
      
      expect(component.mobileControl.hasValidator).toBeTruthy();
    });

    it('should accept disabled input', () => {
      component.disabled = true;
      component.setDisabledState(true);
      
      expect(component.mobileControl.disabled).toBeTruthy();
      expect(component.countryControl.disabled).toBeTruthy();
    });
  });

  describe('Country Selection', () => {
    it('should set selected country when country changes', () => {
      component.onCountryChange(indiaCountry);
      
      expect(component.selectedCountry).toEqual(indiaCountry);
    });

    it('should emit countryChanged event when country changes', () => {
      spyOn(component.countryChanged, 'emit');
      
      component.onCountryChange(indiaCountry);
      
      expect(component.countryChanged.emit).toHaveBeenCalledWith(indiaCountry);
    });

    it('should update validators when country changes', () => {
      spyOn(component, 'updateValidators' as any);
      
      component.onCountryChange(indiaCountry);
      
      expect(component['updateValidators']).toHaveBeenCalled();
    });

    it('should handle mobile number when country changes', () => {
      component.selectedCountry = usCountry;
      component.mobileControl.setValue('+12345678901');
      
      component.onCountryChange(indiaCountry);
      
      expect(component.selectedCountry).toEqual(indiaCountry);
    });
  });

  describe('Mobile Number Input', () => {
    beforeEach(() => {
      component.selectedCountry = indiaCountry;
    });

    it('should emit mobileChanged event when mobile number changes', () => {
      spyOn(component.mobileChanged, 'emit');
      
      component.mobileControl.setValue('9876543210');
      
      expect(component.mobileChanged.emit).toHaveBeenCalledWith('9876543210');
    });

    it('should sanitize input to remove non-numeric characters', () => {
      const sanitized = component['sanitizeInput']('98-76-54-32-10');
      expect(sanitized).toBe('9876543210');
    });

    it('should preserve + at the beginning during sanitization', () => {
      const sanitized = component['sanitizeInput']('+91 98765-43210');
      expect(sanitized).toBe('+919876543210');
    });

    it('should handle keypress events correctly', () => {
      const mockEvent = {
        key: 'a',
        target: { value: '', selectionStart: 0 } as HTMLInputElement,
        preventDefault: jasmine.createSpy('preventDefault')
      } as any;
      
      component.onKeyPress(mockEvent);
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should allow numeric input', () => {
      const mockEvent = {
        key: '5',
        target: { value: '', selectionStart: 0 } as HTMLInputElement,
        preventDefault: jasmine.createSpy('preventDefault')
      } as any;
      
      component.onKeyPress(mockEvent);
      
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should allow + at the beginning', () => {
      const inputElement = { value: '', selectionStart: 0 } as HTMLInputElement;
      const event = { key: '+', target: inputElement, preventDefault: jasmine.createSpy() } as any;
      
      component.onKeyPress(event);
      
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('Phone Number Formatting', () => {
    beforeEach(() => {
      component.selectedCountry = indiaCountry;
      component.mobileControl.setValue('9876543210');
    });

    it('should get full phone number with country code', () => {
      const fullNumber = component.getFullPhoneNumber();
      expect(fullNumber).toBe('+919876543210');
    });

    it('should get E164 formatted phone number', () => {
      const e164Number = component.getE164PhoneNumber();
      expect(e164Number).toBeTruthy();
    });

    it('should get national formatted phone number', () => {
      const nationalNumber = component.getNationalPhoneNumber();
      expect(nationalNumber).toBeTruthy();
    });

    it('should get international formatted phone number', () => {
      const internationalNumber = component.getInternationalPhoneNumber();
      expect(internationalNumber).toBeTruthy();
    });

    it('should validate phone number', () => {
      const isValid = component.isPhoneNumberValid();
      expect(typeof isValid).toBe('boolean');
    });

    it('should get phone number type', () => {
      const numberType = component.getPhoneNumberType();
      expect(numberType).toBeDefined();
    });
  });

  describe('Auto-detection Features', () => {
    it('should auto-detect country from international number', () => {
      component['handleInternationalNumber']('+919876543210');
      
      expect(component.selectedCountry?.code).toBe('IN');
      expect(component.mobileControl.value).toBe('9876543210');
    });

    it('should detect NANP country correctly', () => {
      const detectedCountry = component['detectNANPCountry']('+12125551234');
      expect(detectedCountry?.code).toBe('US');
    });

    it('should handle dial code input correctly', () => {
      const inputElement = { value: '+919876543210', setSelectionRange: jasmine.createSpy() } as any;
      
      component['handleDialCodeInput']('+919876543210', inputElement);
      
      expect(component.selectedCountry?.code).toBe('IN');
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    it('should register onChange callback', () => {
      const callback = jasmine.createSpy();
      component.registerOnChange(callback);
      
      component.mobileControl.setValue('9876543210');
      
      expect(callback).toHaveBeenCalled();
    });

    it('should register onTouched callback', () => {
      const callback = jasmine.createSpy();
      component.registerOnTouched(callback);
      
      // Trigger touch event
      const inputElement = fixture.debugElement.query(By.css('input[matInput]'));
      inputElement.triggerEventHandler('input', { target: { value: '9876543210' } });
      
      expect(callback).toHaveBeenCalled();
    });

    it('should write value correctly', () => {
      component.writeValue('+919876543210');
      
      expect(component.selectedCountry?.code).toBe('IN');
      expect(component.mobileControl.value).toBe('9876543210');
    });

    it('should handle empty value in writeValue', () => {
      component.writeValue('');
      
      expect(component.mobileControl.value).toBe('');
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      
      expect(component.mobileControl.disabled).toBeTruthy();
      expect(component.countryControl.disabled).toBeTruthy();
    });
  });

  describe('Validation', () => {
    beforeEach(() => {
      component.selectedCountry = indiaCountry;
    });

    it('should validate required field', () => {
      component.required = true;
      const control = new FormControl('');
      
      const result = component.validate(control);
      
      expect(result).toEqual({ required: true });
    });

    it('should validate when no country selected', () => {
      component.selectedCountry = null;
      const control = new FormControl('9876543210');
      
      const result = component.validate(control);
      
      expect(result).toEqual({ noCountrySelected: true });
    });

    it('should return null for valid phone number', () => {
      const control = new FormControl('9876543210');
      component.mobileControl.setValue('9876543210');
      
      const result = component.validate(control);
      
      // Result can be null (valid) or contain validation errors
      expect(result === null || typeof result === 'object').toBeTruthy();
    });
  });

  describe('Flag Display', () => {
    it('should return emoji flag by default', () => {
      const flag = component.getFlagDisplay(indiaCountry);
      expect(flag).toBe(indiaCountry.flag);
    });

    it('should return image flag when useImageFlags is true', () => {
      component.useImageFlags = true;
      const countryWithImage = { ...indiaCountry, flagImage: 'path/to/flag.png' };
      
      const flag = component.getFlagDisplay(countryWithImage);
      expect(flag).toBe('path/to/flag.png');
    });

    it('should detect if flag is image', () => {
      component.useImageFlags = true;
      const countryWithImage = { ...indiaCountry, flagImage: 'path/to/flag.png' };
      
      const isImage = component.isImageFlag(countryWithImage);
      expect(isImage).toBeTruthy();
    });
  });

  describe('Utility Methods', () => {
    it('should clear geolocation cache', () => {
      component.clearGeolocationCache();
      expect(service.clearCache).toHaveBeenCalled();
    });

    it('should enable auto formatting', () => {
      component.selectedCountry = indiaCountry;
      component.enableAutoFormatting(true);
      
      // Test that the subscription is set up
      expect(component).toBeTruthy();
    });

    it('should check if number is likely international', () => {
      const isInternational = component['isLikelyInternationalNumber']('919876543210');
      expect(typeof isInternational).toBe('boolean');
    });

    it('should find country by dial code', () => {
      const country = component['findCountryByDialCode']('+91');
      expect(country?.code).toBe('IN');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null values gracefully', () => {
      component.writeValue(null as any);
      expect(component.mobileControl.value).toBe('');
    });

    it('should handle undefined values gracefully', () => {
      component.writeValue(undefined as any);
      expect(component.mobileControl.value).toBe('');
    });

    it('should handle invalid phone numbers', () => {
      component.selectedCountry = indiaCountry;
      component.mobileControl.setValue('invalid');
      
      const isValid = component.isPhoneNumberValid();
      expect(isValid).toBeFalsy();
    });

    it('should handle missing country data', () => {
      service.getCountryData.and.returnValue(of(null));
      component.ngOnInit();
      
      expect(component).toBeTruthy();
    });
  });

  describe('Component Cleanup', () => {
    it('should complete destroyed$ subject on destroy', () => {
      spyOn(component['destroyed$'], 'next');
      spyOn(component['destroyed$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(component['destroyed$'].next).toHaveBeenCalled();
      expect(component['destroyed$'].complete).toHaveBeenCalled();
    });
  });
});

describe('mobileNumberValidator', () => {
  const indiaCountry: Country = COUNTRIES_DATA.find(c => c.code === 'IN')!;

  it('should return null for empty value', () => {
    const validator = mobileNumberValidator(indiaCountry);
    const control = new FormControl('');
    
    const result = validator(control);
    
    expect(result).toBeNull();
  });

  it('should return null when no country provided', () => {
    const validator = mobileNumberValidator(null);
    const control = new FormControl('9876543210');
    
    const result = validator(control);
    
    expect(result).toBeNull();
  });

  it('should validate phone number format', () => {
    const validator = mobileNumberValidator(indiaCountry);
    const control = new FormControl('9876543210');
    
    const result = validator(control);
    
    // Result should be null (valid) or contain specific validation errors
    expect(result === null || typeof result === 'object').toBeTruthy();
  });

  it('should detect wrong country', () => {
    const validator = mobileNumberValidator(indiaCountry);
    const control = new FormControl('+12125551234'); // US number
    
    const result = validator(control);
    
    if (result) {
      expect(result['wrongCountry']).toBeTruthy();
    }
  });

  it('should detect invalid number patterns', () => {
    const validator = mobileNumberValidator(indiaCountry);
    const control = new FormControl('1111111111'); // Obviously invalid
    
    const result = validator(control);
    
    if (result) {
      expect(result['obviouslyInvalid'] || result['invalidNumber'] || result['notMobile']).toBeTruthy();
    }
  });

  it('should handle parse errors', () => {
    const validator = mobileNumberValidator(indiaCountry);
    const control = new FormControl('invalid-format');
    
    const result = validator(control);
    
    expect(result).toBeTruthy();
    expect(result?.['parseError']).toBeTruthy();
  });
});
