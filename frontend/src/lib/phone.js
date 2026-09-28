// ============================================
// FILE: frontend/src/lib/phone.js
// ============================================
// CHANGES MADE:
// 1. Fixed duplicate country codes - US and CA both use +1
// 2. Added unique key for each country
// 3. Added more African countries
// ============================================

// Country data - using unique identifiers
export const COUNTRIES = {
  'NG': {
    id: 'NG',
    name: 'Nigeria',
    code: '+234',
    flag: '🇳🇬',
    format: '0808 267 9797',
    example: '808 267 9797',
    minDigits: 7,
    maxDigits: 10,
    nationalPrefix: '0'
  },
  'GH': {
    id: 'GH',
    name: 'Ghana',
    code: '+233',
    flag: '🇬🇭',
    format: '0302 123 456',
    example: '302 123 456',
    minDigits: 7,
    maxDigits: 9,
    nationalPrefix: '0'
  },
  'KE': {
    id: 'KE',
    name: 'Kenya',
    code: '+254',
    flag: '🇰🇪',
    format: '0712 123 456',
    example: '712 123 456',
    minDigits: 7,
    maxDigits: 9,
    nationalPrefix: '0'
  },
  'ZA': {
    id: 'ZA',
    name: 'South Africa',
    code: '+27',
    flag: '🇿🇦',
    format: '082 123 4567',
    example: '82 123 4567',
    minDigits: 7,
    maxDigits: 9,
    nationalPrefix: '0'
  },
  'EG': {
    id: 'EG',
    name: 'Egypt',
    code: '+20',
    flag: '🇪🇬',
    format: '0123 456 7890',
    example: '123 456 7890',
    minDigits: 7,
    maxDigits: 10,
    nationalPrefix: '0'
  },
  'MA': {
    id: 'MA',
    name: 'Morocco',
    code: '+212',
    flag: '🇲🇦',
    format: '0612 345 678',
    example: '612 345 678',
    minDigits: 7,
    maxDigits: 9,
    nationalPrefix: '0'
  },
  'TZ': {
    id: 'TZ',
    name: 'Tanzania',
    code: '+255',
    flag: '🇹🇿',
    format: '0712 345 678',
    example: '712 345 678',
    minDigits: 7,
    maxDigits: 9,
    nationalPrefix: '0'
  },
  'UG': {
    id: 'UG',
    name: 'Uganda',
    code: '+256',
    flag: '🇺🇬',
    format: '0712 345 678',
    example: '712 345 678',
    minDigits: 7,
    maxDigits: 9,
    nationalPrefix: '0'
  },
  'RW': {
    id: 'RW',
    name: 'Rwanda',
    code: '+250',
    flag: '🇷🇼',
    format: '0788 123 456',
    example: '788 123 456',
    minDigits: 7,
    maxDigits: 9,
    nationalPrefix: '0'
  },
  'ZM': {
    id: 'ZM',
    name: 'Zambia',
    code: '+260',
    flag: '🇿🇲',
    format: '0966 123 456',
    example: '966 123 456',
    minDigits: 7,
    maxDigits: 9,
    nationalPrefix: '0'
  },
  'ZW': {
    id: 'ZW',
    name: 'Zimbabwe',
    code: '+263',
    flag: '🇿🇼',
    format: '0712 345 678',
    example: '712 345 678',
    minDigits: 7,
    maxDigits: 9,
    nationalPrefix: '0'
  },
  'US': {
    id: 'US',
    name: 'United States',
    code: '+1',
    flag: '🇺🇸',
    format: '(555) 555-5555',
    example: '555 555 5555',
    minDigits: 10,
    maxDigits: 10,
    nationalPrefix: ''
  },
  'CA': {
    id: 'CA',
    name: 'Canada',
    code: '+1',
    flag: '🇨🇦',
    format: '(555) 555-5555',
    example: '555 555 5555',
    minDigits: 10,
    maxDigits: 10,
    nationalPrefix: ''
  },
  'GB': {
    id: 'GB',
    name: 'United Kingdom',
    code: '+44',
    flag: '🇬🇧',
    format: '07911 123456',
    example: '7911 123456',
    minDigits: 7,
    maxDigits: 10,
    nationalPrefix: '0'
  },
  'DE': {
    id: 'DE',
    name: 'Germany',
    code: '+49',
    flag: '🇩🇪',
    format: '01512 3456789',
    example: '1512 3456789',
    minDigits: 7,
    maxDigits: 11,
    nationalPrefix: '0'
  },
  'FR': {
    id: 'FR',
    name: 'France',
    code: '+33',
    flag: '🇫🇷',
    format: '06 12 34 56 78',
    example: '6 12 34 56 78',
    minDigits: 7,
    maxDigits: 9,
    nationalPrefix: '0'
  },
  'AU': {
    id: 'AU',
    name: 'Australia',
    code: '+61',
    flag: '🇦🇺',
    format: '0412 345 678',
    example: '412 345 678',
    minDigits: 7,
    maxDigits: 9,
    nationalPrefix: '0'
  },
  'IN': {
    id: 'IN',
    name: 'India',
    code: '+91',
    flag: '🇮🇳',
    format: '98765 43210',
    example: '98765 43210',
    minDigits: 10,
    maxDigits: 10,
    nationalPrefix: '0'
  },
  'PK': {
    id: 'PK',
    name: 'Pakistan',
    code: '+92',
    flag: '🇵🇰',
    format: '0300 1234567',
    example: '300 1234567',
    minDigits: 7,
    maxDigits: 10,
    nationalPrefix: '0'
  },
  'BD': {
    id: 'BD',
    name: 'Bangladesh',
    code: '+880',
    flag: '🇧🇩',
    format: '01712 345678',
    example: '1712 345678',
    minDigits: 7,
    maxDigits: 10,
    nationalPrefix: '0'
  }
};

