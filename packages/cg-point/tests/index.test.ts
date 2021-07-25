import { CGPoint } from "../src"

test("should create a point", () => {
  const point = CGPoint.create(4, 0)
  expect(point.x).toEqual(4)
  expect(point.y).toEqual(0)
  expect(point.value).toEqual({ x: 4, y: 0 })
})

test(`returns a new instance of CGPoint(0,0)`, function () {
  expect(CGPoint.zero).toBeInstanceOf(CGPoint)
})

test("returns a point from string representation", () => {
  expect(CGPoint.fromString('{"x":3,"y":5}')).toBeInstanceOf(CGPoint)
  expect(() => CGPoint.fromString('{"random":3}')).toThrow()
})

test("should initialize point", () => {
  expect(CGPoint.init().isEqual(CGPoint.zero)).toBeTruthy()
})

test("should get distance between points", () => {
  expect(CGPoint.distance({ x: 10, y: 0 }, { x: 20, y: 0 })).toEqual(10)
})

test("should get the closest points", () => {
  const getClosest = CGPoint.closest({ x: 20, y: 0 }, { x: 30, y: 0 })
  expect(getClosest({ x: 12, y: 0 })).toEqual({ x: 20, y: 0 })
  expect(getClosest({ x: 28, y: 0 })).toEqual({ x: 30, y: 0 })
})

test("is check", () => {
  expect(CGPoint.is(CGPoint.zero)).toBeTruthy()
  expect(CGPoint.is({ x: 4 })).toBeFalsy()
})

test("should align point pixels", () => {
  const point = CGPoint.create(10.56, 60)
  expect(point.pixelAlign()).toMatchObject({ x: 11, y: 60 })
})

test("should add points", () => {
  const point = CGPoint.zero
  expect(point.add({ x: 10, y: 0 }, { x: 20, y: 0 })).toMatchObject({
    x: 30,
    y: 0,
  })
})
