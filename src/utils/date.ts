/**
 * Get the current year in the UTC+8 time zone.
 */
export function getUTC8Year(): number {
  return getUTC8Date().getFullYear();
}

/**
 * Get the current date shifted to the UTC+8 time zone.
 */
export function getUTC8Date(): Date {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcTime + 8 * 3600000);
}
