/**
 * Converts JSON Forms date-time string values to Date instances for PrimeVue DatePicker.
 */
export function jsonFormsDateTimeToDate(value: unknown): Date | null {
  if (value == null || value === '') {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}
