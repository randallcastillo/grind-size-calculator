// Grinder definitions with calibration data
// Conversion uses linear interpolation through microns:
//   setting -> microns -> setting on target grinder

const GRINDERS = {
  comandante: {
    name: "Comandante C40 MK4",
    type: "Manual",
    micronMin: 0,
    micronMax: 1090,
    settingMin: 0,
    settingMax: 40,
    settingUnit: "clicks",
    brewMethods: {
      turkish:     { min: 2,  max: 8 },
      espresso:    { min: 7,  max: 13 },
      moka:        { min: 14, max: 24 },
      aeropress:   { min: 12, max: 35 },
      v60:         { min: 15, max: 25 },
      siphon:      { min: 14, max: 29 },
      pourover:    { min: 16, max: 34 },
      filter:      { min: 12, max: 33 },
      steep:       { min: 17, max: 30 },
      cupping:     { min: 17, max: 31 },
      frenchpress: { min: 26, max: 40 },
      coldbrew:    { min: 30, max: 40 },
      colddrip:    { min: 31, max: 40 },
    },
  },
  timemore: {
    name: "Timemore C5 ESP Pro",
    type: "Manual",
    micronMin: 0,
    micronMax: 1250,
    settingMin: 0,
    settingMax: 150,
    settingUnit: "clicks",
    // Each rotation = 10 numbers × 5 ticks = 50 clicks
    // Display shows both R.N.T notation and total click count
    formatSetting(v) {
      const c = Math.max(0, Math.min(150, Math.round(v)));
      const rnt = `${Math.floor(c/50)}.${Math.floor((c%50)/5)}.${c%5}`;
      return { rnt, clicks: c, display: `${rnt} (${c} clicks)` };
    },
    parseSetting(str) {
      // Accept R.N.T format (e.g. "1.3.2") or plain click number (e.g. "67")
      const trimmed = str.trim();
      const p = trimmed.split(".");
      if (p.length === 3) {
        return (Number.parseInt(p[0])||0)*50 + (Number.parseInt(p[1])||0)*5 + (Number.parseInt(p[2])||0);
      }
      return Number.parseFloat(trimmed);
    },
    brewMethods: {
      turkish:     { min: 5,   max: 26 },
      espresso:    { min: 22,  max: 45 },
      moka:        { min: 44,  max: 79 },
      aeropress:   { min: 39,  max: 115 },
      v60:         { min: 48,  max: 84 },
      siphon:      { min: 45,  max: 96 },
      pourover:    { min: 50,  max: 111 },
      filter:      { min: 36,  max: 107 },
      steep:       { min: 54,  max: 98 },
      cupping:     { min: 56,  max: 101 },
      frenchpress: { min: 83,  max: 150 },
      coldbrew:    { min: 96,  max: 150 },
      colddrip:    { min: 99,  max: 150 },
    },
  },
  timemoreS3: {
    name: "Timemore Chestnut S3",
    type: "Manual",
    // Official manual: 0.015mm (15μm) per click, 0–9.0 range
    // 90 sub-clicks × 15μm = 1350μm total
    micronMin: 0,
    micronMax: 1350,
    // Stored internally ×10 (e.g. 4.2 clicks = 42)
    settingMin: 0,
    settingMax: 90,
    settingUnit: "clicks",
    formatSetting(v) {
      const c = Math.max(0, Math.min(90, Math.round(v)));
      const display = (c / 10).toFixed(1);
      return { rnt: display, clicks: display, display: `${display} clicks` };
    },
    parseSetting(str) {
      return Math.round(Number.parseFloat(str.trim()) * 10);
    },
    brewMethods: {
      // Official Timemore sources marked with [T]
      // Micron-derived ranges marked with [M] (target μm ÷ 15μm/click)
      turkish:     null,                   // S3 not suitable (CoffeeGeek)
      espresso:    { min: 1,  max: 15 },   // [T] 0.1–1.5 clicks (timemore.com: 1-15)
      moka:        { min: 5,  max: 20 },   // [T] 0.5–2.0 clicks (official manual)
      aeropress:   { min: 21, max: 64 },   // [M] 320–960μm
      v60:         { min: 27, max: 47 },   // [M] 400–700μm
      siphon:      { min: 25, max: 53 },   // [M] 375–800μm
      pourover:    { min: 50, max: 80 },   // [T] 5.0–8.0 clicks (official manual)
      filter:      { min: 20, max: 60 },   // [M] 300–900μm
      steep:       { min: 30, max: 55 },   // [M] 450–825μm
      cupping:     { min: 31, max: 57 },   // [M] 460–850μm
      frenchpress: { min: 80, max: 90 },   // [T] 8.0–9.0 clicks (official manual)
      coldbrew:    { min: 53, max: 90 },   // [M] 800–1400μm (capped at 90)
      colddrip:    { min: 55, max: 85 },   // [M] 820–1270μm
    },
  },
  baratza: {
    name: "Baratza Encore",
    type: "Electric",
    micronMin: 250,
    micronMax: 1200,
    settingMin: 0,
    settingMax: 40,
    settingUnit: "setting",
    brewMethods: {
      turkish:     null,
      espresso:    { min: 0,  max: 5 },
      moka:        { min: 5,  max: 17 },
      aeropress:   { min: 3,  max: 29 },
      v60:         { min: 7,  max: 18 },
      siphon:      { min: 6,  max: 23 },
      pourover:    { min: 7,  max: 28 },
      filter:      { min: 3,  max: 27 },
      steep:       { min: 9,  max: 24 },
      cupping:     { min: 9,  max: 25 },
      frenchpress: { min: 19, max: 40 },
      coldbrew:    { min: 24, max: 40 },
      colddrip:    { min: 24, max: 40 },
    },
  },
};
