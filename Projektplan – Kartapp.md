# 🗺️ Projektplan – Kartutvecklingsapplikation

## 📦 Setup

- [x] Initiera React-app med TypeScript
- [x] Installera TailwindCSS + Shadcn UI
- [x] Installera och konfigurera React Router
- [ ] Strukturera grundläggande ruttstruktur (`/map`, `/properties`, `/locations`, etc.)
- [(x)] Layout: Navbar för navigering mellan sidor

---

## 🗺️ Kartfunktionalitet

- [x] Installera MapLibre GL JS
- [x] Visa karta över Sverige
- [x] Lägg till zoom och panorering

---

## ✏️ Rita & Interagera

- [x] Lägg till funktion för att rita polygoner på karta
- [x] Lägg till funktion för att sätta en punkt/markör på karta
- [ ] Lägg till funktion för att rita ett område för sökning

---

## 🧾 Formulär & Datainmatning

- [x] Skapa formulär för att spara **fastighet**
  - Beteckning
  - Adresser
  - Byggår
- [ ] Skapa formulär för att spara **lokal**
  - Adress
  - Info/beskrivning
- [ ] Skapa formulär för att spara **sökområde**
- [ ] Koppla sparade former/punkter till respektive formulär
- [ ] Spara data i lokal state (eller localStorage/mock-backend)

---

## 📋 Objektlistor & Filtrering

- [ ] Visa alla sparade objekt (Fastigheter, Lokaler, Sökområden)
- [ ] Möjlighet att filtrera på typ
- [ ] Visa vald objekt på karta vid klick

---

## 🔁 Användarflöden

- [ ] Lägg till ny fastighet genom att rita polygon och fylla i formulär
- [ ] Lägg till en lokal och koppla till en fastighet
- [ ] Navigera mellan sidor
- [ ] Sök efter sparade objekt inom ett ritat område
- [ ] Se karta med alla sparade objekt, kategoriserade

---

## 🧪 Test & Finlir

- [ ] Testa alla flöden
- [ ] UX-förbättringar
- [ ] Demo redo
