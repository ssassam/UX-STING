"use client";
import { Audio, Image, ImageGallery, Video } from "@unified-ui/react/media";
import { img } from "./_data";

const gallery = [
  {
    src: img("photo-1554118811-1e0d58224f24"),
    alt: "Café interior with plants",
    caption: "Main room",
  },
  { src: img("photo-1509042239860-f550ce710b93"), alt: "Latte art", caption: "Signature latte" },
  {
    src: img("photo-1495474472287-4d71bcdd2085"),
    alt: "Pour-over coffee",
    caption: "Pour-over bar",
  },
  { src: img("photo-1501339847302-ac426a4a7cbb"), alt: "Terrace seating", caption: "Terrace" },
  { src: img("photo-1521017432531-fbd92d768814"), alt: "Pastries", caption: "Pastries" },
];

export function Images() {
  return (
    <div className="grid max-w-lg grid-cols-2 gap-3">
      <Image src={gallery[0]!.src} alt={gallery[0]!.alt} ratio={4 / 3} />
      <Image src="https://example.invalid/missing.jpg" alt="Photo unavailable" ratio={4 / 3} />
    </div>
  );
}

export function Gallery() {
  return <ImageGallery images={gallery} layout="mosaic" columns={3} max={5} className="max-w-xl" />;
}

export function VideoAndAudio() {
  return (
    <div className="grid max-w-lg gap-4">
      <Video
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        poster={img("photo-1490750967868-88aa4486c946")}
        title="Flower timelapse"
      />
      <Audio
        title="Welcome message"
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
        transcriptHref="#transcript"
      />
    </div>
  );
}
