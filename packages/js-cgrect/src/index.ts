import { CGPoint, CGPointValue } from "js-cgpoint"

type SizeValue = {
  height: number
  width: number
}

export type RectValue = CGPointValue & SizeValue

type RectPoints = [CGPoint, CGPoint, CGPoint, CGPoint]

/**
 * A structure that contains the location and dimensions of a rectangle.
 */
export class Rect {
  height: number
  width: number
  x: number
  y: number

  /* -----------------------------------------------------------------------------
   * Creating a Rectangle
   * -----------------------------------------------------------------------------*/

  /**
   * Creates a rectangle with the specified origin and size.
   */
  constructor(public value: RectValue) {
    this.height = value.height
    this.width = value.width
    this.x = value.x
    this.y = value.y
  }

  /**
   * Creates a rectangle from an HTML element
   */
  static fromElement = (el: HTMLElement) => {
    return new Rect(el.getBoundingClientRect())
  }

  /**
   * Creates a rectangle from a set of points
   */
  static fromPoints = (...points: CGPoint[]) => {
    const xValues = points.map((point) => point.x)
    const yValues = points.map((point) => point.y)

    const x = Math.min(...xValues)
    const y = Math.min(...yValues)

    const width = Math.max(...xValues) - x
    const height = Math.max(...yValues) - y

    return new Rect({ x, y, width, height })
  }

  /* -----------------------------------------------------------------------------
   * Special Values
   * -----------------------------------------------------------------------------*/

  /**
   * The rectangle whose origin and size are both zero.
   */
  static zero = new Rect({ x: 0, y: 0, width: 0, height: 0 })

  /**
   * Creates a rectangle with origin (0,0) and size (0,0).
   */
  static init = () => {
    return new Rect(Rect.zero)
  }

  /* -----------------------------------------------------------------------------
   * Geometric Properties
   * -----------------------------------------------------------------------------*/

  /**
   * A point that specifies the coordinates of the rectangle’s origin.
   */
  get origin() {
    return new CGPoint({ x: this.x, y: this.y })
  }

  /**
   * A size that specifies the height and width of the rectangle.
   */
  get size() {
    return { width: this.width, height: this.height }
  }

  /**
   * Returns the smallest value for the x-coordinate of the rectangle.
   */
  get minX() {
    return this.x
  }

  /**
   * Returns the x-coordinate that establishes the center of a rectangle.
   */
  get midX() {
    return this.x + this.width / 2
  }

  /**
   * Returns the largest value of the x-coordinate for the rectangle.
   */
  get maxX() {
    return this.x + this.width
  }

  /**
   * Returns the smallest value for the y-coordinate of the rectangle.
   */
  get minY() {
    return this.y
  }

  /**
   * Returns the y-coordinate that establishes the center of the rectangle.
   */
  get midY() {
    return this.y + this.height / 2
  }

  /**
   * Returns the largest value for the y-coordinate of the rectangle.
   */
  get maxY() {
    return this.y + this.height
  }

  /**
   * Returns the center point (x, y) of the rectangle
   */
  get center() {
    return new CGPoint({ x: this.midX, y: this.midY })
  }

  /**
   * Returns the co-ordinates of the rectangle corners/edges
   */
  get corners(): RectPoints {
    return [
      new CGPoint({ x: this.minX, y: this.minY }),
      new CGPoint({ x: this.minX, y: this.maxY }),
      new CGPoint({ x: this.maxX, y: this.minY }),
      new CGPoint({ x: this.maxX, y: this.maxY }),
    ]
  }

  /**
   * Returns the mid-point values of the rectangle's edges
   */
  get midPoints(): RectPoints {
    return [
      new CGPoint({ x: this.midX, y: this.minY }),
      new CGPoint({ x: this.maxX, y: this.midY }),
      new CGPoint({ x: this.midX, y: this.maxY }),
      new CGPoint({ x: this.minX, y: this.midY }),
    ]
  }

  /**
   * Returns the aspect ratio of the rectangle
   */
  get aspectRatio() {
    return this.width / this.height
  }

  /**
   * Returns whether the rectangle is empty
   */
  get isEmpty() {
    return this.width === 0 && this.height === 0
  }

