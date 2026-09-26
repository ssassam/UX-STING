/**
 * Localized strings used by reusable components (accessible labels, empty
 * states, pagination text). Override any subset through `UIProvider`.
 */
export interface Messages {
  close: string;
  loading: string;
  clear: string;
  search: string;
  noResults: string;
  previous: string;
  next: string;
  more: string;
  morePages: string;
  pagination: string;
  goToPage: (page: number) => string;
  pageOf: (page: number, total: number) => string;
  rowsPerPage: string;
  selectAll: string;
  selectRow: string;
  selected: (count: number) => string;
  sortAscending: string;
  sortDescending: string;
  columns: string;
  showPassword: string;
  hidePassword: string;
  increment: string;
  decrement: string;
  previousMonth: string;
  nextMonth: string;
  chooseDate: string;
  chooseTime: string;
  breadcrumb: string;
  removeItem: (label: string) => string;
  dropFiles: string;
  browseFiles: string;
  rating: (value: number, max: number) => string;
  required: string;
  errorSummaryTitle: (count: number) => string;
  carousel: string;
  slideOf: (index: number, total: number) => string;
  pauseAutoplay: string;
  playAutoplay: string;
  toggleSidebar: string;
  openMenu: string;
  notifications: string;
  skipToContent: string;
  expand: string;
  collapse: string;
  copy: string;
  copied: string;
}

export const en: Messages = {
  close: "Close",
  loading: "Loading",
  clear: "Clear",
  search: "Search",
  noResults: "No results found",
  previous: "Previous",
  next: "Next",
  more: "More",
  morePages: "More pages",
  pagination: "Pagination",
  goToPage: (p) => `Go to page ${p}`,
  pageOf: (p, t) => `Page ${p} of ${t}`,
  rowsPerPage: "Rows per page",
  selectAll: "Select all",
  selectRow: "Select row",
  selected: (n) => `${n} selected`,
  sortAscending: "Sort ascending",
  sortDescending: "Sort descending",
  columns: "Columns",
  showPassword: "Show password",
  hidePassword: "Hide password",
  increment: "Increase",
  decrement: "Decrease",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  chooseDate: "Choose date",
  chooseTime: "Choose time",
  breadcrumb: "Breadcrumb",
  removeItem: (l) => `Remove ${l}`,
  dropFiles: "Drag and drop files here",
  browseFiles: "Browse files",
  rating: (v, m) => `${v} out of ${m} stars`,
  required: "required",
  errorSummaryTitle: (n) => (n === 1 ? "There is 1 problem" : `There are ${n} problems`),
  carousel: "Carousel",
  slideOf: (i, t) => `Slide ${i} of ${t}`,
  pauseAutoplay: "Pause slideshow",
  playAutoplay: "Play slideshow",
  toggleSidebar: "Toggle sidebar",
  openMenu: "Open menu",
  notifications: "Notifications",
  skipToContent: "Skip to content",
  expand: "Expand",
  collapse: "Collapse",
  copy: "Copy",
  copied: "Copied",
};

export const fr: Messages = {
  close: "Fermer",
  loading: "Chargement",
  clear: "Effacer",
  search: "Rechercher",
  noResults: "Aucun résultat",
  previous: "Précédent",
  next: "Suivant",
  more: "Plus",
  morePages: "Autres pages",
  pagination: "Pagination",
  goToPage: (p) => `Aller à la page ${p}`,
  pageOf: (p, t) => `Page ${p} sur ${t}`,
  rowsPerPage: "Lignes par page",
  selectAll: "Tout sélectionner",
  selectRow: "Sélectionner la ligne",
  selected: (n) => `${n} sélectionné${n > 1 ? "s" : ""}`,
  sortAscending: "Tri croissant",
  sortDescending: "Tri décroissant",
  columns: "Colonnes",
  showPassword: "Afficher le mot de passe",
  hidePassword: "Masquer le mot de passe",
  increment: "Augmenter",
  decrement: "Diminuer",
  previousMonth: "Mois précédent",
  nextMonth: "Mois suivant",
  chooseDate: "Choisir une date",
  chooseTime: "Choisir une heure",
  breadcrumb: "Fil d’Ariane",
  removeItem: (l) => `Retirer ${l}`,
  dropFiles: "Glissez-déposez des fichiers ici",
  browseFiles: "Parcourir",
  rating: (v, m) => `${v} sur ${m} étoiles`,
  required: "obligatoire",
  errorSummaryTitle: (n) => (n === 1 ? "Il y a 1 problème" : `Il y a ${n} problèmes`),
  carousel: "Carrousel",
  slideOf: (i, t) => `Diapositive ${i} sur ${t}`,
  pauseAutoplay: "Mettre en pause le diaporama",
  playAutoplay: "Lancer le diaporama",
  toggleSidebar: "Afficher/masquer la barre latérale",
  openMenu: "Ouvrir le menu",
  notifications: "Notifications",
  skipToContent: "Aller au contenu",
  expand: "Développer",
  collapse: "Réduire",
  copy: "Copier",
  copied: "Copié",
};

export const ar: Messages = {
  close: "إغلاق",
  loading: "جارٍ التحميل",
  clear: "مسح",
  search: "بحث",
  noResults: "لا توجد نتائج",
  previous: "السابق",
  next: "التالي",
  more: "المزيد",
  morePages: "صفحات أخرى",
  pagination: "ترقيم الصفحات",
  goToPage: (p) => `الانتقال إلى الصفحة ${p}`,
  pageOf: (p, t) => `الصفحة ${p} من ${t}`,
  rowsPerPage: "عدد الصفوف في الصفحة",
  selectAll: "تحديد الكل",
  selectRow: "تحديد الصف",
  selected: (n) => `تم تحديد ${n}`,
  sortAscending: "ترتيب تصاعدي",
  sortDescending: "ترتيب تنازلي",
  columns: "الأعمدة",
  showPassword: "إظهار كلمة المرور",
  hidePassword: "إخفاء كلمة المرور",
  increment: "زيادة",
  decrement: "إنقاص",
  previousMonth: "الشهر السابق",
  nextMonth: "الشهر التالي",
  chooseDate: "اختر التاريخ",
  chooseTime: "اختر الوقت",
  breadcrumb: "مسار التنقل",
  removeItem: (l) => `إزالة ${l}`,
  dropFiles: "اسحب الملفات وأفلتها هنا",
  browseFiles: "استعراض الملفات",
  rating: (v, m) => `${v} من ${m} نجوم`,
  required: "مطلوب",
  errorSummaryTitle: (n) => (n === 1 ? "توجد مشكلة واحدة" : `توجد ${n} مشكلات`),
  carousel: "عرض شرائح",
  slideOf: (i, t) => `الشريحة ${i} من ${t}`,
  pauseAutoplay: "إيقاف العرض مؤقتًا",
  playAutoplay: "تشغيل العرض",
  toggleSidebar: "إظهار/إخفاء الشريط الجانبي",
  openMenu: "فتح القائمة",
  notifications: "الإشعارات",
  skipToContent: "انتقل إلى المحتوى",
  expand: "توسيع",
  collapse: "طي",
  copy: "نسخ",
  copied: "تم النسخ",
};

export const builtInMessages: Record<string, Messages> = { en, fr, ar };

/** Picks the closest built-in catalog for a locale, falling back to English. */
export function getMessages(locale: string | undefined): Messages {
  if (!locale) return en;
  return builtInMessages[locale] ?? builtInMessages[locale.split("-")[0] ?? ""] ?? en;
}
