function normalizePhoneNumber(phone) {
    if (!phone) return "";

    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, "");

    // Remove leading 0 if present (after cleaning)
    if (cleaned.startsWith("0")) {
        cleaned = cleaned.slice(1);
    }

    // If the number starts with 1 and is 11 digits long, strip the 1
    const digits = cleaned.length === 11 && cleaned.startsWith("1")
        ? cleaned.slice(1)
        : cleaned;

    // Now format it as (XXX) XXX-XXXX if it's exactly 10 digits
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    // Return as-is or fallback
    return phone;
}


module.exports = normalizePhoneNumber;