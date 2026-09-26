import type { Meta, StoryObj } from "@storybook/react-vite";
import { PremiumBadge, VerifiedBadge } from "../premium-badge/premium-badge.js";
import { Price } from "../price/price.js";
import { Tag } from "../tag/tag.js";
import { BusinessCard, HotelCard, RestaurantCard, ServiceCard } from "./business-card.js";

const meta = {
  title: "Patterns/BusinessCard",
  component: BusinessCard,
  args: { name: "Café Atlas" },
} satisfies Meta<typeof BusinessCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Presets: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <BusinessCard
        name="Café Atlas"
        href="#"
        category="Coffee"
        rating={4.6}
        reviewCount={128}
        priceLevel={1}
        address="12 Rue de Fès"
        distance="850 m"
      />
      <RestaurantCard
        name="La Sqala"
        href="#"
        cuisine="Moroccan"
        rating={4.7}
        reviewCount={2310}
        priceLevel={2}
        badges={<PremiumBadge size="sm" />}
        image={{ src: "", alt: "" }}
      />
      <HotelCard
        name="Riad Zitoun"
        href="#"
        stars={4}
        rating={4.9}
        nightlyPrice={<Price amount={140} currency="EUR" period="/ night" />}
        badges={<VerifiedBadge size="sm" />}
        image={{ src: "", alt: "" }}
      />
      <ServiceCard
        name="Karim Plumbing"
        href="#"
        category="Plumber"
        rating={4.8}
        responseTime="Responds within 1 hour"
        startingPrice="From 200 MAD"
        tags={<Tag size="sm">Emergency</Tag>}
      />
    </div>
  ),
};
export const LongContent: Story = {
  render: () => (
    <BusinessCard
      className="max-w-xs"
      name="Le Grand Café de la Place du Marché Central et Salon de Thé Traditionnel"
      href="#"
      category="Café · Pâtisserie · Salon de thé · Brunch"
      rating={4.2}
      reviewCount={98765}
      address="Angle Boulevard Mohammed V et Rue Abderrahmane Sehraoui, Quartier des Habous"
      distance="12.4 km"
    />
  ),
};
export const Horizontal: Story = {
  args: {
    layout: "horizontal",
    href: "#",
    category: "Coffee",
    rating: 4.6,
    image: { src: "", alt: "" },
  },
};
export const Mobile: Story = {
  ...Presets,
  parameters: { viewport: { defaultViewport: "mobile" } },
};
export const DarkMode: Story = { ...Presets, globals: { mode: "dark" } };
export const RTL: Story = { ...Presets, globals: { locale: "ar" } };
