import { Button } from "@ux-sting/react/button";
import { EmptyState } from "@ux-sting/react/state";

export default function NotFound() {
  return (
    <main id="main" className="py-24">
      <EmptyState
        size="lg"
        headingLevel={2}
        title="Page not found"
        description="The page you are looking for does not exist."
        actions={
          <Button asChild>
            <a href="/">Back home</a>
          </Button>
        }
      />
    </main>
  );
}
