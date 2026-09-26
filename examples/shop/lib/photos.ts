/**
 * Photos from Wikimedia Commons, used under their free licenses (see /credits).
 * Each entry keeps its author and license; keep the credits if you reuse them.
 */
export interface Photo {
  src: string;
  alt: string;
  title: string;
  page: string;
  author: string;
  license: string;
  licenseUrl: string;
}

export const photos = {
  teapot: {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Black_tea_pot_cropped.jpg",
    alt: "Black cast-iron teapot",
    title: "Black tea pot cropped.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Black_tea_pot_cropped.jpg",
    author: "Mendhak",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
  },
  mug: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Mug_of_Tea.JPG/1280px-Mug_of_Tea.JPG",
    alt: "Mug of tea on a table",
    title: "Mug of Tea.JPG",
    page: "https://commons.wikimedia.org/wiki/File:Mug_of_Tea.JPG",
    author: "Factorylad",
    license: "Public domain",
    licenseUrl: "",
  },
  candle: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/LA2_Skultuna_kontorsljusstake.jpg/1280px-LA2_Skultuna_kontorsljusstake.jpg",
    alt: "Brass candlestick",
    title: "LA2 Skultuna kontorsljusstake.jpg",
    page: "https://commons.wikimedia.org/wiki/File:LA2_Skultuna_kontorsljusstake.jpg",
    author: "LA2",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  cushion: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Throw_Pillows_%28Scatter_Cushions%29.jpg/1280px-Throw_Pillows_%28Scatter_Cushions%29.jpg",
    alt: "Throw cushions on a sofa",
    title: "Throw Pillows (Scatter Cushions).jpg",
    page: "https://commons.wikimedia.org/wiki/File:Throw_Pillows_(Scatter_Cushions).jpg",
    author: "Markjones959",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  frenchpress: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/French_press_2020.jpg/1280px-French_press_2020.jpg",
    alt: "Glass French press coffee maker",
    title: "French press 2020.jpg",
    page: "https://commons.wikimedia.org/wiki/File:French_press_2020.jpg",
    author: "KoeppiK",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  plant: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Orkide_i_finstua_mot_vest.jpg/1280px-Orkide_i_finstua_mot_vest.jpg",
    alt: "Flowering orchid on a windowsill",
    title: "Orkide i finstua mot vest.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Orkide_i_finstua_mot_vest.jpg",
    author: "Øyvind Holmstad",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  board: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Chopping_Board.jpg/1280px-Chopping_Board.jpg",
    alt: "Wooden chopping board",
    title: "Chopping Board.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Chopping_Board.jpg",
    author: "Donovan Govan.",
    license: "CC BY-SA 3.0",
    licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/",
  },
  kettle: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Bernadotte_Wasserkessel.jpg/1280px-Bernadotte_Wasserkessel.jpg",
    alt: "Stainless steel kettle",
    title: "Bernadotte Wasserkessel.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Bernadotte_Wasserkessel.jpg",
    author: "Holger Ellgaard",
    license: "CC BY-SA 3.0",
    licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/",
  },
  lamp: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Lampshades.jpg/1280px-Lampshades.jpg",
    alt: "Paper lampshades",
    title: "Lampshades.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Lampshades.jpg",
    author: "Unknown author",
    license: "CC BY-SA 3.0",
    licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/",
  },
  pottery: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Traditional_pottery_in_Nigeria_%28Ikpu_ite%29_19.jpg/1280px-Traditional_pottery_in_Nigeria_%28Ikpu_ite%29_19.jpg",
    alt: "Handmade clay pots",
    title: "Traditional pottery in Nigeria (Ikpu ite) 19.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Traditional_pottery_in_Nigeria_(Ikpu_ite)_19.jpg",
    author: "Chukwukajustice",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  basket: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Woman_weaving_baskets_near_Lake_Ossa.jpg/1280px-Woman_weaving_baskets_near_Lake_Ossa.jpg",
    alt: "Artisan weaving baskets by hand",
    title: "Woman weaving baskets near Lake Ossa.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Woman_weaving_baskets_near_Lake_Ossa.jpg",
    author: "ymea",
    license: "CC BY-SA 3.0",
    licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Standard Wikimedia thumbnail widths: 500 for thumbnails, 960 for cards, 1280 for heroes. */
export const sized = (photo: Photo, width: 500 | 960 | 1280 = 1280) =>
  width === 1280 ? photo.src : photo.src.replace("/1280px-", `/${width}px-`);
