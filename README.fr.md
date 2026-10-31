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
[![Règles métier](https://img.shields.io/badge/r%C3%A8gles%20m%C3%A9tier-192-16a34a?style=flat-square)](packages/catalog)

**~100 familles de composants** · **17 thèmes** · **WCAG 2.2 AA** · **vérifié par axe dans un navigateur** ·
**24 outils IA** · **192 règles métier** · **3 langues + RTL**

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
| **Intelligence design** | `npx ux-sting brief "<idée>"` : 192 règles métier, 80+ styles, 192 palettes, 74 paires de polices → un thème UX-STING au contraste vérifié. |

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

Décrivez votre produit ; UX-STING choisit la structure de page, le style, la palette et les polices
adaptés à votre secteur, puis écrit un thème prêt à l'emploi :

```bash
npm install -D ux-sting @ux-sting/catalog
npx ux-sting brief "salon de beauté avec réservation" --out src/theme
npx ux-sting search styles "verre sombre premium"
```

Le résultat : `<nom>.theme.ts`, `.theme.json`, `.css` et `design-system.md` — avec ce qu'il faut
éviter pour ce secteur et une checklist avant livraison. Astuce : les mots-clés anglais
(« beauty spa booking ») donnent les correspondances les plus précises.

## Outils pour agents

```bash
npm install -D ux-sting @ux-sting/qa @ux-sting/extract @ux-sting/images
npx playwright-core install chromium

npx ux-sting qa http://localhost:3000        # audit navigateur : rapport + 3 corrections prioritaires
npx ux-sting extract https://example.com     # jetons de design (W3C DTCG) d'un site existant
npx ux-sting images "port à l'aube" --download 1   # images libres de droits, crédits inclus
```

## Compatible avec votre agent IA

Une commande installe les skills dans l'outil de votre choix (détection automatique sans `--ai`) :

```bash
npx ux-sting init --ai cursor     # claude, codex, copilot, gemini, windsurf, kiro, roocode, trae… ou all
npx ux-sting skills --ai all --global
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
| **logo-design** | Logos et marques en SVG propre |

## Licence et crédits

MIT. Merci de conserver cette mention et de citer **[VELTEIN](https://veltein.com)** et
**[UX-STING](https://github.com/ssassam/UX-STING)**. Contenus tiers : [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
