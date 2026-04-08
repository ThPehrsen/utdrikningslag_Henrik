# GitHub Pages – publiseringsguide

Denne mappen er klargjort for GitHub Pages med disse filene:
- index.html
- styles.css
- app.js
- .nojekyll

## 1) Lag et nytt repository på GitHub

Forslag til navn:
- henrikslag-2026

Velg:
- Public (enklest for GitHub Pages)
- Ikke nødvendig med README fra GitHub (du har allerede filer lokalt)

## 2) Last opp filene

### Alternativ A: Via nettleser (enklest)
1. Åpne repoet på GitHub.
2. Velg Add file → Upload files.
3. Dra inn alle filer fra denne mappen.
4. Commit til main.

### Alternativ B: Via Git (PowerShell)
Kjør i mappen:

git init
git add .
git commit -m "Initial Henrikslag Pages site"
git branch -M main
git remote add origin https://github.com/<brukernavn>/henrikslag-2026.git
git push -u origin main

## 3) Aktiver GitHub Pages

1. Gå til repo → Settings → Pages.
2. Under Build and deployment:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
3. Save.

Etter 1–3 minutter får du URL, typisk:
https://<brukernavn>.github.io/henrikslag-2026/

## 4) Oppdater ved endringer

Etter at du endrer innhold lokalt:

git add .
git commit -m "Oppdater plan"
git push

GitHub Pages publiserer automatisk ny versjon.

## 5) Feilsøking

- Ser du ikke oppdateringer? Hard refresh i mobil/nettleser.
- 404-feil: sjekk at index.html ligger i rotmappen.
- Feil URL: vent et par minutter etter aktivering.
- Privat repo uten betalt plan kan begrense Pages-bruk.

## Tips for deling

- Del URL i Messenger/Teams.
- Fest lenken i gruppa.
- Be alle åpne siden én gang tidlig, så ligger den lett tilgjengelig i historikken på mobilen.
