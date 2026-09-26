import { Badge } from "@ux-sting/react/badge";
import { BusinessCard } from "@ux-sting/react/business-card";
import { Grid } from "@ux-sting/react/grid";
import { Heading } from "@ux-sting/react/typography";

export const metadata = { title: "Listings" };

const listings = [
  { name: "Riad Zitoun", area: "Medina, Marrakech", rating: 4.9, reviews: 412, status: "Live" },
  { name: "Atlas Suites", area: "Gueliz, Marrakech", rating: 4.6, reviews: 208, status: "Live" },
  {
    name: "Ocean View Loft",
    area: "Ain Diab, Casablanca",
    rating: 4.7,
    reviews: 96,
    status: "In review",
  },
  { name: "Medina House", area: "Fès el Bali", rating: 4.4, reviews: 51, status: "Draft" },
];

export default function ListingsPage() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <Heading level={1} size="lg">
        Listings
      </Heading>
      <Grid columns={{ base: 1, sm: 2, xl: 4 }} gap="4">
        {listings.map((l) => (
          <BusinessCard
            key={l.name}
            name={l.name}
            href="#"
            headingLevel={2}
            rating={l.rating}
            reviewCount={l.reviews}
            address={l.area}
            badges={
              <Badge
                variant={
                  l.status === "Live" ? "success" : l.status === "Draft" ? "secondary" : "warning"
                }
              >
                {l.status}
              </Badge>
            }
            image={{
              src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=70",
              alt: "",
            }}
          />
        ))}
      </Grid>
    </div>
  );
}
