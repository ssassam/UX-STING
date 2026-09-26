import { Heading, Text } from "@ux-sting/react/typography";
import { NewsList } from "../../components/news-list";
import { pageMeta } from "../../lib/seo";

export const metadata = pageMeta({
  title: "Crypto news",
  description: "Crypto market headlines by topic with sentiment tags (sample data).",
  path: "news",
});

export default function NewsPage() {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-8 sm:px-6">
      <div className="grid gap-1">
        <Heading level={1} size="2xl">
          Crypto news
        </Heading>
        <Text variant="muted">
          Fictional headlines written for this demo, tagged by topic and market sentiment.
        </Text>
      </div>
      <NewsList />
    </div>
  );
}
