export function isObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value)
}

export function isObjectEmpty(value: unknown) {
  return isObject(value) && Object.keys(value).length === 0
}

export function isRefObject(value: unknown): value is { current: unknown } {
  return isObject(value) && "current" in value
}
