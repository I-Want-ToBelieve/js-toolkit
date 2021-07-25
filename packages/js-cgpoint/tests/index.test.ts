import { CGPoint } from "../src"

test("should create a point", () => {
  const point = CGPoint.create(4, 0)
  expect(point.x).toEqual(4)
  expect(point.y).toEqual(0)
  expect(point.value).toEqual({ x: 4, y: 0 })
})
