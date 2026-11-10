<div align="center" dir="rtl">

# UX-STING

**مكوّنات سهلة الوصول. شيفرتك. تصميمك.**

[English](README.md) · [Français](README.fr.md) · العربية

نظام تصميم React سهل الوصول وقابل للتخصيص لـ Next.js وأي تطبيق React — مع **مهارات وكلاء (Agent Skills)**
تعمل في أدوات متعددة، و**وكيل تصميم شامل** يعلّم وكلاء البرمجة بناء واجهات ذات توجّه فني حقيقي،
والتحقق من كل صفحة في المتصفح قبل أن يقولوا «انتهى».

**~100 عائلة مكوّنات** · **17 سمة** · **WCAG 2.2 AA** · **تحقق axe داخل المتصفح** ·
**24 أداة ذكاء اصطناعي** · **192 قاعدة حسب القطاع** · **10 مهارات** · **3 لغات + RTL**

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
| **ذكاء التصميم** | بيانات تعمل دون اتصال داخل المهارات: 192 قاعدة حسب القطاع، 80 نمطًا، 192 لوحة ألوان، 74 زوج خطوط، 15 استراتيجية عروض تقديمية، 55 قطاعًا للشعارات ← نظام تصميم وسمة UX-STING مُتحقَّق من تباينها. |

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

صِف منتجك، فتجد مهارة `ux-sting-taste` أعراف قطاعك (بنية الصفحة والأنماط والألوان والخطوط، وما يجب تجنّبه)، ثم يبني وكيلك ثلاثة توجّهات فنية يبتعد اثنان منها على الأقل عن المألوف عمدًا:

</div>

```bash
npx ux-sting skills add
python3 .claude/skills/ux-sting-taste/scripts/design_data.py system "beauty spa booking" --persist
python3 .claude/skills/ux-sting-taste/scripts/design_data.py search "glass dark premium" --domain style
```

<div dir="rtl">

النتيجة: الملف `.ux-sting/taste/design-system/MASTER.md` مع لوحة ألوان مُتحقَّق من تباينها
ومقتطف `createTheme(...)` جاهز للّصق. ملاحظة: الكلمات المفتاحية بالإنجليزية تعطي أدق النتائج.

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

أمر واحد يثبّت المهارات في أدواتك (تُكتشف تلقائيًا عند حذف `--ai`):

</div>

```bash
npx ux-sting skills add                    # detected tools in this project
npx ux-sting skills add --ai cursor,windsurf
npx ux-sting skills add --ai all --global  # all 24 tools, for every project
npx ux-sting skills hosts                  # list supported tools
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
| **ux-sting-slides** | عروض تقديمية (جمع تمويل، مبيعات، مراجعة ربع سنوية، مؤتمرات) مخطَّطة شريحةً بشريحة مع تصدير PDF |
| **logo-design** | شعارات وعلامات تجارية بصيغة SVG نظيفة، مع بيانات القطاعات وحِزم الهوية |

## الترخيص والإشادة

MIT. يُرجى الإبقاء على هذا الإشعار والإشادة بـ **[VELTEIN](https://veltein.com)** و
**[UX-STING](https://github.com/ssassam/UX-STING)**. المحتوى من أطراف ثالثة: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

</div>
