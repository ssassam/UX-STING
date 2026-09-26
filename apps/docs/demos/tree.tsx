"use client";
import { Tree, type TreeNode } from "@unified-ui/react/tree";
import { FileTextIcon, FolderIcon } from "@unified-ui/icons";

const nodes: TreeNode[] = [
  {
    id: "food",
    label: "Food & drink",
    icon: <FolderIcon />,
    children: [
      { id: "restaurants", label: "Restaurants", icon: <FileTextIcon />, children: [{ id: "moroccan", label: "Moroccan" }, { id: "italian", label: "Italian" }] },
      { id: "cafes", label: "Cafés", icon: <FileTextIcon /> },
    ],
  },
  { id: "stay", label: "Where to stay", icon: <FolderIcon />, children: [{ id: "hotels", label: "Hotels" }, { id: "riads", label: "Riads" }] },
  { id: "services", label: "Services", icon: <FolderIcon />, disabled: true },
];

export function Categories() {
  return <Tree aria-label="Categories" nodes={nodes} defaultExpanded={["food"]} defaultSelected="cafes" className="max-w-xs" />;
}
