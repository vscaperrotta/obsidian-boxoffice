import type { MovieRating } from "../types/cinevault";

/**
 * Safely execute a function that may throw or return null/undefined.
 * @template T
 * @param {() => T} func - Function to execute safely.
 * @param {T | null} [fallbackValue=null] - Value to return if `func` throws or returns null/undefined.
 * @returns {T | null} The result of `func` or the provided `fallbackValue`.
 */
export function nullSafe<T>(func: () => T, fallbackValue: T | null = null): T | null {
  try {
    const value = func();
    return value === null || value === undefined ? fallbackValue : value;
  } catch (e) {
    console.error('Error: ', e);
    return fallbackValue;
  }
}

/**
 * Normalize various rating formats into a numeric string.
 * Supports formats like "7/10", "85/100", "85%", and decimals using commas.
 * - "x/10" is converted to a value out of 100 (multiplied by 10).
 * - "x/100" returns the numeric part before the slash.
 * - "x%" removes the percent sign.
 * @param {string} rating - Rating string from external sources.
 * @returns {string} Normalized numeric string (e.g. "75", "7.5").
 */
export function formatRating(rating: string): string {
  let value = rating;
  const isPerTen = rating.includes("/10");
  const isPerCent = rating.includes("/100");

  if (isPerTen && !isPerCent) {
    const normalized = value.replace(',', '.');
    const num = parseFloat(normalized);
    if (!isNaN(num) && isFinite(num)) {
      const multiplied = num * 10;
      value = multiplied % 1 === 0 ? String(Math.trunc(multiplied)) : String(multiplied);
    }
  } else if (rating.includes("/") && isPerCent) {
    value = rating.split("/")[0].trim();
  } else if (rating.includes("%")) {
    value = rating.replace("%", "").trim();
  }

  return value;
}

/**
 * Compute the average of an array of rating strings.
 * Uses `formatRating` to normalize values, ignores non-numeric entries.
 * @param {string[]} ratings - Array of rating strings to average.
 * @returns {string} Average as an integer string or one-decimal string; returns "N/A" if no valid ratings.
 */
export function averageRating(ratings: string[]): string {
  const normalizedRatings = ratings.map(formatRating).map(r => parseFloat(r)).filter(r => !isNaN(r) && isFinite(r));
  if (normalizedRatings.length === 0) return "N/A";
  const sum = normalizedRatings.reduce((acc, val) => acc + val, 0);
  const average = sum / normalizedRatings.length;
  return average % 1 === 0 ? String(Math.trunc(average)) : String(average.toFixed(1));
}

/**
 * Render a simple rating bar UI into a parent element using external ratings.
 * @param {HTMLElement} parent - Parent element to which the rating bar will be appended.
 * @param {MovieRating[] | undefined | null} ratings - Array of rating objects with a `Value` property.
 * @param {Object} [options] - Optional classes to customize elements.
 * @param {{barContainer?: string, bar?: string, fill?: string, average?: string}} [options.classes]
 * @returns {{container: HTMLElement, average: string, percentage: number} | null} An object with the container element, average string and percentage number, or `null` when no ratings are provided.
 */
export function renderExternalRatingBar(parent: HTMLElement, ratings: MovieRating[] | undefined | null, options?: {
  classes?: {
    barContainer?: string;
    bar?: string;
    fill?: string;
    average?: string;
  };
}) {
  if (!ratings || ratings.length === 0) return null;

  const ratingBarContainer = parent.createDiv({ cls: "plugin-ratings-bar-container" });
  const ratingBar = ratingBarContainer.createDiv({ cls: "plugin-ratings-bar" });
  const ratingFill = ratingBar.createDiv({ cls: "plugin-ratings-fill" });

  const values = ratings.map((r) => formatRating(r.Value));
  const average = averageRating(values);
  const percentage = parseFloat(average);

  ratingFill.style.width = `${isNaN(percentage) ? 0 : percentage}%`;

  ratingBarContainer.createEl("span", {
    text: `${average}%`,
    cls: "plugin-ratings-average"
  });

  return {
    container: ratingBarContainer,
    average,
    percentage: isNaN(percentage) ? 0 : percentage
  };
}
