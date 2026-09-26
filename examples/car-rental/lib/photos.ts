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
  hero: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Central_Californian_Coastline%2C_Big_Sur_-_May_2013.jpg/1280px-Central_Californian_Coastline%2C_Big_Sur_-_May_2013.jpg",
    alt: "Coastal highway winding along the cliffs of Big Sur, California",
    title: "Central Californian Coastline, Big Sur - May 2013.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Central_Californian_Coastline,_Big_Sur_-_May_2013.jpg",
    author: "Diliff",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  fiat500: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Fiat_500_%282007%29_02.JPG/1280px-Fiat_500_%282007%29_02.JPG",
    alt: "Fiat 500 city car",
    title: "Fiat 500 (2007) 02.JPG",
    page: "https://commons.wikimedia.org/wiki/File:Fiat_500_(2007)_02.JPG",
    author: "Ad Meskens",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  golf: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/2020_Volkswagen_Golf_Style_1.5_Front.jpg/1280px-2020_Volkswagen_Golf_Style_1.5_Front.jpg",
    alt: "Volkswagen Golf hatchback",
    title: "2020 Volkswagen Golf Style 1.5 Front.jpg",
    page: "https://commons.wikimedia.org/wiki/File:2020_Volkswagen_Golf_Style_1.5_Front.jpg",
    author: "Vauxford",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  corolla: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/1280px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
    alt: "Toyota Corolla hatchback",
    title: "2018 Toyota Corolla (MZEA12R) Ascent Sport hatchback (2018-11-02) 01.jpg",
    page: "https://commons.wikimedia.org/wiki/File:2018_Toyota_Corolla_(MZEA12R)_Ascent_Sport_hatchback_(2018-11-02)_01.jpg",
    author: "EurovisionNim",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  model3: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Tesla_Model_3_%282023%29_Autofr%C3%BChling_Ulm_IMG_9282.jpg/1280px-Tesla_Model_3_%282023%29_Autofr%C3%BChling_Ulm_IMG_9282.jpg",
    alt: "Tesla Model 3 electric saloon",
    title: "Tesla Model 3 (2023) Autofrühling Ulm IMG 9282.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Tesla_Model_3_(2023)_Autofr%C3%BChling_Ulm_IMG_9282.jpg",
    author: "Alexander-93",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  rav4: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/2024_Toyota_RAV4_Prime_XSE_Premium_in_Silver_Sky_with_Midnight_Black_roof%2C_front_left.jpg/1280px-2024_Toyota_RAV4_Prime_XSE_Premium_in_Silver_Sky_with_Midnight_Black_roof%2C_front_left.jpg",
    alt: "Toyota RAV4 plug-in hybrid SUV",
    title:
      "2024 Toyota RAV4 Prime XSE Premium in Silver Sky with Midnight Black roof, front left.jpg",
    page: "https://commons.wikimedia.org/wiki/File:2024_Toyota_RAV4_Prime_XSE_Premium_in_Silver_Sky_with_Midnight_Black_roof,_front_left.jpg",
    author: "Mr.choppers",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  "3008": {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Peugeot_e-3008_Automesse_Ludwigsburg_2024_IMG_1537.jpg/1280px-Peugeot_e-3008_Automesse_Ludwigsburg_2024_IMG_1537.jpg",
    alt: "Peugeot e-3008 electric SUV",
    title: "Peugeot e-3008 Automesse Ludwigsburg 2024 IMG 1537.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Peugeot_e-3008_Automesse_Ludwigsburg_2024_IMG_1537.jpg",
    author: "Alexander-93",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  bmw3: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/2019_BMW_318d_SE_Automatic_2.0_Front.jpg/1280px-2019_BMW_318d_SE_Automatic_2.0_Front.jpg",
    alt: "BMW 3 Series saloon",
    title: "2019 BMW 318d SE Automatic 2.0 Front.jpg",
    page: "https://commons.wikimedia.org/wiki/File:2019_BMW_318d_SE_Automatic_2.0_Front.jpg",
    author: "Vauxford",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  transporter: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/2017_Volkswagen_Transporter_T28_Highline_TDi_2.0_Front.jpg/1280px-2017_Volkswagen_Transporter_T28_Highline_TDi_2.0_Front.jpg",
    alt: "Volkswagen Transporter minibus",
    title: "2017 Volkswagen Transporter T28 Highline TDi 2.0 Front.jpg",
    page: "https://commons.wikimedia.org/wiki/File:2017_Volkswagen_Transporter_T28_Highline_TDi_2.0_Front.jpg",
    author: "Vauxford",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  wrangler: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Jeep_Wrangler_Unlimited_%28JL%29_PHEV_IMG_5808.jpg/1280px-Jeep_Wrangler_Unlimited_%28JL%29_PHEV_IMG_5808.jpg",
    alt: "Jeep Wrangler 4x4",
    title: "Jeep Wrangler Unlimited (JL) PHEV IMG 5808.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Jeep_Wrangler_Unlimited_(JL)_PHEV_IMG_5808.jpg",
    author: "Alexander Migl",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  clio: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Renault_Clio_%28V%2C_Facelift%29_%E2%80%93_f_02092025.jpg/1280px-Renault_Clio_%28V%2C_Facelift%29_%E2%80%93_f_02092025.jpg",
    alt: "Renault Clio hatchback",
    title: "Renault Clio (V, Facelift) – f 02092025.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Renault_Clio_(V,_Facelift)_%E2%80%93_f_02092025.jpg",
    author: "© M 93",
    license: "CC BY-SA 3.0 de",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
  },
  ev6: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/2021_Kia_EV6_GT-Line_S.jpg/1280px-2021_Kia_EV6_GT-Line_S.jpg",
    alt: "Kia EV6 electric crossover",
    title: "2021 Kia EV6 GT-Line S.jpg",
    page: "https://commons.wikimedia.org/wiki/File:2021_Kia_EV6_GT-Line_S.jpg",
    author: "Vauxford",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  eclass: {
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/2019_Mercedes-Benz_E220d_SE_Automatic_2.0_Front.jpg/1280px-2019_Mercedes-Benz_E220d_SE_Automatic_2.0_Front.jpg",
    alt: "Mercedes-Benz E-Class saloon",
    title: "2019 Mercedes-Benz E220d SE Automatic 2.0 Front.jpg",
    page: "https://commons.wikimedia.org/wiki/File:2019_Mercedes-Benz_E220d_SE_Automatic_2.0_Front.jpg",
    author: "Vauxford",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Standard Wikimedia thumbnail widths: 500 for thumbnails, 960 for cards, 1280 for heroes. */
export const sized = (photo: Photo, width: 500 | 960 | 1280 = 1280) =>
  width === 1280 ? photo.src : photo.src.replace("/1280px-", `/${width}px-`);
