export function isNumber(value: unknown): value is number {
  return typeof value === "number"
}

export function isNumeric(value: unknown): value is number {
  return isNumber(value) || !Number.isNaN(value) || Number.isFinite(value)
}

export function isDecimal(value: string | number) {
  return !Number.isInteger(Number.parseFloat(value.toString()))
}
