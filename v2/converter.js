// Conversion engine

function settingToMicrons(grinder, setting) {
  const range = grinder.settingMax - grinder.settingMin;
  if (range === 0) return grinder.micronMin;
  const t = (setting - grinder.settingMin) / range;
  return grinder.micronMin + t * (grinder.micronMax - grinder.micronMin);
}

function micronsToSetting(grinder, microns) {
  const range = grinder.micronMax - grinder.micronMin;
  if (range === 0) return grinder.settingMin;
  const t = (microns - grinder.micronMin) / range;
  const raw = grinder.settingMin + t * (grinder.settingMax - grinder.settingMin);
  return Math.max(grinder.settingMin, Math.min(grinder.settingMax, raw));
}

function convertSetting(sourceGrinder, targetGrinder, sourceSetting) {
  const microns = settingToMicrons(sourceGrinder, sourceSetting);
  const targetSetting = micronsToSetting(targetGrinder, microns);
  return { microns, targetSetting };
}

function formatGrinderSetting(grinder, numericVal) {
  if (grinder.formatSetting) {
    const result = grinder.formatSetting(numericVal);
    // formatSetting may return an object with {rnt, clicks, display}
    if (typeof result === "object") return result.display;
    return result;
  }
  return Math.round(numericVal).toString();
}

// Returns structured data for rich rendering (used by UI)
function formatGrinderSettingRich(grinder, numericVal) {
  if (grinder.formatSetting) {
    const result = grinder.formatSetting(numericVal);
    if (typeof result === "object") return result;
  }
  return null;
}

function parseGrinderSetting(grinder, str) {
  if (grinder.parseSetting) return grinder.parseSetting(str);
  return parseFloat(str);
}

function formatBrewRange(grinder, methodId) {
  const range = grinder.brewMethods[methodId];
  if (!range) return "N/A";
  const minStr = formatGrinderSetting(grinder, range.min);
  const maxStr = formatGrinderSetting(grinder, range.max);
  return `${minStr} – ${maxStr}`;
}

function getBrewMicronRange(methodId) {
  const method = BREW_METHODS.find(m => m.id === methodId);
  return method ? `${method.micronMin}–${method.micronMax} μm` : "";
}

// Grind size category from microns
function grindCategory(microns) {
  if (microns < 200) return "Extra Fine";
  if (microns < 400) return "Fine";
  if (microns < 600) return "Medium Fine";
  if (microns < 800) return "Medium";
  if (microns < 1000) return "Medium Coarse";
  if (microns < 1200) return "Coarse";
  return "Extra Coarse";
}
