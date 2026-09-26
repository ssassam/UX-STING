import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useControllableState, useDisclosure, useHotkey } from "./index.js";

describe("useControllableState", () => {
  it("works uncontrolled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 1, onChange }));
    act(() => result.current[1]((v) => v + 1));
    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("works controlled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ value: 5, defaultValue: 1, onChange }));
    act(() => result.current[1](6));
    expect(result.current[0]).toBe(5);
    expect(onChange).toHaveBeenCalledWith(6);
  });
});

describe("useDisclosure", () => {
  it("toggles", () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.onToggle());
    expect(result.current.open).toBe(true);
    act(() => result.current.onClose());
    expect(result.current.open).toBe(false);
  });
});

describe("useHotkey", () => {
  it("fires on shortcut but not inside inputs", () => {
    const handler = vi.fn();
    function Demo() {
      useHotkey("ctrl+k", handler);
      return <input aria-label="field" />;
    }
    render(<Demo />);
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByLabelText("field"), { key: "k", ctrlKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
