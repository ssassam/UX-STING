"use client";
import { useControllableState } from "@unified-ui/hooks";
import { ChevronRightIcon } from "@unified-ui/icons";
import { cn } from "@unified-ui/utils";
import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useLocale } from "../../provider/context.js";

export interface TreeNode {
  id: string;
  label: ReactNode;
  /** Text used for typeahead when `label` is not a string. */
  textValue?: string;
  icon?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeProps {
  nodes: TreeNode[];
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  /** Called on Enter/click (e.g. navigate). */
  onAction?: (node: TreeNode) => void;
  "aria-label": string;
  className?: string;
}

interface FlatNode {
  node: TreeNode;
  level: number;
  parentId: string | null;
  posinset: number;
  setsize: number;
}

function flatten(nodes: TreeNode[], expanded: Set<string>, level = 1, parentId: string | null = null, out: FlatNode[] = []) {
  nodes.forEach((node, i) => {
    out.push({ node, level, parentId, posinset: i + 1, setsize: nodes.length });
    if (node.children?.length && expanded.has(node.id)) flatten(node.children, expanded, level + 1, node.id, out);
  });
  return out;
}

/**
 * Hierarchical list (files, categories) following the ARIA tree pattern:
 * arrows navigate/expand (RTL-aware), Home/End, typeahead, Enter selects.
 */
export function Tree({ nodes, expanded: expandedProp, defaultExpanded = [], onExpandedChange, selected: selectedProp, defaultSelected = null, onSelectedChange, onAction, className, ...aria }: TreeProps) {
  const [expanded, setExpanded] = useControllableState({ value: expandedProp, defaultValue: defaultExpanded, onChange: onExpandedChange });
  const [selected, setSelected] = useControllableState({ value: selectedProp, defaultValue: defaultSelected, onChange: onSelectedChange });
  const expandedSet = useMemo(() => new Set(expanded), [expanded]);
  const visible = useMemo(() => flatten(nodes, expandedSet), [nodes, expandedSet]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const refs = useRef(new Map<string, HTMLLIElement>());
  const { dir } = useLocale();
  const typeahead = useRef({ text: "", time: 0 });

  const tabStop = focusedId ?? selected ?? visible[0]?.node.id;
  const focus = (id: string | undefined) => {
    if (!id) return;
    setFocusedId(id);
    refs.current.get(id)?.focus();
  };
  const toggle = (id: string, open?: boolean) => {
    const isOpen = expandedSet.has(id);
    const next = open ?? !isOpen;
    if (next === isOpen) return;
    setExpanded(next ? [...expanded, id] : expanded.filter((e) => e !== id));
  };
  const activate = (flat: FlatNode) => {
    if (flat.node.disabled) return;
    setSelected(flat.node.id);
    onAction?.(flat.node);
  };

  const onKeyDown = (e: KeyboardEvent, flat: FlatNode) => {
    const i = visible.findIndex((v) => v.node.id === flat.node.id);
    const hasChildren = Boolean(flat.node.children?.length);
    const isOpen = expandedSet.has(flat.node.id);
    const openKey = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const closeKey = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    switch (e.key) {
      case "ArrowDown":
        focus(visible[i + 1]?.node.id);
        break;
      case "ArrowUp":
        focus(visible[i - 1]?.node.id);
        break;
      case openKey:
        if (hasChildren && !isOpen) toggle(flat.node.id, true);
        else if (hasChildren) focus(visible[i + 1]?.node.id);
        break;
      case closeKey:
        if (hasChildren && isOpen) toggle(flat.node.id, false);
        else focus(flat.parentId ?? undefined);
        break;
      case "Home":
        focus(visible[0]?.node.id);
        break;
      case "End":
        focus(visible[visible.length - 1]?.node.id);
        break;
      case "Enter":
      case " ":
        activate(flat);
        break;
      case "*":
        setExpanded(Array.from(new Set([...expanded, ...visible.filter((v) => v.parentId === flat.parentId && v.node.children?.length).map((v) => v.node.id)])));
        break;
      default: {
        if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
        const now = Date.now();
        typeahead.current = { text: (now - typeahead.current.time < 500 ? typeahead.current.text : "") + e.key.toLowerCase(), time: now };
        const text = (v: FlatNode) => (v.node.textValue ?? (typeof v.node.label === "string" ? v.node.label : "")).toLowerCase();
        const match = [...visible.slice(i + 1), ...visible.slice(0, i + 1)].find((v) => text(v).startsWith(typeahead.current.text));
        focus(match?.node.id);
        break;
      }
    }
    e.preventDefault();
  };

  const renderLevel = (items: TreeNode[], level: number): ReactNode =>
    items.map((node) => {
      const flat = visible.find((v) => v.node.id === node.id);
      if (!flat) return null;
      const hasChildren = Boolean(node.children?.length);
      const isOpen = expandedSet.has(node.id);
      return (
        <li
          key={node.id}
          ref={(el) => {
            if (el) refs.current.set(node.id, el);
            else refs.current.delete(node.id);
          }}
          role="treeitem"
          aria-level={level}
          aria-posinset={flat.posinset}
          aria-setsize={flat.setsize}
          aria-expanded={hasChildren ? isOpen : undefined}
          aria-selected={selected === node.id}
          aria-disabled={node.disabled || undefined}
          tabIndex={tabStop === node.id ? 0 : -1}
          onKeyDown={(e) => {
            e.stopPropagation();
            onKeyDown(e, flat);
          }}
          onFocus={(e) => {
            e.stopPropagation();
            setFocusedId(node.id);
          }}
          className="outline-none [&:focus-visible>div]:ring-2 [&:focus-visible>div]:ring-ring"
        >
          <div
            onClick={() => {
              if (hasChildren) toggle(node.id);
              activate(flat);
              focus(node.id);
            }}
            style={{ paddingInlineStart: `${(level - 1) * 1.25 + 0.25}rem` }}
            className={cn(
              "flex h-(--ui-nav-item-h) cursor-pointer select-none items-center gap-1.5 rounded-md pe-2 text-sm transition-colors hover:bg-accent [&_svg]:size-4 [&_svg]:shrink-0",
              selected === node.id && "bg-primary-subtle text-primary-subtle-foreground hover:bg-primary-subtle",
              node.disabled && "pointer-events-none opacity-50",
            )}
          >
            <ChevronRightIcon aria-hidden className={cn("text-muted-foreground transition-transform duration-(--ui-duration-fast) rtl:rotate-180", isOpen && "rotate-90 rtl:rotate-90", !hasChildren && "invisible")} />
            {node.icon ? <span className="text-muted-foreground">{node.icon}</span> : null}
            <span className="truncate">{node.label}</span>
          </div>
          {hasChildren && isOpen ? (
            <ul role="group" className="grid gap-0.5">
              {renderLevel(node.children!, level + 1)}
            </ul>
          ) : null}
        </li>
      );
    });

  return (
    <ul role="tree" aria-label={aria["aria-label"]} className={cn("grid gap-0.5", className)}>
      {renderLevel(nodes, 1)}
    </ul>
  );
}
