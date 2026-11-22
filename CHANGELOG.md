# Changelog (SemVer)
## 1.6.0
- Real anatomy images (male/female × front/back, ~36 KB WebP each, lazy: only the shown one loads) replace the drawn silhouette; clickable zones re-mapped on the photos
- Male/Female and Front/Back toggles above the figure (linked with Settings > Sex)
- CSP allows same-origin images; build copies images and preloads the default one
## 1.5.2
- AI prompt is now written in the UI language (Persian and French; English otherwise)
- "Copy text" button under the text box (EN/FA/FR) for the AI prompt, doctor summary and report, with status message and manual-copy fallback
- Exported .txt report now contains everything: summary, all links, AI prompt and doctor summary
## 1.5.1
- Flat static build option (FLAT=1): fa.html / fr.html instead of folders
## 1.5.0
- Final step: "Build AI prompt" (copy-ready prompt with region, pain type, country; asks clarifying questions and a structured plan) and "Doctor summary" (fill-in history sheet + questions to ask), both in EN/FA/FR, shown for review and copied only locally
- Settings: sex (male/female/no preference) – adjusts torso/pelvis outline and adds sex-specific parts and pain types (pregnancy-related, pelvic floor, gout-flare, lifting etc.), all optional
- Site URL set to https://physioultant.configym.com (canonical, hreflang, sitemap, CNAME)
## 1.4.0 – performance & SEO
Static per-language pages (/, /fa/, /fr/), metadata, hreflang, JSON-LD, sitemap/robots, OG image, build script with minification + CSP hash + size budget, GitHub Actions deploy, Lighthouse CI config, perf fixes (lazy settings, blob URL revoke, no fixed bg, CLS reservations).
## 1.3.0 – accessibility & redesign: settings (theme, accent, text size, layout, density, motion, contrast, readable font), a11y improvements.
## 1.2.1 – security hardening (CSP, input whitelist, privacy notice). ## 1.2.0 – front/back view, export, country-based pharmacies. ## 1.1.0 – anatomy detail, more parts. ## 1.0.0 – first release.
- Page budget raised from 24 to 28 KB gzip (new text/features); measured ~24-25 KB
