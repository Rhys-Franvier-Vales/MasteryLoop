const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_AVATAR_CHARS = 2_000_000; // roughly a 1.5 MB image once base64-encoded

export const isEmail = (v) => typeof v === "string" && EMAIL_RE.test(v.trim());

// Each validator returns an error message string, or null when the input is fine.
export function validateRegister({ name, email, password } = {}) {
  if (typeof name !== "string" || name.trim().length < 2) return "Name must be at least 2 characters.";
  if (!isEmail(email)) return "Enter a valid email address.";
  if (typeof password !== "string" || password.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export function validateLogin({ email, password } = {}) {
  if (!isEmail(email) || typeof password !== "string" || !password) return "Enter your email and password.";
  return null;
}

export function validateProfileUpdate({ name, email, password, avatar } = {}) {
  if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) return "Name must be at least 2 characters.";
  if (email !== undefined && !isEmail(email)) return "Enter a valid email address.";
  if (password !== undefined && password !== "" && (typeof password !== "string" || password.length < 8))
    return "New password must be at least 8 characters.";
  if (avatar !== undefined && avatar !== "") {
    if (typeof avatar !== "string" || !avatar.startsWith("data:image/")) return "Profile photo must be an image.";
    if (avatar.length > MAX_AVATAR_CHARS) return "Profile photo is too large (max about 1.5 MB).";
  }
  return null;
}
