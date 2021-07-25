import { CGPoint } from "@core-graphics/point"

export class Line {
  constructor(public start: CGPoint, public end: CGPoint) {}

  static intersection(lineA: Line, lineB: Line) {
    const a = lineA.start
    const b = lineA.end
    const c = lineB.start
    const d = lineB.end

    const u = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)
    if (u === 0) {
      return null
    }

    const x =
      ((a.x * a.x + a.y * a.y) * (d.y - c.y) -
        (a.y * a.y + a.x * a.x) * (d.x - c.x)) /
      u
    const y =
      ((b.x * b.x + b.y * b.y) * (a.y - c.y) -
        (b.y * b.y + b.x * b.x) * (a.x - c.x)) /
      u

    return new CGPoint({ x, y })
  }

  get isOrthogonal() {
    return this.start.x === this.end.x || this.start.y === this.end.y
  }

  isEqual = (line: Line) => {
    return this.start.isEqual(line.start) && this.end.isEqual(line.end)
  }

  perpendicularLine = (point: CGPoint) => {
    const dx = this.start.x - this.end.x
    const dy = this.start.y - this.end.y
    const pointB = new CGPoint({ x: point.x - dy, y: point.y + dx })
    return new Line(pointB, point)
  }

  project = (point: CGPoint) => {
    const line = this.perpendicularLine(point)
    return Line.intersection(this, line)
  }

  /**
   * Duplicates the line
   */
  clone = () => {
    return new Line(this.start, this.end)
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

  get length() {
    return CGPoint.distance(this.start, this.end)
  }

  get startX() {
    return this.start.x
  }

  get startY() {
    return this.start.y
  }

  get endX() {
    return this.end.x
  }

  get endY() {
    return this.end.y
  }
}