// Get all countries as array for dropdown - with unique keys
export const getCountries = () => {
  return Object.values(COUNTRIES).sort((a, b) => a.name.localeCompare(b.name));
};

// Get country by code
export const getCountryByCode = (code) => {
  return Object.values(COUNTRIES).find(c => c.code === code) || COUNTRIES['NG'];
};

// Get country by ID
export const getCountryById = (id) => {
  return COUNTRIES[id] || COUNTRIES['NG'];
};

// Validate phone number
export const validatePhone = (phone, countryCode) => {
  if (!phone) return false;
  
  // Remove spaces, hyphens, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // If countryCode is provided, check it matches
  if (countryCode) {
    if (!cleaned.startsWith(countryCode)) {
      return false;
    }
    // Check digits after country code
    const digitsAfterCode = cleaned.substring(countryCode.length);
    const country = getCountryByCode(countryCode);
    if (digitsAfterCode.length < (country?.minDigits || 7)) {
      return false;
    }
    if (digitsAfterCode.length > (country?.maxDigits || 15)) {
      return false;
    }
    return /^\d+$/.test(digitsAfterCode);
  }
  
  // No country code provided - check if it has + and digits
  if (!cleaned.startsWith('+')) return false;
  const digitsAfterPlus = cleaned.substring(1);
  return /^\d{7,15}$/.test(digitsAfterPlus);
};

// Normalize phone number (store in database)
export const normalizePhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/[\s\-\(\)]/g, '');
};

// Format phone for display
export const formatPhone = (phone, countryCode) => {
  if (!phone) return '';
  
  const cleaned = normalizePhone(phone);
  const country = getCountryByCode(countryCode || '+234');
  
  if (!country) return phone;
  
  // Remove country code from the beginning
  let national = cleaned;
  if (national.startsWith(country.code)) {
    national = national.substring(country.code.length);
  }
  
  // Format based on country
  if (country.code === '+234') {
    // Nigeria: 0808 267 9797
    if (national.length === 10) {
      return `${national.substring(0, 4)} ${national.substring(4, 7)} ${national.substring(7, 11)}`;
    }
    if (national.length === 8) {
      return `${national.substring(0, 3)} ${national.substring(3, 6)} ${national.substring(6, 8)}`;
    }
    return `${country.code} ${national}`;
  }
  
  if (country.code === '+1') {
    // US/Canada: (555) 555-5555
    if (national.length === 10) {
      return `(${national.substring(0, 3)}) ${national.substring(3, 6)}-${national.substring(6, 10)}`;
    }
    return `${country.code} ${national}`;
  }
  
  if (country.code === '+44') {
    // UK: 07911 123456
    if (national.length === 10) {
      return `${national.substring(0, 5)} ${national.substring(5, 10)}`;
    }
    return `${country.code} ${national}`;
  }
  
  if (country.code === '+49') {
    // Germany: 01512 3456789
    if (national.length === 10 || national.length === 11) {
      return `${national.substring(0, 5)} ${national.substring(5)}`;
    }
    return `${country.code} ${national}`;
  }
  
  if (country.code === '+33') {
    // France: 06 12 34 56 78
    if (national.length === 9) {
      return `${national.substring(0, 2)} ${national.substring(2, 4)} ${national.substring(4, 6)} ${national.substring(6, 8)} ${national.substring(8, 9)}`;
    }
    return `${country.code} ${national}`;
  }
  
  // Default format
  return `${country.code} ${national}`;
};

// Get example phone for a country
export const getExamplePhone = (countryCode) => {
  const country = getCountryByCode(countryCode);
  if (!country) return '+234 808 267 9797';
  return `${country.code} ${country.example}`;
};

// Get display name for country
export const getCountryDisplay = (countryCode) => {
  const country = getCountryByCode(countryCode);
  if (!country) return '🇳🇬 Nigeria (+234)';
  return `${country.flag} ${country.name} (${country.code})`;
};

// Get country by phone number (detect from number)
export const detectCountry = (phone) => {
  if (!phone) return COUNTRIES['NG'];
  const cleaned = normalizePhone(phone);
  for (const key of Object.keys(COUNTRIES)) {
    const country = COUNTRIES[key];
    if (cleaned.startsWith(country.code)) {
      return country;
    }
  }
  return COUNTRIES['NG'];
};