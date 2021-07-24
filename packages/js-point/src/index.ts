import { isTouchEvent } from "js-assertion/dom-event"

export type DOMPointType = "page" | "client"

export type PointDelta = {
  dx: number
  dy: number
}

export type AnyPointerEvent = MouseEvent | TouchEvent | PointerEvent

export type PointValue = {
  x: number
  y: number
}

/**
 * A structure that contains a point in a two-dimensional coordinate system.
 */
export class Point {
  /**
   * The x-coordinate of the point.
   */
  x: number
  /**
   * The y-coordinate of the point.
   */
  y: number

  /**
   * Creates a point with the specified `x` and `y` values.
   */
  constructor(point: PointValue) {
    this.x = point.x
    this.y = point.y
  }

  /**
   * Returns a point instance from a touch event
   */
  static fromTouchEvent = (
    event: TouchEvent,
    pointType: DOMPointType = "page",
  ) => {
    const primaryTouch = event.touches[0] || event.changedTouches[0]
    const point = primaryTouch || { [`${pointType}X`]: 0, [`${pointType}Y`]: 0 }

    return new Point({
      x: point[`${pointType}X`],
      y: point[`${pointType}Y`],
    })
  }

  /**
   * Returns a point instance from a mouse event
   */
  static fromMouseEvent = (
    event: MouseEvent | PointerEvent,
    pointType: DOMPointType = "page",
  ) => {
    return new Point({
      x: event[`${pointType}X`],
      y: event[`${pointType}Y`],
    })
  }

  /**
   * Returns a point instance from a pointer event
   */
  static fromPointerEvent = (
    event: AnyPointerEvent,
    pointType: DOMPointType = "page",
  ) => {
    return isTouchEvent(event)
      ? Point.fromTouchEvent(event, pointType)
      : Point.fromMouseEvent(event, pointType)
  }

  /**
   * Returns a the distance between two points
   */
  static distance = (a: Point, b: Point) => {
    const deltaX = Math.abs(a.x - b.x)
    const deltaY = Math.abs(a.y - b.y)
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }

  /**
   * The point with values (0,0).
   */
  static zero = new Point({ x: 0, y: 0 })

  /**
   * Returns a function used to check the closest point
   * from a list of points
   */
  static closest = (...points: Point[]) => {
    return (pointToCheck: Point) => {
      const distances = points.map((point) =>
        Point.distance(point, pointToCheck),
      )
      const closestDistance = Math.min(...distances)
      return distances.indexOf(closestDistance)
    }
  }

  /**
   * Returns the angle between two points
   */
  static angle = (a: Point, b: Point) => {
    return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI - 90
  }

  /**
   * Returns a the distance from another point
   */
  distance = (point?: Point) => {
    return Point.distance(this, point ?? Point.zero)
  }

  /**
   * Returns a point coordinates relative to an HTMLELement
   */
  relativeToNode = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const { width, height } = rect

    const left = rect.left - el.clientLeft + el.scrollLeft
    const top = rect.top - el.clientTop + el.scrollTop

    const x = this.x - left
    const y = this.y - top

    return {
      point: new Point({ x, y }),
      progress: { x: x / width, y: y / height },
    }
  }

  static init = () => {
    return new Point(Point.zero)
  }

  /**
   * The point details as an object
   */
  get value(): PointValue {
    return { x: this.x, y: this.y }
  }

  /**
   * Returns a string representation of the point
   */
  toString = () => {
    return JSON.stringify(this.value)
  }

  static fromString = (str: string) => {
    return new Point(JSON.parse(str))
  }

  static center = (a: Point, b: Point) => {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    }
  }

  static isEqual = (a: Point, b: Point) => {
    return a.x === b.x && a.y === b.y
  }

  negate = () => {
    this.x = -this.x
    this.y = -this.y
    return this
  }

  add = (...points: Point[]) => {
    points.forEach((point) => {
      this.x += point.x
      this.y += point.y
    })
    return this
  }

  subtract = (point: Point) => {
    return this.add(point.negate())
  }

  multiply = (value: number) => {
    this.x *= value
    this.y *= value
    return this
  }

  divide = (value: number) => {
    this.x /= value
    this.y /= value
    return this
  }

  round = () => {
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
    return this
  }
}

export function createPoint(value: PointValue) {
  return new Point(value)
}
