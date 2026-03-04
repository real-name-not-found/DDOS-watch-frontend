/**
 * Get threat level label and color based on score (0-100)
 */
export const getThreatLevel = (score) => {
    if (score >= 81) return { level: 'CRITICAL', color: '#9B2C2C', bg: 'bg-risk-critical' };
    if (score >= 61) return { level: 'HIGH', color: '#C05621', bg: 'bg-risk-warning' };
    if (score >= 31) return { level: 'MEDIUM', color: '#D69E2E', bg: 'bg-yellow-500' };
    return { level: 'LOW', color: '#2F855A', bg: 'bg-risk-ok' };
};

/**
 * Format large numbers: 1200000 -> "1.2M"
 */
export const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
};

/**
 * Format date like "2023-11-24 08:42"
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

/**
 * Check if an IP address is valid
 */
export const isValidIP = (ip) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    if (ipv4Regex.test(ip)) {
        return ip.split('.').every((part) => parseInt(part) >= 0 && parseInt(part) <= 255);
    }
    return ipv6Regex.test(ip);
};

/**
 * Check if IP is private
 */
export const isPrivateIP = (ip) => {
    const parts = ip.split('.').map(Number);
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 127) return true;
    return false;
};
