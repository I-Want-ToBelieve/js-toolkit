export type CGSizeValue = {
  height: number
  width: number
}

/**
 * A structure that contains width and height values.
 */
export class CGSize {
  /**
   * The width value.
   */
  width: number

  /**
   * The height value.
   */
  height: number

  /* -----------------------------------------------------------------------------
   * Creating a size
   * -----------------------------------------------------------------------------*/

  constructor(public value: CGSizeValue) {
    this.width = value.width
    this.height = value.height
  }

  /**
   * Creates a Size with width and height values passed as arguments
   */
  static create(width: number, height: number) {
    return new CGSize({ width, height })
  }

  /**
   * Creates a new Size instance with the same values
   */
  clone = () => {
    return new CGSize(this)
  }

  /**
   * Creates a square Size whose width and height are twice the given dimension
   */
  static fromRadius = (radius: number) => {
    return new CGSize({ width: radius * 2, height: radius * 2 })
  }

  /**
   * Creates a square Size whose width and height are the given dimension
   */
  static fromSquare = (dimension: number) => {
    return new CGSize({ width: dimension, height: dimension })
  }

  /**
   * Creates a size from the string representation of a size.
   */
  static fromString = (str: string) => {
    return new CGSize(JSON.parse(str))
  }

  /* -----------------------------------------------------------------------------
   * Special Values
   * -----------------------------------------------------------------------------*/

  /**
   * The size whose width and height are both zero.
   */
  static zero = new CGSize({ width: 0, height: 0 })

  /**
   * Creates a size with zero width and height.
   */
  static init = () => {
    return new CGSize(CGSize.zero)
  }

  /**
   * Returns the string representation of the size.
   */
  toString = () => {
    return JSON.stringify(this.value)
  }

  /**
   * Returns the JSON representation of the size.
   */
  toJSON = () => {
    return this.value
  }

  /* -----------------------------------------------------------------------------
   * Geometric Properties
   * -----------------------------------------------------------------------------*/

  /**
   * The aspect ratio of this size.
   */
  get aspectRatio() {
    return this.width / this.height
  }

  /**
   * The greater of the magnitudes of the width and the height.
   */
  get longestSide() {
    return Math.max(this.width, this.height)
  }

  /**
   * The lesser of the magnitudes of the width and the height.
   */
  get shortestSide() {
    return Math.min(this.width, this.height)
  }

  /**
   * Whether this size encloses a non-zero area.
   */
  get isEmpty() {
    return this.width === 0 && this.height === 0
  }

  /* -----------------------------------------------------------------------------
   * Geometric Operations
   * -----------------------------------------------------------------------------*/

  /**
   * Returns the size with width and height swapped.
   */
  flip = () => {
    const { width, height } = this
    this.width = height
    this.height = width
    return this
  }

  /**
   * Updates the width and height values (or lock aspect ratio) of this size
   */
  set = (size: Partial<CGSizeValue>, lockAspectRatio = false) => {
    let width = size.width != null ? size.width : this.width
    let height = size.height != null ? size.height : this.height

    if (lockAspectRatio) {
      if (size.width == null && size.height != null) {
        width = size.height * this.aspectRatio
      }

      if (size.width != null && size.height == null && this.aspectRatio) {
        height = size.width / this.aspectRatio
      }
    }

    this.width = width
    this.height = height
    return this
  }

  /* -----------------------------------------------------------------------------
   * Geometric Assertions
   * -----------------------------------------------------------------------------*/

  /**
   * Returns whether two sizes are equal.
   */
  static isEqual = (size1: CGSize, size2: CGSize) => {
    return size1.width === size2.width && size1.height === size2.height
  }

  /**
   * Returns whether this size is equal to the given size.
   */
  isEqual = (size: CGSize) => {
    return CGSize.isEqual(this, size)
  }
}
