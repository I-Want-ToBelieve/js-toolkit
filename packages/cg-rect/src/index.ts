import { CGPoint, CGPointValue } from "@core-graphics/point"
import { CGSize, CGSizeValue } from "@core-graphics/size"

export type CGRectValue = CGPointValue & CGSizeValue

type CGRectPoints = [CGPoint, CGPoint, CGPoint, CGPoint]

/**
 * A structure that contains the location and dimensions of a rectangle.
 */
export class CGRect {
  /**
   * A point that specifies the coordinates of the rectangle’s origin.
   */
  origin: CGPoint
  /**
   * A size that specifies the height and width of the rectangle.
   */
  size: CGSize

  /* -----------------------------------------------------------------------------
   * Creating a Rectangle
   * -----------------------------------------------------------------------------*/

  /**
   * Creates a rectangle with the specified origin and size.
   */
  constructor(value: CGRectValue) {
    this.origin = new CGPoint(value)
    this.size = new CGSize(value)
  }

  /**
   * Creates a rectangle from an HTML element
   */
  static fromElement = (el: HTMLElement) => {
    return new CGRect(el.getBoundingClientRect())
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

    return new CGRect({ x, y, width, height })
  }

  /* -----------------------------------------------------------------------------
   * Special Values
   * -----------------------------------------------------------------------------*/

  /**
   * The rectangle whose origin and size are both zero.
   */
  static zero = new CGRect({ x: 0, y: 0, width: 0, height: 0 })

  /**
   * Creates a rectangle with origin (0,0) and size (0,0).
   */
  static init = () => {
    return new CGRect(CGRect.zero)
  }

  /**
   * Returns a string representation of the rect
   */
  toString = () => {
    return JSON.stringify(this)
  }

  /**
   * Returns the JSON representation of the rect
   */
  toJSON = () => {
    return Object.assign({}, this.origin.value, this.size.value)
  }

  /* -----------------------------------------------------------------------------
   * Geometric Properties
   * -----------------------------------------------------------------------------*/

  get x() {
    return this.origin.x
  }

  get y() {
    return this.origin.y
  }

  get width() {
    return this.size.width
  }

  get height() {
    return this.size.height
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
  get centerPoint() {
    return new CGPoint({ x: this.midX, y: this.midY })
  }

  get topLeftPoint() {
    return new CGPoint({ x: this.minX, y: this.minY })
  }

  get topRightPoint() {
    return new CGPoint({ x: this.maxX, y: this.minY })
  }

  get bottomLeftPoint() {
    return new CGPoint({ x: this.minX, y: this.maxY })
  }

  get bottomRightPoint() {
    return new CGPoint({ x: this.maxX, y: this.maxY })
  }

  /**
   * Returns the co-ordinates of the rectangle corners/edges
   */
  get cornerPoints(): CGRectPoints {
    return [
      this.topLeftPoint,
      this.topRightPoint,
      this.bottomRightPoint,
      this.bottomLeftPoint,
    ]
  }

  get topCenterPoint() {
    return new CGPoint({ x: this.midX, y: this.minY })
  }

  get rightCenterPoint() {
    return new CGPoint({ x: this.maxX, y: this.midY })
  }

  get bottomCenterPoint() {
    return new CGPoint({ x: this.midX, y: this.maxY })
  }

  get leftCenterPoint() {
    return new CGPoint({ x: this.minX, y: this.midY })
  }

  /**
   * Returns the mid-point values of the rectangle's edges
   */
  get midPoints(): CGRectPoints {
    return [
      this.topCenterPoint,
      this.rightCenterPoint,
      this.bottomCenterPoint,
      this.leftCenterPoint,
    ]
  }

  /**
   * Returns whether the rectangle is empty
   */
  get isEmpty() {
    return this.size.isEmpty
  }

  /**
   * Returns the coordinates that establish the edges of a rectangle.
   */
  get edges() {
    return {
      top: [this.topLeftPoint, this.topRightPoint],
      right: [this.topRightPoint, this.bottomRightPoint],
      bottom: [this.bottomLeftPoint, this.bottomRightPoint],
      left: [this.topLeftPoint, this.bottomLeftPoint],
    }
  }

  /* -----------------------------------------------------------------------------
   * Geometric Operations
   * -----------------------------------------------------------------------------*/

  /**
   * Returns a new CGrectangle with edges moved outwards by the given delta.
   */
  inflate = (delta: number) => {
    this.origin.add({ x: delta, y: delta })
    this.size.set({
      width: this.width - 1 * delta,
      height: this.height - 1 * delta,
    })
    return this
  }

  /**
   * Returns a new CGrectangle with its origin shifted by the specified delta
   */
  shift = (delta: { dx: number | undefined; dy: number | undefined }) => {
    const { dx = 0, dy = 0 } = delta
    this.origin.add({ x: dx, y: dy })
    return this
  }

  /**
   * Returns the rect with values rounded to nearest pixel value.
   */
  pixelAlign = () => {
    const x = Math.round(this.x)
    const y = Math.round(this.y)

    const rectMaxX = Math.round(this.x + this.width)
    const rectMaxY = Math.round(this.y + this.height)

    const width = Math.max(rectMaxX - x, 0)
    const height = Math.max(rectMaxY - y, 0)

    this.origin.set({ x, y })
    this.size.set({ width, height })
    return this
  }

  /* -----------------------------------------------------------------------------
   * Geometric Assertions
   * -----------------------------------------------------------------------------*/

  /**
   * Returns whether two CGRects are equal
   */
  static isEqual = (a: CGRect | undefined, b: CGRect | undefined) => {
    if (!a || !b) return false
    return a.origin.isEqual(b.origin) && a.size.isEqual(b.size)
  }

  /**
   * Returns whether two CGRects overlaps horizontally
   */
  static overlapsHorizontally = (rectA: CGRect, rectB: CGRect) => {
    const aMax = rectA.maxX
    const bMax = rectB.maxX
    return aMax > rectB.x && bMax > rectA.x
  }

  /**
   * Returns whether two CGRects overlaps vertically
   */
  static overlapsVertically = (rectA: CGRect, rectB: CGRect) => {
    const aMax = rectA.maxY
    const bMax = rectB.maxY
    return aMax > rectB.y && bMax > rectA.y
  }

  /**
   * Returns whether two CGRects overlaps
   */
  static overlaps = (rectA: CGRect, rectB: CGRect) => {
    return (
      CGRect.overlapsHorizontally(rectA, rectB) ||
      CGRect.overlapsVertically(rectA, rectB)
    )
  }

  /**
   * Returns whether this rect is equal to the given rect
   */
  isEqual = (rect: CGRect) => {
    return CGRect.isEqual(this, rect)
  }

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
  containsRect = (rect: CGRect) => {
    for (const point of rect.cornerPoints) {
      if (!this.containsPoint(point)) {
        return false
      }
    }
    return true
  }

  /**
   * Checks if a rectangle interesects another rectangle
   */
  intersects = (rect: CGRect) => {
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

  overlaps = (rect: CGRect) => {
    return CGRect.overlaps(this, rect)
  }

  /* -----------------------------------------------------------------------------
   * Validation
   * -----------------------------------------------------------------------------*/
  static is(value: any): value is CGRect {
    return typeof value === "object" && CGSize.is(value) && CGPoint.is(value)
  }
}
