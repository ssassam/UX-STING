<div align="center">

# UX-STING

**Composants accessibles. Votre code. Votre design.**

[English](README.md) · Français · [العربية](README.ar.md)

Un design system React accessible, personnalisable et tree-shakeable pour Next.js et toute
application React — livré avec des **Agent Skills** multi-outils et un **agent de design universel**
qui apprennent aux agents de code à construire des interfaces avec une vraie direction artistique,
et à vérifier chaque page dans un navigateur avant de dire « terminé ».

[![ux-sting](https://img.shields.io/npm/v/ux-sting?label=ux-sting&color=orange&style=flat-square)](https://www.npmjs.com/package/ux-sting)
[![Licence](https://img.shields.io/badge/Licence-MIT-green?style=flat-square)](LICENSE)
[![Outils IA](https://img.shields.io/badge/outils%20IA-24-2563eb?style=flat-square)](#compatible-avec-votre-agent-ia)
[![Règles métier](https://img.shields.io/badge/r%C3%A8gles%20m%C3%A9tier-192-16a34a?style=flat-square)](README.md#agent-skills)

**~100 familles de composants** · **17 thèmes** · **WCAG 2.2 AA** · **vérifié par axe dans un navigateur** ·
**24 outils IA** · **192 règles métier** · **10 skills** · **3 langues + RTL**

</div>

---

> La documentation complète est en anglais : [README.md](README.md). Cette page résume l'essentiel.

## Pourquoi UX-STING

| | |
| --- | --- |
| **~100 familles de composants** | Mise en page, typographie, boutons, formulaires complets, dates, navigation, fenêtres, retours, tableaux de données, médias, palette de commandes, e-commerce, effets et animations sans dépendance. |
| **Accessible par défaut** | WCAG 2.2 AA, clavier, gestion du focus, tests axe, jetons de couleur vérifiés en contraste. |
| **Jetons et thèmes** | Jetons sémantiques OKLCH en variables CSS, 17 thèmes (Material, Fluent, Carbon, Polaris, Apple, Stripe…), clair / sombre / contraste élevé. |
| **International** | RTL via les propriétés logiques, libellés traduits (en / fr / ar), formats `Intl` partout. |
| **Next.js d'abord** | App Router, composants serveur par défaut, un point d'entrée par composant. |
| **Votre code** | `npx ux-sting add dialog` copie la source dans votre projet. |
| **Intelligence design** | Hors ligne, dans les skills : 192 règles métier, 80 styles, 192 palettes, 74 paires de polices, 15 stratégies de présentation, 55 secteurs de logos → un design system et un thème UX-STING au contraste vérifié. |

## Démarrage rapide

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

<UIProvider theme="default">
  <Button loading>Enregistrer</Button>
</UIProvider>
```

Ou copiez la source des composants dans votre projet :

```bash
npx ux-sting init
npx ux-sting add button dialog data-table
```

## Du brief au thème

Décrivez votre produit ; le skill `ux-sting-taste` trouve les conventions de votre secteur
(structure de page, styles, palette, polices, et surtout ce qu'il faut éviter), puis votre agent
en tire trois directions artistiques dont au moins deux s'en écartent volontairement :

```bash
npx ux-sting skills add
python3 .claude/skills/ux-sting-taste/scripts/design_data.py system "beauty spa booking" --persist
python3 .claude/skills/ux-sting-taste/scripts/design_data.py search "glass dark premium" --domain style
```

Le résultat : `.ux-sting/taste/design-system/MASTER.md`, avec la palette vérifiée en contraste et
un extrait `createTheme(...)` prêt à coller. Astuce : les mots-clés anglais donnent les
correspondances les plus précises.

## Outils pour agents

```bash
npm install -D ux-sting @ux-sting/qa @ux-sting/extract @ux-sting/images
npx playwright-core install chromium

npx ux-sting qa http://localhost:3000        # audit navigateur : rapport + 3 corrections prioritaires
npx ux-sting extract https://example.com     # jetons de design (W3C DTCG) d'un site existant
npx ux-sting images "port à l'aube" --download 1   # images libres de droits, crédits inclus
```

## Compatible avec votre agent IA

Une commande installe les skills dans vos outils (détection automatique sans `--ai`) :

```bash
npx ux-sting skills add                    # outils détectés dans le projet
npx ux-sting skills add --ai cursor,windsurf
npx ux-sting skills add --ai all --global  # les 24 outils, pour tous vos projets
npx ux-sting skills hosts                  # liste des outils pris en charge
```

**Claude Code** : `/plugin marketplace add ssassam/UX-STING` puis `/plugin install ux-sting@ux-sting`.

| Skill | Rôle |
| --- | --- |
| **ux-sting-design-agent** | Agent universel : oriente chaque tâche UI vers le bon skill et vérifie toujours |
| **ux-sting** | Composants, jetons et thèmes, intégration de `@ux-sting/react` |
| **ux-sting-taste** | Direction artistique : des pages conçues, pas générées |
| **ux-sting-review** | Revue accessibilité / UX / design classée par gravité |
| **ux-sting-explore** | Plusieurs pistes visuelles côte à côte |
| **ux-sting-universal** | Référence → ADN design → page → QA navigateur |
| **ux-sting-3d** | Scènes three.js / WebGL performantes |
| **ux-sting-diagrams** | Diagrammes éditoriaux aux couleurs du thème |
| **ux-sting-slides** | Présentations (levée de fonds, vente, bilan trimestriel, conférence) planifiées diapo par diapo, exportées en PDF |
| **logo-design** | Logos et marques en SVG propre, données par secteur et kits d'identité |

## Licence et crédits

MIT. Merci de conserver cette mention et de citer **[VELTEIN](https://veltein.com)** et
**[UX-STING](https://github.com/ssassam/UX-STING)**. Contenus tiers : [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