  /**
   * Returns the coordinates that establish the edges of a rectangle.
   */
  get edges() {
    return {
      top: [
        new CGPoint({ x: this.x, y: this.y }),
        new CGPoint({ x: this.maxX, y: this.y }),
      ],
      right: [
        new CGPoint({ x: this.maxX, y: this.y }),
        new CGPoint({ x: this.maxX, y: this.maxY }),
      ],
      bottom: [
        new CGPoint({ x: this.x, y: this.maxY }),
        new CGPoint({ x: this.maxX, y: this.maxY }),
      ],
      left: [
        new CGPoint({ x: this.x, y: this.y }),
        new CGPoint({ x: this.x, y: this.maxY }),
      ],
    }
  }

  /* -----------------------------------------------------------------------------
   * Rectangle Transformations and Operations
   * -----------------------------------------------------------------------------*/

  inflate = (value: number) => {
    if (value === 0) return this
    const doubleValue = 2 * value
    Object.assign(this, {
      x: this.x - value,
      y: this.y - value,
      width: this.width + doubleValue,
      height: this.height + doubleValue,
    })
    return this
  }

  inset = (factor: number) => {
    return {
      x: this.x + factor,
      y: this.y + factor,
      width: Math.max(0, this.width - 2 * factor),
      height: Math.max(0, this.height - 2 * factor),
    }
  }

  /**
   * Returns a new rectangle with its origin shifted by the specified delta
   */
  offset = (delta: { dx: number; dy: number }) => {
    const xOffset = typeof delta.dx === "number" ? delta.dx : 0
    const yOffset = typeof delta.dy === "number" ? delta.dy : 0
    this.x += xOffset
    this.y += yOffset
    return this
  }

  multiply = (factor: number) => {
    this.x *= factor
    this.y *= factor
    this.width *= factor
    this.height *= factor
    return this
  }

  divide = (factor: number) => {
    return this.multiply(1 / factor)
  }

  pixelAlign = () => {
    const x = Math.round(this.x)
    const y = Math.round(this.y)

    const rectMaxX = Math.round(this.x + this.width)
    const rectMaxY = Math.round(this.y + this.height)

    const width = Math.max(rectMaxX - x, 0)
    const height = Math.max(rectMaxY - y, 0)

    Object.assign(this, { x, y, width, height })
    return this
  }

  /* -----------------------------------------------------------------------------
   * Checking Characteristics
   * -----------------------------------------------------------------------------*/

  /**
   * Returns whether a rectangle contains a specified point.
   */
  containsPoint = (point: CGPoint) => {
    if (point.x < this.minX) return false
    if (point.x > this.maxX) return false

    if (point.y < this.minY) return false
    if (point.y > this.maxY) return false

    if (Number.isNaN(this.x)) return false
    if (Number.isNaN(this.y)) return false

    return true
  }

  /**
   * Checks if a rectangle contains another rectangle
   */
  containsRect = (rect: Rect) => {
    for (const point of rect.corners) {
      if (!this.containsPoint(point)) {
        return false
      }
    }
    return true
  }

  /**
   * Checks if a rectangle interesects another rectangle
   */
  intersects = (rect: Rect) => {
    return (
      this.x < rect.maxX &&
      this.y < rect.maxY &&
      this.maxX > rect.x &&
      this.maxY > rect.y
    )
  }

  /**
   * Returns the distance of a rect from a point
   */
  distanceFromPoint = (point: CGPoint) => {
    let x = 0
    let y = 0

    if (point.x < this.x) {
      x = this.x - point.x
    } else if (point.x > this.maxX) {
      x = point.x - this.maxX
    }

    if (point.y < this.y) {
      y = this.y - point.y
    } else if (point.y > this.maxY) {
      y = point.y - this.maxY
    }

    const to = new CGPoint({ x, y })
    return CGPoint.distance(to, CGPoint.zero)
  }

  /**
   * Returns a string representation of the rect
   */
  toString = () => {
    return JSON.stringify(this.value)
  }

  static isEqual = (a: Rect | undefined, b: Rect | undefined) => {
    if (!a || !b) return false
    return ["x", "y", "width", "height"].every((key) => a[key] === b[key])
  }

  toOrigin = () => {
    this.x = 0
    this.y = 0
    return this
  }

  setSize = (size: Partial<SizeValue>, lockAspectRatio = false) => {
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
}
