import {
  DotPattern,
  Grain,
  GridPattern,
  MeshGradient,
  ProgressiveBlur,
} from "@ux-sting/react/background";

export function Mesh() {
  return (
    <div className="relative isolate grid h-56 place-items-center overflow-hidden rounded-lg border border-border">
      <MeshGradient animate />
      <Grain />
      <p className="text-2xl font-semibold">Mesh gradient + grain</p>
    </div>
  );
}

export function Patterns() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="relative isolate grid h-40 place-items-center rounded-lg border border-border">
        <DotPattern />
        <p className="font-medium">DotPattern</p>
      </div>
      <div className="relative isolate grid h-40 place-items-center rounded-lg border border-border">
        <GridPattern size={32} />
        <p className="font-medium">GridPattern</p>
      </div>
    </div>
  );
}

export function Blur() {
  return (
    <div className="relative h-48 overflow-hidden rounded-lg border border-border">
      <ul className="grid gap-2 p-4 text-sm">
        {Array.from({ length: 10 }, (_, i) => (
          <li key={i}>Itinerary step {i + 1}</li>
        ))}
      </ul>
      <ProgressiveBlur />
    </div>
  );
}
