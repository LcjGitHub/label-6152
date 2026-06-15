/**
 * 获取 URL 查询参数值
 * @param searchParams - URLSearchParams 实例
 * @param key - 参数键名
 * @param defaultValue - 默认值，参数不存在时返回
 */
export function getSearchParam(
  searchParams: URLSearchParams,
  key: string,
  defaultValue = '',
): string {
  const value = searchParams.get(key);
  return value ?? defaultValue;
}

/**
 * 设置 URL 查询参数值
 * @param searchParams - URLSearchParams 实例
 * @param key - 参数键名
 * @param value - 参数值，空值或仅含空白字符时移除该参数
 */
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

/**
 * 删除 URL 查询参数
 * @param searchParams - URLSearchParams 实例
 * @param key - 要删除的参数键名
 */
export function deleteSearchParam(
  searchParams: URLSearchParams,
  key: string,
): URLSearchParams {
  const nextParams = new URLSearchParams(searchParams);
  nextParams.delete(key);
  return nextParams;
}
