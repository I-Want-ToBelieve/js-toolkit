import { isObject } from "./object"

export function isInputEvent(
  event: unknown,
): event is { target: HTMLInputElement } {
  return (
    event != null &&
    isObject(event) &&
    "target" in event &&
    event.target instanceof HTMLInputElement
  )
}

export function isRightClickEvent(event: unknown) {
  return isMouseEvent(event) && event.button !== 0
}

export function isTouchEvent(event: unknown): event is TouchEvent {
  if (window.TouchEvent && event instanceof window.TouchEvent) return true
  return event != null && isObject(event) && "touches" in event
}

export function isMouseEvent(event: unknown): event is MouseEvent {
  // PointerEvent inherits from MouseEvent so we can't use a straight instanceof check.
  return isPointerEvent(event)
    ? event.pointerType === "mouse"
    : event instanceof MouseEvent
}

export function isMultiTouchEvent(event: unknown) {
  return isTouchEvent(event) && event.touches.length > 1
}

export function isPointerEvent(event: unknown): event is PointerEvent {
  return typeof PointerEvent !== "undefined" && event instanceof PointerEvent
}
