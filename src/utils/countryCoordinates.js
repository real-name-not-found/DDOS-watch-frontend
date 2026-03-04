// ISO Alpha-2 country code -> { lat, lng, name }
const countryCoordinates = {
    US: { lat: 38.0, lng: -97.0, name: 'United States' },
    CN: { lat: 35.0, lng: 105.0, name: 'China' },
    RU: { lat: 60.0, lng: 100.0, name: 'Russia' },
    BR: { lat: -14.0, lng: -51.0, name: 'Brazil' },
    IN: { lat: 20.0, lng: 77.0, name: 'India' },
    DE: { lat: 51.0, lng: 9.0, name: 'Germany' },
    GB: { lat: 55.0, lng: -3.0, name: 'United Kingdom' },
    FR: { lat: 46.0, lng: 2.0, name: 'France' },
    JP: { lat: 36.0, lng: 138.0, name: 'Japan' },
    KR: { lat: 36.0, lng: 128.0, name: 'South Korea' },
    AU: { lat: -25.0, lng: 133.0, name: 'Australia' },
    CA: { lat: 56.0, lng: -106.0, name: 'Canada' },
    NL: { lat: 52.0, lng: 5.0, name: 'Netherlands' },
    SG: { lat: 1.3, lng: 103.8, name: 'Singapore' },
    UA: { lat: 49.0, lng: 32.0, name: 'Ukraine' },
    VN: { lat: 14.0, lng: 108.0, name: 'Vietnam' },
    ID: { lat: -5.0, lng: 120.0, name: 'Indonesia' },
    TH: { lat: 15.0, lng: 100.0, name: 'Thailand' },
    PL: { lat: 52.0, lng: 20.0, name: 'Poland' },
    TR: { lat: 39.0, lng: 35.0, name: 'Turkey' },
    IT: { lat: 42.0, lng: 12.0, name: 'Italy' },
    ES: { lat: 40.0, lng: -4.0, name: 'Spain' },
    MX: { lat: 23.0, lng: -102.0, name: 'Mexico' },
    AR: { lat: -34.0, lng: -64.0, name: 'Argentina' },
    ZA: { lat: -30.0, lng: 25.0, name: 'South Africa' },
    EG: { lat: 27.0, lng: 30.0, name: 'Egypt' },
    SA: { lat: 24.0, lng: 45.0, name: 'Saudi Arabia' },
    AE: { lat: 24.0, lng: 54.0, name: 'UAE' },
    IR: { lat: 32.0, lng: 53.0, name: 'Iran' },
    PK: { lat: 30.0, lng: 70.0, name: 'Pakistan' },
    BD: { lat: 24.0, lng: 90.0, name: 'Bangladesh' },
    NG: { lat: 10.0, lng: 8.0, name: 'Nigeria' },
    KE: { lat: -1.0, lng: 38.0, name: 'Kenya' },
    CL: { lat: -35.0, lng: -71.0, name: 'Chile' },
    CO: { lat: 4.0, lng: -72.0, name: 'Colombia' },
    PH: { lat: 12.0, lng: 122.0, name: 'Philippines' },
    MY: { lat: 4.0, lng: 101.5, name: 'Malaysia' },
    TW: { lat: 23.5, lng: 121.0, name: 'Taiwan' },
    HK: { lat: 22.3, lng: 114.2, name: 'Hong Kong' },
    IL: { lat: 31.0, lng: 34.8, name: 'Israel' },
    SE: { lat: 62.0, lng: 15.0, name: 'Sweden' },
    NO: { lat: 62.0, lng: 10.0, name: 'Norway' },
    FI: { lat: 64.0, lng: 26.0, name: 'Finland' },
    DK: { lat: 56.0, lng: 10.0, name: 'Denmark' },
    CH: { lat: 47.0, lng: 8.0, name: 'Switzerland' },
    AT: { lat: 47.5, lng: 14.5, name: 'Austria' },
    BE: { lat: 50.5, lng: 4.0, name: 'Belgium' },
    CZ: { lat: 49.75, lng: 15.5, name: 'Czech Republic' },
    RO: { lat: 46.0, lng: 25.0, name: 'Romania' },
    PT: { lat: 39.5, lng: -8.0, name: 'Portugal' },
    GR: { lat: 39.0, lng: 22.0, name: 'Greece' },
};

export const getCountryCoords = (code) => {
    return countryCoordinates[code?.toUpperCase()] || { lat: 0, lng: 0, name: code || 'Unknown' };
};

export const getCountryName = (code) => {
    return countryCoordinates[code?.toUpperCase()]?.name || code || 'Unknown';
};

export default countryCoordinates;
