<div align="center" dir="rtl">

# UX-STING

**مكوّنات سهلة الوصول. شيفرتك. تصميمك.**

[English](README.md) · [Français](README.fr.md) · العربية

نظام تصميم React سهل الوصول وقابل للتخصيص لـ Next.js وأي تطبيق React — مع **مهارات وكلاء (Agent Skills)**
تعمل في أدوات متعددة، و**وكيل تصميم شامل** يعلّم وكلاء البرمجة بناء واجهات ذات توجّه فني حقيقي،
والتحقق من كل صفحة في المتصفح قبل أن يقولوا «انتهى».

**~100 عائلة مكوّنات** · **17 سمة** · **WCAG 2.2 AA** · **تحقق axe داخل المتصفح** ·
**24 أداة ذكاء اصطناعي** · **192 قاعدة حسب القطاع** · **3 لغات + RTL**

</div>

[![ux-sting](https://img.shields.io/npm/v/ux-sting?label=ux-sting&color=orange&style=flat-square)](https://www.npmjs.com/package/ux-sting)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

<div dir="rtl">

> التوثيق الكامل بالإنجليزية: [README.md](README.md). تلخّص هذه الصفحة الأساسيات.

## لماذا UX-STING

| | |
| --- | --- |
| **~100 عائلة مكوّنات** | التخطيط، الطباعة، الأزرار، نظام نماذج كامل، التاريخ والوقت، التنقل، النوافذ، التنبيهات، جداول البيانات، الوسائط، لوحة الأوامر، التجارة الإلكترونية، والحركة بلا تبعيات. |
| **سهل الوصول افتراضيًا** | WCAG 2.2 AA، دعم لوحة المفاتيح، إدارة التركيز، اختبارات axe، ورموز ألوان مُتحقَّق من تباينها. |
| **الرموز والسمات** | رموز دلالية OKLCH كمتغيرات CSS، و17 سمة جاهزة، ووضع فاتح / داكن / تباين عالٍ. |
| **عالمي** | دعم كامل للكتابة من اليمين إلى اليسار (RTL) عبر الخصائص المنطقية، ونصوص مترجمة (en / fr / ar)، وتنسيق `Intl` في كل مكان. |
| **Next.js أولًا** | App Router، مكوّنات خادم افتراضيًا، ونقطة دخول لكل مكوّن. |
| **شيفرتك ملكك** | `npx ux-sting add dialog` ينسخ الشيفرة المصدرية إلى مشروعك. |
| **ذكاء التصميم** | `npx ux-sting brief "<فكرتك>"`: 192 قاعدة حسب القطاع، 80+ نمطًا، 192 لوحة ألوان، 74 زوج خطوط ← سمة UX-STING مُتحقَّق من تباينها. |

## البدء السريع

</div>

```bash
npm install @ux-sting/react
```

```css
@import "tailwindcss";
@import "@ux-sting/react/tailwind.css";
```

```tsx
import { UIProvider } from "@ux-sting/react/provider";
import { Button } from "@ux-sting/react/button";

<UIProvider theme="default" dir="rtl" locale="ar">
  <Button loading>حفظ</Button>
</UIProvider>
```

<div dir="rtl">

أو انسخ شيفرة المكوّنات إلى مشروعك:

</div>

```bash
npx ux-sting init
npx ux-sting add button dialog data-table
```

<div dir="rtl">

## من الفكرة إلى السمة

صِف منتجك، فيختار UX-STING بنية الصفحة والنمط والألوان والخطوط المناسبة لقطاعك، ثم يكتب سمة جاهزة للاستخدام:

</div>

```bash
npm install -D ux-sting @ux-sting/catalog
npx ux-sting brief "beauty spa booking" --out src/theme
npx ux-sting search styles "glass dark premium"
```

<div dir="rtl">

النتيجة: ملفات `<name>.theme.ts` و`.theme.json` و`.css` و`design-system.md`، مع ما يجب تجنّبه في هذا القطاع
وقائمة تحقق قبل التسليم. ملاحظة: الكلمات المفتاحية بالإنجليزية تعطي أدق النتائج.

## أدوات الوكلاء

</div>

```bash
npm install -D ux-sting @ux-sting/qa @ux-sting/extract @ux-sting/images
npx playwright-core install chromium

npx ux-sting qa http://localhost:3000        # فحص في المتصفح: تقرير + أهم 3 إصلاحات
npx ux-sting extract https://example.com     # استخراج رموز التصميم (W3C DTCG) من موقع قائم
npx ux-sting images "harbour at dawn" --download 1   # صور مفتوحة الترخيص مع نسب المصدر
```

<div dir="rtl">

## يعمل مع وكيل الذكاء الاصطناعي لديك

أمر واحد يثبّت المهارات في الأداة التي تختارها (يُكتشف تلقائيًا عند حذف `--ai`):

</div>

```bash
npx ux-sting init --ai cursor     # claude, codex, copilot, gemini, windsurf, kiro, roocode, trae… or all
npx ux-sting skills --ai all --global
```

<div dir="rtl">

**Claude Code**: ‏`/plugin marketplace add ssassam/UX-STING` ثم `/plugin install ux-sting@ux-sting`.

| المهارة | الدور |
| --- | --- |
| **ux-sting-design-agent** | وكيل شامل يوجّه كل مهمة واجهة إلى المهارة المناسبة ويتحقق دائمًا |
| **ux-sting** | المكوّنات والرموز والسمات، وربط `@ux-sting/react` بتطبيقك |
| **ux-sting-taste** | توجيه فني لصفحات تبدو مصمَّمة لا مولَّدة |
| **ux-sting-review** | مراجعة الوصول وتجربة المستخدم والتصميم مرتبة حسب الخطورة |
| **ux-sting-explore** | عدة اتجاهات بصرية جنبًا إلى جنب |
| **ux-sting-universal** | مرجع ← حمض نووي للتصميم ← صفحة ← فحص في المتصفح |
| **ux-sting-3d** | مشاهد three.js / WebGL سريعة |
| **ux-sting-diagrams** | رسوم بيانية تحريرية بألوان السمة |
| **logo-design** | شعارات وعلامات تجارية بصيغة SVG نظيفة |

## الترخيص والإشادة

MIT. يُرجى الإبقاء على هذا الإشعار والإشادة بـ **[VELTEIN](https://veltein.com)** و
**[UX-STING](https://github.com/ssassam/UX-STING)**. المحتوى من أطراف ثالثة: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

</div>
