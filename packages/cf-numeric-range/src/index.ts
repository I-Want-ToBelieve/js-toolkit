type RangeTuple = [min: number, max: number]

type FromValuesOptions = {
  min: number
  max: number
  values: number[]
}

export interface CFNumericRangeOptions {
  min?: number
  max?: number
  precision?: number
  step?: number
  value?: string | number
}

/**
 * Class to manage the lower and upper boundary of a target value
 */
export class CFNumericRange {
  /**
   * The mininum value of the range
   */
  min: number

  /**
   * The maximum value of the range
   */
  max: number

  /**
   * The precision or decimal count of the range's value
   */
  precision: number | undefined

  /**
   * The step value of the range
   */
  step: number

  /**
   * The precision of the range's step
   */
  private stepPrecision: number

  /**
   * The `value` of the range
   */
  value: string | number

  /* -----------------------------------------------------------------------------
   * Creating a numeric range
   * -----------------------------------------------------------------------------*/

  /**
   * Initializes a new instance of the NumericRange class
   */
  constructor(private options: CFNumericRangeOptions) {
    const { min = 0, max = 100, precision, step = 1, value = 0 } = options

    if (max < min) {
      throw new RangeError("clamp: max cannot be less than min")
    }

    this.min = min
    this.max = max
    this.value = value

    this.precision = precision
    this.step = step
    this.stepPrecision = countDecimals(step)
  }

  /**
   * Creates a range based on the specified `[min, max]` tuple
   */
  static fromTuple = (tuple: RangeTuple) => {
    const [min, max] = tuple
    return new CFNumericRange({ min, max })
  }

  /**
   * Creates a range from the specified min and max (passed as arguments)
   */
  static create = (min: number, max: number, value?: string | number) => {
    return new CFNumericRange({ min, max, value })
  }

  /**
   * Creates an array of the ranges from array of values
   */
  static fromValues = (options: FromValuesOptions) => {
    const { values, min, max } = options

    return values
      .map((value, i) => [values[i - 1] ?? min, values[i + 1] ?? max, value])
      .map(([min, max, value]) => new CFNumericRange({ min, max, value }))
  }

  /**
   * Creates a numeric range from a percent value
   */
  static fromPercent = (
    percent: number,
    options: { min?: number; max?: number },
  ) => {
    const { min = 0, max = 100 } = options
    const value = (max - min) * percent + min
    return new CFNumericRange({ min, max, value })
  }

  /**
   * Creates a new numeric range with the same values
   */
  clone = () => {
    return new CFNumericRange(this)
  }

  /**
   * Creates a new range instance with new options
   */
  withOptions = (options: Partial<CFNumericRangeOptions>) => {
    return new CFNumericRange({ ...this.options, ...options })
  }

  /* -----------------------------------------------------------------------------
   * Special Values and Methods
   * -----------------------------------------------------------------------------*/

  /**
   * Converts the range value to number
   */
  valueOf = () => {
    return CFNumericRange.parse(this.value)
  }

  /**
   * Returns the range value as string (rounded to the maximum precision)
   */
  toString = () => {
    const num = this.valueOf()
    return toFixed(num, this.computedPrecision)
  }

  /**
   * Returns the JSON representation of the range
   */
  toJSON = () => {
    const { min, max, value } = this
    return { min, max, value }
  };

  /**
   * Converts numeric range to iterable to support `for..of` loop,
   * spread operator, and `Array.from(...)`
   */
  *[Symbol.iterator]() {
    let current = this.min
    while (current <= this.max) {
      yield current
      current += this.step
    }
  }

  /* -----------------------------------------------------------------------------
   * Numeric range Properties
   * -----------------------------------------------------------------------------*/

  /**
   * Whether the `value` is within the `min` and `max`
   */
  get isInRange() {
    if (this.value === "") return true
    const num = this.valueOf()
    return num <= this.max && num >= this.min
  }

  /**
   * Whether the `value` is at `min`
   */
  get isAtMin() {
    return this.valueOf() === this.min
  }

