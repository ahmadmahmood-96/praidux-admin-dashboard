/**
 * This function will return `false` if the provided hostname matches any in the list (live, UAT and QA environments).
 * Otherwise, it will return `true`.
 * 
 * @param hostname - The hostname to check.
 * @returns `false` if the hostname is in the validHostnames list, otherwise `true`.
 */
export function isVisible(): boolean {
  if (typeof window === "undefined" || !window.location?.hostname) {
    return false; // Default to hidden if hostname is unavailable
  }
  const validHostnames = ['www.app.wopla.dk', 'www.uat.wopla.dk', 'www.qa.wopla.dk'];
  return !validHostnames.includes(window.location.hostname);
}