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
    name: "Timemore S3",
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
      return Math.round(Number.Number.parseFloat(str.trim()) * 10);
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
  timemoreC5Pro: {
    name: "Timemore C5 Pro",
    type: "Manual",
    // 0.031mm (31μm) per click, 48 total clicks, 16 macro steps × 3 clicks each
    // 3-click buffer at zero. Effective range: click 3–48
    // HCG says 0–950μm; official spec: 48 × 31μm = 1488μm theoretical
    // Using HCG range as it reflects real-world output
    micronMin: 0,
    micronMax: 950,
    // HCG notation: macro.sub (e.g. 3.2 = macro 3, sub-click 2)
    // Internally stored as total clicks: macro × 3 + sub
    // Max setting 16.0 = 48 clicks
    settingMin: 0,
    settingMax: 48,
    settingUnit: "clicks",
    formatSetting(v) {
      const c = Math.max(0, Math.min(48, Math.round(v)));
      const macro = Math.floor(c / 3);
      const sub = c % 3;
      const notation = sub === 0 ? `${macro}` : `${macro}.${sub}`;
      return { rnt: notation, clicks: c, display: `${notation} (${c} clicks)` };
    },
    parseSetting(str) {
      const trimmed = str.trim();
      const parts = trimmed.split(".");
      if (parts.length === 2) {
        return (Number.parseInt(parts[0]) || 0) * 3 + (Number.parseInt(parts[1]) || 0);
      }
      // Plain number — could be macro or clicks
      const num = Number.parseFloat(trimmed);
      // If > 16, treat as raw clicks; otherwise treat as macro number
      if (num > 16) return Math.round(num);
      return Math.round(num * 3);
    },
    brewMethods: {
      // From Honest Coffee Guide (converted to internal click values)
      // Setting X.Y = X×3 + Y clicks
      turkish:     { min: 3,  max: 10 },  // 1 – 3.2 (3–10 clicks)
      espresso:    { min: 9,  max: 18 },  // 3.1 – 6.1 (10–19 clicks) → 9–18
      moka:        { min: 18, max: 33 },  // 6.1 – 11 (19–33 clicks) → 18–33
      aeropress:   { min: 16, max: 48 },  // 5.2 – 16 (16–48 clicks)
      v60:         { min: 21, max: 34 },  // 7 – 11.2 (21–34 clicks)
      siphon:      { min: 18, max: 39 },  // 6.1 – 13.1 (19–40 clicks) → 18–39
      pourover:    { min: 21, max: 45 },  // 7 – 15.1 (21–46 clicks) → 21–45
      filter:      { min: 15, max: 45 },  // 5.1 – 15 (16–45 clicks) → 15–45
      steep:       { min: 22, max: 40 },  // 7.2 – 13.2 (22–40 clicks)
      cupping:     { min: 24, max: 42 },  // 8 – 14 (24–42 clicks)
      frenchpress: { min: 34, max: 48 },  // 11.2 – 16 (34–48 clicks)
      coldbrew:    { min: 40, max: 48 },  // 13.2 – 16 (40–48 clicks)
      colddrip:    { min: 42, max: 48 },  // 14 – 16 (42–48 clicks)
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
