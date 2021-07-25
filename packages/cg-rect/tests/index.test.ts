import { CGRect } from "../src"
import { CGPoint } from "@core-graphics/point"

test("should create rect", () => {
  const rect = CGRect.create(0, 0, 100, 100)
  expect(rect).toMatchObject({ x: 0, y: 0, width: 100, height: 100 })
  expect(rect).toMatchObject({
    origin: { x: 0, y: 0 },
    size: { width: 100, height: 100 },
  })
})

test("should create rect from point", () => {
  const rect = CGRect.fromPoints(
    CGPoint.zero,
    { x: 0, y: 50 },
    { x: 10, y: 50 },
    { x: 10, y: 0 },
    { x: 0, y: 0 },
  )
  expect(rect).toMatchObject({ width: 10, height: 50 })
  expect(rect).toMatchInlineSnapshot(`
Object {
  "height": 50,
  "width": 10,
  "x": 0,
  "y": 0,
}
`)

  expect(rect.cornerPoints).toMatchInlineSnapshot(`
Array [
  Object {
    "x": 0,
    "y": 0,
  },
  Object {
    "x": 10,
    "y": 0,
  },
  Object {
    "x": 10,
    "y": 50,
  },
  Object {
    "x": 0,
    "y": 50,
  },
]
`)

  expect(rect.containsPoint({ x: 10, y: 25 })).toBe(true)
})

test("should get the intersection of two rects", () => {
  const rectA = CGRect.create(0, 0, 80, 100)
  const rectB = CGRect.create(60, 20, 50, 45)

  const rect = CGRect.intersection(rectA, rectB)

  expect(rect).toMatchObject({
    x: 60,
    y: 20,
    width: 20,
    height: 45,
  })

  expect(CGRect.intersects(rectA, rectB)).toBeTruthy()
})
