"use client";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@unified-ui/react/resizable";

export function Basic() {
  return (
    <ResizablePanelGroup defaultSizes={[35, 65]} className="h-56 rounded-lg border border-border">
      <ResizablePanel minSize={20} className="p-4 text-sm">Inbox</ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize inbox" />
      <ResizablePanel minSize={30} className="p-4 text-sm">Message</ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function Vertical() {
  return (
    <ResizablePanelGroup direction="vertical" className="h-64 rounded-lg border border-border">
      <ResizablePanel className="p-4 text-sm">Editor</ResizablePanel>
      <ResizableHandle aria-label="Resize terminal" />
      <ResizablePanel className="p-4 text-sm">Terminal</ResizablePanel>
    </ResizablePanelGroup>
  );
}
