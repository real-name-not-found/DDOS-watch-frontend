/**
 * Unified threat level based on AbuseIPDB score (0-100).
 * This is the SINGLE source of truth for score → label mapping.
 * Every component must use this instead of defining its own thresholds.
 */
export const getThreatLevel = (score) => {
    if (score >= 80) return { level: 'CRITICAL', color: '#9B2C2C', bg: 'bg-risk-critical', textColor: 'text-risk-critical' };
    if (score >= 60) return { level: 'HIGH', color: '#C05621', bg: 'bg-risk-warning', textColor: 'text-risk-warning' };
    if (score >= 30) return { level: 'MODERATE', color: '#D69E2E', bg: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { level: 'LOW', color: '#2F855A', bg: 'bg-risk-ok', textColor: 'text-risk-ok' };
};

/**
 * Whitelisted-aware wrapper around getThreatLevel.
 * Use this when displaying status for an IP that might be whitelisted.
 */
export const getAbuseStatus = (score, isWhitelisted) => {
    if (isWhitelisted) return { level: 'WHITELISTED', color: '#2F855A', bg: 'bg-risk-ok', textColor: 'text-risk-ok' };
    return getThreatLevel(score);
};

const isValidIPv4Address = (ip) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(ip)) return false;
    return ip.split('.').every((part) => Number(part) >= 0 && Number(part) <= 255);
};

const countIPv6Segments = (segments) => {
    let total = 0;

    for (let index = 0; index < segments.length; index += 1) {
        const segment = segments[index];

        if (!segment) {
            return null;
        }

        if (segment.includes('.')) {
            const isLastSegment = index === segments.length - 1;

            if (!isLastSegment || !isValidIPv4Address(segment)) {
                return null;
            }

            total += 2;
            continue;
        }

        if (!/^[0-9a-fA-F]{1,4}$/.test(segment)) {
            return null;
        }

        total += 1;
    }

    return total;
};

const isValidIPv6Address = (ip) => {
    if (!ip.includes(':') || ip.includes(':::')) {
        return false;
    }

    const doubleColonParts = ip.split('::');

    if (doubleColonParts.length > 2) {
        return false;
    }

    const headSegments = doubleColonParts[0] ? doubleColonParts[0].split(':') : [];
    const tailSegments = doubleColonParts.length === 2 && doubleColonParts[1]
        ? doubleColonParts[1].split(':')
        : [];

    const headCount = countIPv6Segments(headSegments);
    const tailCount = countIPv6Segments(tailSegments);

    if (headCount === null || tailCount === null) {
        return false;
    }

    // Without "::" we need exactly 8 hextets. With "::" the compressed gap must
    // stand in for at least one missing segment.
    if (doubleColonParts.length === 1) {
        return headCount === 8;
    }

    return headCount + tailCount < 8;
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
 * Check if an IP address is valid (IPv4 or IPv6 including compressed forms)
 */
export const isValidIP = (ip) => {
    if (isValidIPv4Address(ip)) {
        return true;
    }

    return isValidIPv6Address(ip);
};

/**
 * Check if IP is private (IPv4 only — IPv6 private ranges are not checked)
 */
export const isPrivateIP = (ip) => {
    // Only check IPv4 private ranges — skip IPv6
    if (ip.includes(':')) return false;
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4) return false;
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 127) return true;
    return false;
};
