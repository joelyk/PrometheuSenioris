import crypto from "node:crypto";

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value) {
  const normalized = String(value || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function sign(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAdminSessionToken(secret, ttlHours = 12) {
  const expiresAt = Date.now() + Math.max(1, ttlHours) * 60 * 60 * 1000;
  const payload = base64UrlEncode(JSON.stringify({ role: "admin", exp: expiresAt }));
  const signature = sign(payload, secret);
  return {
    token: `${payload}.${signature}`,
    expiresAt: new Date(expiresAt).toISOString()
  };
}

export function verifyAdminSessionToken(token, secret) {
  if (!token || !secret) return { valid: false };

  const [payload, signature] = String(token).split(".");
  if (!payload || !signature) return { valid: false };
  if (sign(payload, secret) !== signature) return { valid: false };

  try {
    const decoded = JSON.parse(base64UrlDecode(payload));
    if (!decoded?.exp || Date.now() > Number(decoded.exp)) {
      return { valid: false };
    }

    return {
      valid: decoded.role === "admin",
      expiresAt: new Date(Number(decoded.exp)).toISOString()
    };
  } catch (_error) {
    return { valid: false };
  }
}
