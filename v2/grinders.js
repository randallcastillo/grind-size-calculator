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
        return (parseInt(p[0])||0)*50 + (parseInt(p[1])||0)*5 + (parseInt(p[2])||0);
      }
      return parseFloat(trimmed);
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
