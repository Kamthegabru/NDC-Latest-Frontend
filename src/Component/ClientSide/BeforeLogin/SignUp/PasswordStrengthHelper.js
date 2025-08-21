export function getPasswordStrengthHints(password) {
    const hints = [];

    if (password.length < 8) hints.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) hints.push("Include at least one uppercase letter");
    if (!/[a-z]/.test(password)) hints.push("Include at least one lowercase letter");
    if (!/[0-9]/.test(password)) hints.push("Include at least one number");
    if (!/[^A-Za-z0-9]/.test(password)) hints.push("Include at least one special character (e.g. !@#$%)");

    return hints;
}
