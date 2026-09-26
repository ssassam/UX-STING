/**
 * Framework-agnostic ref helpers (usable in server components). Typed
 * structurally so this package does not depend on React.
 */
export type RefLike<T> = ((instance: T | null) => void) | { current: T | null } | null | undefined;

export function setRef<T>(ref: RefLike<T>, value: T | null): void {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

/** Combines several refs into a single callback ref. */
export function mergeRefs<T>(...refs: Array<RefLike<T>>): (instance: T | null) => void {
  return (value) => refs.forEach((ref) => setRef(ref, value));
}
