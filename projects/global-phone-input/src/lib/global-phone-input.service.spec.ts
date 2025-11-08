import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GlobalPhoneInputService, GeolocationResponse } from './global-phone-input.service';

describe('GlobalPhoneInputService', () => {
  let service: GlobalPhoneInputService;
  let httpMock: HttpTestingController;

  const mockGeolocationResponse: GeolocationResponse = {
    ipAddress: '203.0.113.1',
    continentCode: 'AS',
    continentName: 'Asia',
    countryCode: 'IN',
    countryName: 'India',
    stateProv: 'Maharashtra',
    city: 'Mumbai'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GlobalPhoneInputService]
    });
    
    service = TestBed.inject(GlobalPhoneInputService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getCountryData', () => {
    it('should fetch country data from API when no cache exists', () => {
      service.getCountryData().subscribe(data => {
        expect(data).toEqual(mockGeolocationResponse);
      });

      const req = httpMock.expectOne('https://api.db-ip.com/v2/free/self');
      expect(req.request.method).toBe('GET');
      req.flush(mockGeolocationResponse);
    });

    it('should return cached data when valid cache exists', (done) => {
      // Set up cache
      const cachedData = {
        data: mockGeolocationResponse,
        timestamp: Date.now(),
        expiryDate: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now
      };
      localStorage.setItem('ngx_global_phone_input_country_cache', JSON.stringify(cachedData));

      service.getCountryData().subscribe(data => {
        expect(data).toEqual(mockGeolocationResponse);
        done();
      });

      // Should not make HTTP request when cache is valid
      httpMock.expectNone('https://api.db-ip.com/v2/free/self');
    });

    it('should fetch from API when cache is expired', () => {
      // Set up expired cache
      const expiredCachedData = {
        data: mockGeolocationResponse,
        timestamp: Date.now() - (31 * 24 * 60 * 60 * 1000), // 31 days ago
        expiryDate: Date.now() - (24 * 60 * 60 * 1000) // 1 day ago (expired)
      };
      localStorage.setItem('ngx_global_phone_input_country_cache', JSON.stringify(expiredCachedData));

      service.getCountryData().subscribe(data => {
        expect(data).toEqual(mockGeolocationResponse);
      });

      const req = httpMock.expectOne('https://api.db-ip.com/v2/free/self');
      expect(req.request.method).toBe('GET');
      req.flush(mockGeolocationResponse);
    });

    it('should handle API errors gracefully', () => {
      service.getCountryData().subscribe(data => {
        expect(data).toBeNull();
      });

      const req = httpMock.expectOne('https://api.db-ip.com/v2/free/self');
      req.error(new ErrorEvent('Network error'));
    });

    it('should cache successful API responses', () => {
      service.getCountryData().subscribe(() => {
        // Check if data was cached
        const cachedData = localStorage.getItem('ngx_global_phone_input_country_cache');
        expect(cachedData).toBeTruthy();
        
        const parsed = JSON.parse(cachedData!);
        expect(parsed.data).toEqual(mockGeolocationResponse);
        expect(parsed.timestamp).toBeTruthy();
        expect(parsed.expiryDate).toBeTruthy();
      });

      const req = httpMock.expectOne('https://api.db-ip.com/v2/free/self');
      req.flush(mockGeolocationResponse);
    });
  });

  describe('getUserLocation (deprecated)', () => {
    it('should call getCountryData method', () => {
      spyOn(service, 'getCountryData').and.callThrough();
      
      service.getUserLocation().subscribe();
      
      expect(service.getCountryData).toHaveBeenCalled();
      
      const req = httpMock.expectOne('https://api.db-ip.com/v2/free/self');
      req.flush(mockGeolocationResponse);
    });
  });

  describe('mapCountryCodeToDialCode', () => {
    it('should return correct dial code for valid country code', () => {
      const dialCode = service.mapCountryCodeToDialCode('IN');
      expect(dialCode).toBe('+91');
    });

    it('should return correct dial code for US', () => {
      const dialCode = service.mapCountryCodeToDialCode('US');
      expect(dialCode).toBe('+1');
    });

    it('should return correct dial code for UK', () => {
      const dialCode = service.mapCountryCodeToDialCode('GB');
      expect(dialCode).toBe('+44');
    });

    it('should return null for invalid country code', () => {
      const dialCode = service.mapCountryCodeToDialCode('INVALID');
      expect(dialCode).toBeNull();
    });

    it('should return null for empty country code', () => {
      const dialCode = service.mapCountryCodeToDialCode('');
      expect(dialCode).toBeNull();
    });

    it('should handle case sensitivity', () => {
      const dialCode = service.mapCountryCodeToDialCode('in');
      expect(dialCode).toBeNull(); // Should be case sensitive
    });
  });

  describe('hasValidCache', () => {
    it('should return true when valid cache exists', () => {
      const cachedData = {
        data: mockGeolocationResponse,
        timestamp: Date.now(),
        expiryDate: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now
      };
      localStorage.setItem('ngx_global_phone_input_country_cache', JSON.stringify(cachedData));

      const hasValidCache = service.hasValidCache();
      expect(hasValidCache).toBeTruthy();
    });

    it('should return false when cache is expired', () => {
      const expiredCachedData = {
        data: mockGeolocationResponse,
        timestamp: Date.now() - (31 * 24 * 60 * 60 * 1000),
        expiryDate: Date.now() - (24 * 60 * 60 * 1000) // Expired
      };
      localStorage.setItem('ngx_global_phone_input_country_cache', JSON.stringify(expiredCachedData));

      const hasValidCache = service.hasValidCache();
      expect(hasValidCache).toBeFalsy();
    });

    it('should return false when no cache exists', () => {
      const hasValidCache = service.hasValidCache();
      expect(hasValidCache).toBeFalsy();
    });

    it('should return false when cache is corrupted', () => {
      localStorage.setItem('ngx_global_phone_input_country_cache', 'invalid-json');

      const hasValidCache = service.hasValidCache();
      expect(hasValidCache).toBeFalsy();
    });

    it('should return false when cache structure is invalid', () => {
      const invalidCachedData = {
        data: mockGeolocationResponse
        // Missing timestamp and expiryDate
      };
      localStorage.setItem('ngx_global_phone_input_country_cache', JSON.stringify(invalidCachedData));

      const hasValidCache = service.hasValidCache();
      expect(hasValidCache).toBeFalsy();
    });
  });

  describe('clearCache', () => {
    it('should remove cache from localStorage', () => {
      // Set up cache
      localStorage.setItem('ngx_global_phone_input_country_cache', JSON.stringify(mockGeolocationResponse));
      
      service.clearCache();
      
      const cachedData = localStorage.getItem('ngx_global_phone_input_country_cache');
      expect(cachedData).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.removeItem to throw an error
      spyOn(localStorage, 'removeItem').and.throwError('Storage error');
      spyOn(console, 'warn');
      
      expect(() => service.clearCache()).not.toThrow();
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('Private Methods', () => {
    describe('getCachedData', () => {
      it('should return null when no cache exists', () => {
        const cachedData = service['getCachedData']();
        expect(cachedData).toBeNull();
      });

      it('should return cached data when valid cache exists', () => {
        const expectedData = {
          data: mockGeolocationResponse,
          timestamp: Date.now(),
          expiryDate: Date.now() + (30 * 24 * 60 * 60 * 1000)
        };
        localStorage.setItem('ngx_global_phone_input_country_cache', JSON.stringify(expectedData));

        const cachedData = service['getCachedData']();
        expect(cachedData).toEqual(expectedData);
      });

      it('should clear cache and return null for corrupted data', () => {
        localStorage.setItem('ngx_global_phone_input_country_cache', 'invalid-json');
        spyOn(service, 'clearCache');
        spyOn(console, 'warn'); // Spy on console.warn to prevent actual logging

        const cachedData = service['getCachedData']();
        
        expect(cachedData).toBeNull();
        expect(service.clearCache).toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalled();
      });

      it('should clear cache and return null for invalid structure', () => {
        const invalidData = { data: mockGeolocationResponse }; // Missing required fields
        localStorage.setItem('ngx_global_phone_input_country_cache', JSON.stringify(invalidData));
        spyOn(service, 'clearCache');
        spyOn(console, 'warn'); // Spy on console.warn to prevent actual logging

        const cachedData = service['getCachedData']();
        
        expect(cachedData).toBeNull();
        expect(service.clearCache).toHaveBeenCalled();
      });
    });

    describe('setCachedData', () => {
      it('should store data with correct structure', () => {
        const beforeTime = Date.now();
        
        service['setCachedData'](mockGeolocationResponse);
        
        const afterTime = Date.now();
        const cachedData = localStorage.getItem('ngx_global_phone_input_country_cache');
        expect(cachedData).toBeTruthy();
        
        const parsed = JSON.parse(cachedData!);
        expect(parsed.data).toEqual(mockGeolocationResponse);
        expect(parsed.timestamp).toBeGreaterThanOrEqual(beforeTime);
        expect(parsed.timestamp).toBeLessThanOrEqual(afterTime);
        expect(parsed.expiryDate).toBeGreaterThan(parsed.timestamp);
      });

      it('should handle localStorage errors gracefully', () => {
        spyOn(localStorage, 'setItem').and.throwError('Storage error');
        spyOn(console, 'warn');
        
        expect(() => service['setCachedData'](mockGeolocationResponse)).not.toThrow();
        expect(console.warn).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null country code in mapCountryCodeToDialCode', () => {
      const dialCode = service.mapCountryCodeToDialCode(null as any);
      expect(dialCode).toBeNull();
    });

    it('should handle undefined country code in mapCountryCodeToDialCode', () => {
      const dialCode = service.mapCountryCodeToDialCode(undefined as any);
      expect(dialCode).toBeNull();
    });

    it('should handle localStorage being unavailable', () => {
      // Mock localStorage methods to throw errors
      spyOn(localStorage, 'getItem').and.throwError('localStorage unavailable');
      spyOn(localStorage, 'removeItem').and.throwError('localStorage unavailable');
      spyOn(console, 'warn');
      
      expect(() => service.hasValidCache()).not.toThrow();
      expect(() => service.clearCache()).not.toThrow();
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('Cache Duration', () => {
    it('should set correct expiry date (30 days)', () => {
      const beforeTime = Date.now();
      
      service['setCachedData'](mockGeolocationResponse);
      
      const cachedData = localStorage.getItem('ngx_global_phone_input_country_cache');
      const parsed = JSON.parse(cachedData!);
      
      const expectedExpiryTime = beforeTime + (30 * 24 * 60 * 60 * 1000);
      const actualExpiryTime = parsed.expiryDate;
      
      // Allow for small time differences in test execution
      expect(actualExpiryTime).toBeGreaterThanOrEqual(expectedExpiryTime - 1000);
      expect(actualExpiryTime).toBeLessThanOrEqual(expectedExpiryTime + 1000);
    });
  });
});
