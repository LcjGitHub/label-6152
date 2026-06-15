export function getSearchParam(
  searchParams: URLSearchParams,
  key: string,
  defaultValue = '',
): string {
  const value = searchParams.get(key);
  return value ?? defaultValue;
}

export function setSearchParam(
  searchParams: URLSearchParams,
  key: string,
  value: string,
): URLSearchParams {
  const nextParams = new URLSearchParams(searchParams);
  const trimmed = value.trim();
  if (trimmed) {
    nextParams.set(key, trimmed);
  } else {
    nextParams.delete(key);
  }
  return nextParams;
}

export function deleteSearchParam(
  searchParams: URLSearchParams,
  key: string,
): URLSearchParams {
  const nextParams = new URLSearchParams(searchParams);
  nextParams.delete(key);
  return nextParams;
}

export function buildSearchParams(
  searchParams: URLSearchParams,
  updates: Record<string, string | null | undefined>,
): URLSearchParams {
  const nextParams = new URLSearchParams(searchParams);
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value.trim() === '') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value.trim());
    }
  });
  return nextParams;
}

export function encodeQueryParam(value: string): string {
  return encodeURIComponent(value);
}

export function decodeQueryParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
