export const DATE_RANGE_MIN = new Date(2024, 0, 1);

export function dateRangeMax(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
