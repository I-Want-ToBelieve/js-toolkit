import { CGLine } from "../src"

test("should get line length", () => {
  const line = CGLine.create({ x: 0, y: 0 }, { x: 50, y: 0 })
  expect(line.length).toBe(50)
})
