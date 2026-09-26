"use client";
import { ArticleCard } from "@ux-sting/react/article-card";
import { img } from "./_data";

const author = { name: "Leila Mansouri", avatar: "https://i.pravatar.cc/80?img=45" };

export function Layouts() {
  return (
    <div className="grid gap-8">
      <ArticleCard
        layout="featured"
        href="#"
        title="48 hours in Casablanca: an architecture lover's guide"
        excerpt="From Art Deco façades to the Hassan II Mosque, here's how to spend a weekend in Morocco's largest city."
        image={{ src: img("photo-1569383746724-6f1b882b8f46", 1200), alt: "Art Deco building" }}
        category="City guides"
        author={author}
        date={{ display: "Mar 12, 2026", dateTime: "2026-03-12" }}
        readingTime="8 min read"
      />
      <div className="grid gap-6 md:grid-cols-2">
        <ArticleCard
          layout="horizontal"
          href="#"
          title="The best rooftop terraces for sunset"
          excerpt="Seven rooftops with views over the medina."
          image={{ src: img("photo-1528127269322-539801943592", 600), alt: "Rooftop terrace" }}
          category="Food & drink"
          date={{ display: "Mar 9", dateTime: "2026-03-09" }}
        />
        <ArticleCard
          href="#"
          title="How we verify local businesses"
          excerpt="Every listing is checked by our team before it gets the verified badge."
          category="Inside Citywise"
          author={author}
        />
      </div>
    </div>
  );
}
