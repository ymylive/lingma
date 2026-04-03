/**
 * 安全的数组访问工具函数，防止崩溃
 */

export function safeMap<T, R>(
  array: T[] | null | undefined,
  callback: (item: T, index: number, array: T[]) => R
): R[] {
  if (!Array.isArray(array)) return [];
  try {
    return array.map(callback);
  } catch (error) {
    console.error('Error in safeMap:', error);
    return [];
  }
}

export function safeFilter<T>(
  array: T[] | null | undefined,
  predicate: (item: T, index: number, array: T[]) => boolean
): T[] {
  if (!Array.isArray(array)) return [];
  try {
    return array.filter(predicate);
  } catch (error) {
    console.error('Error in safeFilter:', error);
    return [];
  }
}

export function safeArrayAccess<T>(
  array: T[] | null | undefined,
  index: number,
  defaultValue?: T
): T | undefined {
  if (!Array.isArray(array) || index < 0 || index >= array.length) {
    return defaultValue;
  }
  return array[index];
}

export function safeJSONParse<T>(
  json: string | null | undefined,
  defaultValue: T
): T {
  if (!json || typeof json !== 'string') return defaultValue;
  try {
    const parsed = JSON.parse(json);
    return parsed ?? defaultValue;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}
