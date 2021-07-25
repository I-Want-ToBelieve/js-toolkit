import { CGSize } from "../src"

test("should create a size", () => {
  const size = CGSize.create(10, 5)
  expect(size).toMatchObject({ width: 10, height: 5 })

  expect(size.longestSide).toBe(10)
  expect(size.shortestSide).toBe(5)

  expect(size.aspectRatio).toEqual(2)
  expect(size.flip()).toMatchObject({ width: 5, height: 10 })
})

test("should create size from radius", () => {
  expect(CGSize.fromRadius(4)).toMatchObject({ width: 8, height: 8 })
  expect(CGSize.fromSquare(10)).toMatchObject({ width: 10, height: 10 })
})

test("should update size", () => {
  const size = CGSize.create(10, 5)
  size.set({ width: 20, height: 10 })
  expect(size).toMatchObject({ width: 20, height: 10 })
})

test("should update size with aspectRatio lock", () => {
  const size = CGSize.create(10, 5)
  size.set({ width: 20 }, true)
  expect(size).toMatchObject({ width: 20, height: 10 })
})
