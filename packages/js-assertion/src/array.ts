export function isArray(value: unknown): value is any[] {
  return Array.isArray(value)
}

export function isArrayEmpty(value: unknown[]): boolean {
  return value.length === 0
}
