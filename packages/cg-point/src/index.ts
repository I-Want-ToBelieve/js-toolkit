export type CGPointValue = {
  x: number
  y: number
}

/**
 * A utility class for representing two-dimensional positions.
 */
export class CGPoint {
  /**
   * The x-coordinate of the point.
   */
  x: number
  /**
   * The y-coordinate of the point.
   */
  y: number

  /* -----------------------------------------------------------------------------
   *  Creating a Point
   * -----------------------------------------------------------------------------*/

  /**
   * Creates a point with the specified `x` and `y` values.
   */
  constructor(value: CGPointValue) {
    this.x = value.x
    this.y = value.y
  }

  /**
   * Creates a point from a DOM touch event
   */
  static fromTouchEvent = (
    event: TouchEvent,
    pointType: DOMPointType = "page",
  ) => {
    const primaryTouch = event.touches[0] || event.changedTouches[0]
    const point = primaryTouch || { [`${pointType}X`]: 0, [`${pointType}Y`]: 0 }

    return new CGPoint({
      x: point[`${pointType}X`],
      y: point[`${pointType}Y`],
    })
  }

  /**
   * Creates a point from a DOM mouse event
   */
  static fromMouseEvent = (
    event: MouseEvent | PointerEvent,
    pointType: DOMPointType = "page",
  ) => {
    return new CGPoint({
      x: event[`${pointType}X`],
      y: event[`${pointType}Y`],
    })
  }

  /**
   * Creates a point from a pointer event
   */
  static fromPointerEvent = (
    event: DOMPointerEvent,
    pointType: DOMPointType = "page",
  ) => {
    return isTouchEvent(event)
      ? CGPoint.fromTouchEvent(event, pointType)
      : CGPoint.fromMouseEvent(event, pointType)
  }

  /**
   * Creates a point from the JSON string representation of a point.
   * e.g `{ "x": 10, "y": 20 }`
   */
  static fromString = (str: string) => {
    const value = JSON.parse(str)
    if (!CGPoint.is(value)) {
      throw new TypeError("Invalid CGPoint string representation")
    }
    return new CGPoint(value)
  }

  static create(x: number, y: number): CGPoint {
    return new CGPoint({ x, y })
  }

  /* -----------------------------------------------------------------------------
   * Special Values
   * -----------------------------------------------------------------------------*/

  /**
   * The point with values (0,0).
   */
  static zero = new CGPoint({ x: 0, y: 0 })

  /**
   * Creates a point with location (0,0).
   */
  static init = () => {
    return new CGPoint(CGPoint.zero)
  }

  /**
   * The point details as an object
   */
  get value(): CGPointValue {
    return { x: this.x, y: this.y }
  }

  /**
   * Returns a string representation of the point
   */
  toString = () => {
    return JSON.stringify(this.value)
  }

  /**
   * Returns a string representation of the point
   */
  toJSON = () => {
    return this.value
  }

  /* -----------------------------------------------------------------------------
   * Geometric Methods - Static
   * -----------------------------------------------------------------------------*/

  /**
   * Returns a the distance between two points
   */
  static distance = (a: CGPoint | CGPointValue, b: CGPoint | CGPointValue) => {
    const deltaX = Math.abs(a.x - b.x)
    const deltaY = Math.abs(a.y - b.y)
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }

  /**
   * Returns a function used to check the closest point
   * from a list of points
   */
  static closest = (...points: CGPointValue[]) => {
    return (pointToCheck: CGPointValue) => {
      const distances = points.map((point) =>
        CGPoint.distance(point, pointToCheck),
      )
      const closestDistance = Math.min(...distances)
      const index = distances.indexOf(closestDistance)
      return points[index]
    }
  }

  /**
   * Returns the angle between two points
   */
  static angle = (a: CGPoint, b: CGPoint) => {
    return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI - 90
  }

  /**
   * Returns the center point between two points
   */
  static center = (a: CGPoint, b: CGPoint) => {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    }
  }

  /**
   * Returns whether two points are equal
   */
  static isEqual = (a: CGPoint, b: CGPoint) => {
    return a.x === b.x && a.y === b.y
  }

  /* -----------------------------------------------------------------------------
   * Geometric Methods - Instance
   * -----------------------------------------------------------------------------*/

  /**
   * Returns the distance to another point
   */
  distance = (point = CGPoint.zero) => {
    return CGPoint.distance(this, point)
  }

  /**
   * Returns a point coordinates relative to a DOM element
   */
  relativeToNode = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const { width, height } = rect

    const left = rect.left - el.clientLeft + el.scrollLeft
    const top = rect.top - el.clientTop + el.scrollTop

    const x = this.x - left
    const y = this.y - top

    return {
      point: new CGPoint({ x, y }),
      progress: { x: x / width, y: y / height },
    }
  }

  /**
   * Returns whether `this` point is equal to another point
   */
  isEqual = (point: CGPoint) => {
    return CGPoint.isEqual(this, point)
  }

  /* -----------------------------------------------------------------------------
   * Gemotric Operations
   * -----------------------------------------------------------------------------*/

  /**
   * Sets the x and y values of the point
   */
  set = (point: CGPointValue) => {
    this.x = point.x
    this.y = point.y
    return this
  }

  /**
   * Returns the negated version of the point
   */
  negate = () => {
    this.x = -this.x
    this.y = -this.y
    return this
  }

  /**
   * Adds multiple points to `this` point
   */
  add = (...points: CGPointValue[]) => {
    points.forEach((point) => {
      this.x += point.x
      this.y += point.y
    })
    return this
  }

  /**
   * Substract another point from `this` point
   */
  subtract = (point: CGPoint) => {
    return this.add(point.negate())
  }

  /**
   * Mulitply `this` point by a scalar
   */
  multiply = (value: number) => {
    this.x *= value
    this.y *= value
    return this
  }

  /**
   * Divides `this` point by a scalar
   */
  divide = (value: number) => {
    this.x /= value
    this.y /= value
    return this
  }

  /**
   * Rounds the point coordinates to the nearest pixel (integer)
   */
  pixelAlign = () => {
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
    return this
  }

  /* -----------------------------------------------------------------------------
   * Validation
   * -----------------------------------------------------------------------------*/
  static is(value: any): value is CGPointValue {
    return typeof value === "object" && "x" in value && "y" in value
  }
}

function isTouchEvent(event: unknown): event is TouchEvent {
  if (
    typeof window !== "undefined" &&
    window.TouchEvent &&
    event instanceof window.TouchEvent
  ) {
    return true
  }

  return (
    typeof event === "object" &&
    Object.prototype.hasOwnProperty.call(event, "touches")
  )
}

type DOMPointType = "page" | "client"

type DOMPointerEvent = MouseEvent | TouchEvent | PointerEvent
