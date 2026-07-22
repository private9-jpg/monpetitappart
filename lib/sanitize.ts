import DOMPurify from "dompurify";

export function sanitizeString(input: string, maxLength = 5000): string {
  const cleaned = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return cleaned.trim().slice(0, maxLength);
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T, maxStringLength = 5000): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitizeString(sanitized[key] as string, maxStringLength) as T[Extract<keyof T, string>];
    }
  }
  return sanitized;
}
