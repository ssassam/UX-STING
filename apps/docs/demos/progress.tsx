"use client";
import { CircularProgress, Progress } from "@unified-ui/react/progress";

export function Linear() {
  return (
    <div className="grid max-w-md gap-5">
      <Progress value={64} label="Profile completion" showValue id="profile-progress" />
      <Progress value={30} variant="warning" size="sm" aria-label="Storage" />
      <Progress value={100} variant="success" size="xs" aria-label="Upload complete" />
      <Progress aria-label="Loading results" />
    </div>
  );
}

export function Circular() {
  return (
    <div className="flex items-center gap-6">
      <CircularProgress value={72} showValue aria-label="Goal" />
      <CircularProgress
        value={40}
        size={64}
        thickness={6}
        variant="success"
        showValue
        aria-label="Occupancy"
      />
      <CircularProgress aria-label="Loading" />
    </div>
  );
}
