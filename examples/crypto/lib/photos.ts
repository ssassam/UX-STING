/**
 * Photos from Wikimedia Commons, used under their free licenses (see /credits).
 * Headlines are fictional; photos only illustrate the topic.
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
  etf: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/New_York_Stock_Exchange_Facade_2015.jpg/1280px-New_York_Stock_Exchange_Facade_2015.jpg",
    alt: "Facade of the New York Stock Exchange",
    title: "New York Stock Exchange Facade 2015.jpg",
    page: "https://commons.wikimedia.org/wiki/File:New_York_Stock_Exchange_Facade_2015.jpg",
    author: "Jeffrey Zeldman from Manhattan, USA",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
  },
  upgrade: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Data_Center_of_CNPC.jpg/1280px-Data_Center_of_CNPC.jpg",
    alt: "Rows of servers in a data centre",
    title: "Data Center of CNPC.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Data_Center_of_CNPC.jpg",
    author: "Charlie fong",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  eu: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Belgique_-_Bruxelles_-_Schuman_-_Berlaymont_-_01.jpg/1280px-Belgique_-_Bruxelles_-_Schuman_-_Berlaymont_-_01.jpg",
    alt: "Berlaymont building of the European Commission, Brussels",
    title: "Belgique - Bruxelles - Schuman - Berlaymont - 01.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Belgique_-_Bruxelles_-_Schuman_-_Berlaymont_-_01.jpg",
    author: "EmDee",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  atm: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Bitcoin_ATM_in_South_Africa.jpg/1280px-Bitcoin_ATM_in_South_Africa.jpg",
    alt: "Bitcoin ATM in a shop",
    title: "Bitcoin ATM in South Africa.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Bitcoin_ATM_in_South_Africa.jpg",
    author: "TapticInfo",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  lending: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/WinonaSavingsBankVault.JPG/1280px-WinonaSavingsBankVault.JPG",
    alt: "Open steel door of a bank vault",
    title: "WinonaSavingsBankVault.JPG",
    page: "https://commons.wikimedia.org/wiki/File:WinonaSavingsBankVault.JPG",
    author: "Jonathunder",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  altcoins: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Deutsche-boerse-parkett-ffm008.jpg/1280px-Deutsche-boerse-parkett-ffm008.jpg",
    alt: "Traders' screens on the Frankfurt stock exchange floor",
    title: "Deutsche-boerse-parkett-ffm008.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Deutsche-boerse-parkett-ffm008.jpg",
    author: "Dontworry",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  coins: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Kiloware.JPG/1280px-Kiloware.JPG",
    alt: "Pile of mixed coins",
    title: "Kiloware.JPG",
    page: "https://commons.wikimedia.org/wiki/File:Kiloware.JPG",
    author: "Michael Sander",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  wallst: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Wall_Street_%2855314253740%29.jpg/1280px-Wall_Street_%2855314253740%29.jpg",
    alt: "Street sign and buildings on Wall Street, New York",
    title: "Wall Street (55314253740).jpg",
    page: "https://commons.wikimedia.org/wiki/File:Wall_Street_(55314253740).jpg",
    author: "Ajay Suresh",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
  },
  capitol: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/US_Capitol_east_side.JPG/1280px-US_Capitol_east_side.JPG",
    alt: "East side of the United States Capitol",
    title: "US Capitol east side.JPG",
    page: "https://commons.wikimedia.org/wiki/File:US_Capitol_east_side.JPG",
    author: "Martin Falbisoner",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  l2: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Fiber_optic_illuminated.jpg/1280px-Fiber_optic_illuminated.jpg",
    alt: "Illuminated fibre-optic cables",
    title: "Fiber optic illuminated.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Fiber_optic_illuminated.jpg",
    author: "Hustvedt",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  asia: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Marina_Bay_Singapore-3499.jpg/1280px-Marina_Bay_Singapore-3499.jpg",
    alt: "Marina Bay skyline, Singapore",
    title: "Marina Bay Singapore-3499.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Marina_Bay_Singapore-3499.jpg",
    author: "Bijay Chaurasia",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  vote: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/%D0%92%D0%B8%D0%B1%D0%BE%D1%80%D1%87%D1%96_%D1%83%D1%80%D0%BD%D0%B8_%D0%B2_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D1%96.jpg/1280px-%D0%92%D0%B8%D0%B1%D0%BE%D1%80%D1%87%D1%96_%D1%83%D1%80%D0%BD%D0%B8_%D0%B2_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D1%96.jpg",
    alt: "Transparent ballot boxes",
    title: "Виборчі урни в Україні.jpg",
    page: "https://commons.wikimedia.org/wiki/File:%D0%92%D0%B8%D0%B1%D0%BE%D1%80%D1%87%D1%96_%D1%83%D1%80%D0%BD%D0%B8_%D0%B2_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D1%96.jpg",
    author: "Tohaomg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Standard Wikimedia thumbnail widths: 500 for thumbnails, 960 for cards, 1280 for heroes. */
export const sized = (photo: Photo, width: 500 | 960 | 1280 = 1280) =>
  width === 1280 ? photo.src : photo.src.replace("/1280px-", `/${width}px-`);
