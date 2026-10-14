"use client";
import { ImageComparison } from "@ux-sting/react/image-comparison";
import { img } from "./_data";

export function BeforeAfter() {
  return (
    <ImageComparison
      className="aspect-[3/2] max-w-xl"
      label="Compare black-and-white and color versions"
      before={
        <img
          src={img("photo-1539020140153-e479b8c22e70")}
          alt="Hassan II Mosque, original colors removed"
          className="grayscale"
        />
      }
      after={
        <img src={img("photo-1539020140153-e479b8c22e70")} alt="Hassan II Mosque in full color" />
      }
      beforeLabel="Black & white"
      afterLabel="Color"
    />
  );
}
