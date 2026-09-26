import { BedIcon, CoffeeIcon, DumbbellIcon, ShoppingBagIcon, UtensilsIcon, WrenchIcon } from "./icons";
import { CategoryCard, CityCard } from "@unified-ui/react/category-card";
import { Container } from "@unified-ui/react/container";
import { Grid } from "@unified-ui/react/grid";
import { ClaimBusiness } from "@unified-ui/react/lead-form";
import { Heading, Text } from "@unified-ui/react/typography";
import { HeroSearch } from "../components/hero-search";
import { PlaceCard } from "../components/place-card";
import { categories, cities, places } from "../lib/data";

const icons = { restaurants: <UtensilsIcon />, cafes: <CoffeeIcon />, hotels: <BedIcon />, services: <WrenchIcon />, shopping: <ShoppingBagIcon />, fitness: <DumbbellIcon /> };
const nf = new Intl.NumberFormat("en");

export default function Home() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <Container className="grid gap-6 py-12 sm:py-20">
          <div className="grid max-w-2xl gap-3">
            <Heading level={1} size="3xl">Find the best of your city</Heading>
            <Text size="lg" variant="muted">Trusted reviews, opening hours and direct contact for 7,000+ local businesses.</Text>
          </div>
          <HeroSearch />
        </Container>
      </section>
      <Container className="grid gap-14 py-12">
        <section aria-labelledby="browse" className="grid gap-4">
          <Heading id="browse" level={2} size="md">Browse by category</Heading>
          <Grid columns={{ base: 2, md: 3, lg: 6 }} gap="3">
            {categories.map((c) => (
              <CategoryCard key={c.id} href={`/search?category=${c.id}`} name={c.name} count={`${nf.format(c.count)} places`} icon={icons[c.id]} />
            ))}
          </Grid>
        </section>
        <section aria-labelledby="featured" className="grid gap-4">
          <Heading id="featured" level={2} size="md">Featured this week</Heading>
          <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap="4">
            {places.slice(0, 4).map((p) => <PlaceCard key={p.slug} place={p} />)}
          </Grid>
        </section>
        <section aria-labelledby="cities" className="grid gap-4">
          <Heading id="cities" level={2} size="md">Popular cities</Heading>
          <Grid columns={{ base: 2, md: 3 }} gap="3">
            {cities.map((c) => (
              <CityCard key={c.id} href={`/search?city=${c.id}`} name={c.name} count={`${nf.format(c.count)} places`} image={{ src: c.image, alt: "" }} />
            ))}
          </Grid>
        </section>
        <ClaimBusiness businessName="your business" title="Own a business?" description="Claim your free listing to update hours, reply to reviews and receive leads." href="/search" actionLabel="Get started" />
      </Container>
    </>
  );
}
