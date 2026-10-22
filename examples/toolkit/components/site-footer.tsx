import { allCredits } from "../lib/data";
import { REPO } from "../lib/seo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 text-sm text-muted-foreground sm:px-6 md:grid-cols-2">
        <div className="grid content-start gap-2">
          <p className="font-display text-lg text-foreground">UX-STING</p>
          <p>
            MIT licensed.{" "}
            <a href={REPO} className="underline underline-offset-2 hover:text-foreground">
              Source on GitHub
            </a>
            . The data on this page is regenerated with{" "}
            <code>examples/toolkit/scripts/generate.sh</code>.
          </p>
        </div>
        <div className="grid content-start gap-2">
          <p className="font-medium text-foreground">Image credits</p>
          <ul className="grid gap-1">
            {allCredits.map((c) => (
              <li key={c.id}>{c.credit}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
