import { CGPoint, CGPointValue, CGOffsetValue } from "@core-graphics/point"

/**
 * The class that provides a two-dimensional vector.
 */
export class CGLine {
  /* -----------------------------------------------------------------------------
   * Create Line
   * -----------------------------------------------------------------------------*/

  constructor(public start: CGPoint, public end: CGPoint) {}

  /**
   * Returns a line from start and end point values
   */
  static create(start: CGPointValue, end: CGPointValue) {
    return new CGLine(new CGPoint(start), new CGPoint(end))
  }

  /**
   * Creates a line from its string representation.
   */
  static fromString(str: string) {
    const value = JSON.parse(str)
    if (!(value instanceof CGLine)) {
      throw new TypeError("CGLine.fromString: Invalid value")
    }
    return new CGLine(value.start, value.end)
  }

  /**
   * Duplicates the line
   */
  clone = () => {
    return new CGLine(this.start, this.end)
  }

  /* -----------------------------------------------------------------------------
   * Special Values or Methods
   * -----------------------------------------------------------------------------*/

  toString = () => {
    return JSON.stringify(this.toJSON())
  }

  toJSON = () => {
    return { start: this.start.toJSON(), end: this.end.toJSON() }
  }

  /* -----------------------------------------------------------------------------
   * Geometric Methods
   * -----------------------------------------------------------------------------*/

  static intersection(lineA: CGLine, lineB: CGLine) {
    const a = lineA.start
    const b = lineA.end
    const c = lineB.start
    const d = lineB.end

    const u = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)
    if (u === 0) return null

    const x =
      ((a.x ** 2 + a.y ** 2) * (d.y - c.y) -
        (a.y ** 2 + a.x ** 2) * (d.x - c.x)) /
      u

    const y =
      ((b.x ** 2 + b.y ** 2) * (a.y - c.y) -
        (b.y ** 2 + b.x ** 2) * (a.x - c.x)) /
      u

    return new CGPoint({ x, y })
  }

  /**
   * Translates this line by the given offset.
   */
  shift = (offset: CGOffsetValue) => {
    const { dx, dy } = offset

    this.start.x += dx
    this.start.y += dy

    this.end.x += dx
    this.end.y += dy

    return this
  }

  /**
   * Returns true if the given line is the same as this line.
   */
  isEqual = (line: CGLine) => {
    return this.start.isEqual(line.start) && this.end.isEqual(line.end)
  }

  /**
   * Set the start points of the Line in local coordinate space
   */
  setStart = (start: CGPoint) => {
    this.start = start
    return this
  }

  /**
   * Set the end points of the Line in local coordinate space
   */
  setEnd = (end: CGPoint) => {
    this.end = end
    return this
  }

  /* -----------------------------------------------------------------------------
   * Geomtric Properties
   * -----------------------------------------------------------------------------*/

  /**
   * The length of the line.
   */
  get length() {
    return CGPoint.distance(this.start, this.end)
  }

  /**
   * The x-coordinate of the line's start point.
   */
  get startX() {
    return this.start.x
  }

  /**
   * The y-coordinate of the line's start point.
   */
  get startY() {
    return this.start.y
  }

  /**
   * The x-coordinate of the line's end point.
   */
  get endX() {
    return this.end.x
  }

  /**
   * The y-coordinate of the line's end point.
   */
  get endY() {
    return this.end.y
  }

  /**
   * The horizontal component of the line's vector.
   */
  get dx() {
    return this.end.x - this.start.x
  }

  /**
   * The vertical component of the line's vector.
   */
  get dy() {
    return this.end.y - this.start.y
  }

  /**
   * The angle of the line.
   */
  get angle() {
    return CGPoint.angle(this.start, this.end)
  }
}
