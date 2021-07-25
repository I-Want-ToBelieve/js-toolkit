import { CFNumericRange } from "../src"

test("should return percent of value in a specific range", () => {
  const percent = new CFNumericRange({
    min: 0,
    max: 10,
    value: 5,
  }).toPercent()
  expect(percent).toStrictEqual(50)
})

test("should return value of percent in a specific range", () => {
  const value = CFNumericRange.fromPercent(500, { min: 0, max: 10 })
  expect(+value).toStrictEqual(5000)
})

test("should clamp value to specified minimum", () => {
  const value = new CFNumericRange({ min: 6, max: 10, value: 5 }).clamp()
  expect(+value).toStrictEqual(6)
})

describe("should get next value of value after specified step", () => {
  test("with both even from & step", () => {
    const snap = (value: number) =>
      new CFNumericRange({ value, step: 2 }).snapToStep().toString()

    expect(snap(4)).toStrictEqual("4")
    expect(snap(5)).toStrictEqual("6")
    expect(snap(6)).toStrictEqual("6")
  })
  test("with both odd from & step", () => {
    const snap = (value: number) =>
      new CFNumericRange({ value, step: 5 }).snapToStep().toString()

    expect(snap(3)).toStrictEqual("5")
    expect(snap(4)).toStrictEqual("5")
    expect(snap(5)).toStrictEqual("5")
    expect(snap(6)).toStrictEqual("5")
    expect(snap(7)).toStrictEqual("5")
    expect(snap(8)).toStrictEqual("10")
  })
  test("with odd from and even step", () => {
    const snap = (value: number) =>
      new CFNumericRange({ value, step: 2 }).snapToStep().toString()

    expect(snap(3)).toStrictEqual("4")
    expect(snap(4)).toStrictEqual("4")
    expect(snap(5)).toStrictEqual("6")
    expect(snap(6)).toStrictEqual("6")
  })
})

test("range should be iterable", () => {
  const range = new CFNumericRange({ min: 0, max: 10 })
  expect([...range]).toHaveLength(11)
  expect([...range]).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
})

test("clamps value", () => {
  const range = new CFNumericRange({ min: 0, max: 10, value: 8, step: 4 })
  expect(+range.increment()).toEqual(12)
  expect(+range.increment().clamp()).toEqual(10)
  range.reset()
  range.setStep(0.5)
  expect(+range.decrement()).toEqual(7.5)
})