  /**
   * Whether the `value` is at `max`
   */
  get isAtMax() {
    return this.valueOf() === this.max
  }

  /**
   * Get the decimal count of the range's value
   */
  private get computedPrecision() {
    const num = this.valueOf()

    const precision = Number.isNaN(num)
      ? this.stepPrecision
      : Math.max(countDecimals(num), this.stepPrecision)

    return this.precision ?? precision
  }

  /**
   * Converts a string value to a number and strips letters
   */
  static parse = (value: string | number) => {
    return parseFloat(value.toString().replace(/[^\w.-]+/g, ""))
  }

  /**
   * Returns a transformed value given the input and output range tuples
   */
  static transform = (inputTuple: RangeTuple, outputTuple: RangeTuple) => {
    const input = CFNumericRange.fromTuple(inputTuple)
    const output = CFNumericRange.fromTuple(outputTuple)

    return (value: number) => {
      if (input.min === input.max || output.min === output.max) {
        return output.min
      }
      const ratio = (output.max - output.min) / (input.max - input.min)
      return output.min + ratio * (value - input.min)
    }
  }

  /* -----------------------------------------------------------------------------
   * Numeric Range Methods
   * -----------------------------------------------------------------------------*/

  /**
   * Sets the `value` of the range
   */
  setValue = (value: string | number) => {
    this.value = value
    return this
  }

  /**
   * Sets the step value of the range
   */
  setStep = (step: number) => {
    this.step = step
    return this
  }

  /**
   * Sets the value to the minimum value of the range
   */
  setToMin = () => {
    this.value = this.min.toString()
    return this
  }

  /**
   * Sets the value to the maximum value of the range
   */
  setToMax = () => {
    this.value = this.max.toString()
    return this
  }

  /**
   * Converts the value to a percentage value between the `min` and `max`
   */
  toPercent = () => {
    return ((this.valueOf() - this.min) * 100) / (this.max - this.min)
  }

  /**
   * Ensures the value is within the range
   */
  clamp = () => {
    let value: number | null = this.valueOf()
    value = Math.min(Math.max(value, this.min), this.max)
    this.value = toFixed(value, this.precision)
    return this
  }

  toPrecision = () => {
    this.value = toFixed(this.valueOf(), this.computedPrecision)
    return this
  }

  /**
   * Increments the range's value by the specified step
   */
  increment = (step = this.step) => {
    if (this.value === "") {
      this.value = CFNumericRange.parse(step)
    } else {
      this.value = this.valueOf() + step
    }
    return this
  }

  /**
   * Decrements the range's value by the specified step
   */
  decrement = (step = this.step) => {
    if (this.value === "") {
      this.value = CFNumericRange.parse(-step)
    } else {
      this.value = this.valueOf() - step
    }
    return this
  }

  /**
   * Rounds the value to the nearest step
   */
  snapToStep = () => {
    const value = this.valueOf()
    const nextValue = Math.round(value / this.step) * this.step
    const precision = this.stepPrecision
    this.value = toFixed(nextValue, precision)
    return this
  }

  /**
   * Resets the range values to the initial
   */
  reset = () => {
    const { value = 0, step = 1, min = 0, max = 100, precision } = this.options
    Object.assign(this, { value, step, min, max, precision })
    return this
  }
}

function countDecimals(value: number) {
  if (!isNumeric(value)) return 0

  let e = 1
  let p = 0
  while (Math.round(value * e) / e !== value) {
    e *= 10
    p += 1
  }
  return p
}

function isNumeric(value: unknown): value is number {
  return (
    typeof value === "number" || !Number.isNaN(value) || Number.isFinite(value)
  )
}

function toFixed(value: number, decimals?: number) {
  // clean value
  value = Number.parseFloat(value.toString())
  value = isNumeric(value) ? value : 0

  // compute decimals
  let nextValue: string | number = value
  const scaleFactor = 10 ** (decimals ?? 10)
  nextValue = Math.round(nextValue * scaleFactor) / scaleFactor

  return decimals ? nextValue.toFixed(decimals) : nextValue.toString()
}
