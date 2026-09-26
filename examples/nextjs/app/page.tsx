import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/components/card";
import { StatCard } from "@/components/ui/components/stat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/components/tabs";
import { Heading, Text } from "@/components/ui/components/typography";
import { InviteDialog } from "./invite-dialog";
import { TeamTable } from "./team-table";

export default function Home() {
  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Heading level={1}>Workspace</Heading>
          <Text variant="muted">Every component on this page was copied into <code>components/ui</code> by the unified-ui CLI.</Text>
        </div>
        <InviteDialog />
      </header>
      <section aria-label="Usage" className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Members" value="4" />
        <StatCard label="Projects" value="12" delta="+2" trend="up" />
        <StatCard label="Storage" value="61%" helpText="of 50 GB" />
      </section>
      <Tabs defaultValue="team">
        <TabsList aria-label="Workspace sections">
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="about">About this starter</TabsTrigger>
        </TabsList>
        <TabsContent value="team">
          <TeamTable />
        </TabsContent>
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle as="h2">Generated with the CLI</CardTitle>
              <CardDescription>npx unified-ui init · npx unified-ui add button card dialog form data-table …</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              Edit anything in <code>components/ui</code>. <code>unified-ui.lock.json</code> remembers what was installed, so future
              <code> add</code> runs never overwrite your changes silently.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
