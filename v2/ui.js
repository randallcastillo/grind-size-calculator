// UI initialization and event handling
document.addEventListener("DOMContentLoaded", () => {
  const grinderKeys = Object.keys(GRINDERS);

  // Populate grinder selects
  const srcSelect = document.getElementById("source-grinder");
  const tgtSelect = document.getElementById("target-grinder");
  grinderKeys.forEach((key, i) => {
    const g = GRINDERS[key];
    srcSelect.add(new Option(g.name, key));
    tgtSelect.add(new Option(g.name, key));
  });
  // Default: Comandante -> Timemore
  srcSelect.value = "comandante";
  tgtSelect.value = "timemore";

  // Populate brew method select
  const brewSelect = document.getElementById("brew-method");
  BREW_METHODS.forEach(m => {
    brewSelect.add(new Option(`${m.icon}  ${m.name}`, m.id));
  });

  // Update hints for selected grinders
  function grinderHint(g) {
    if (g.formatSetting) {
      // Grinder with special notation (e.g. Timemore R.N.T)
      return `0–${g.settingMax} clicks · Enter R.N.T (e.g. 1.3.2) or click number (e.g. 67)`;
    }
    return `Range: ${g.settingMin}–${g.settingMax} ${g.settingUnit}`;
  }
  function updateHints() {
    document.getElementById("source-hint").textContent = grinderHint(GRINDERS[srcSelect.value]);
    document.getElementById("target-hint").textContent = grinderHint(GRINDERS[tgtSelect.value]);
  }

  // Converter logic
  function doConvert() {
    const srcKey = srcSelect.value;
    const tgtKey = tgtSelect.value;
    const sg = GRINDERS[srcKey];
    const tg = GRINDERS[tgtKey];
    const raw = document.getElementById("source-value").value.trim();
    if (!raw) {
      document.getElementById("result-value").textContent = "—";
      document.getElementById("micron-display").textContent = "— μm";
      return;
    }
    const numericSrc = parseGrinderSetting(sg, raw);
    if (isNaN(numericSrc)) {
      document.getElementById("result-value").textContent = "Invalid";
      document.getElementById("micron-display").textContent = "— μm";
      return;
    }
    const { microns, targetSetting } = convertSetting(sg, tg, numericSrc);
    const micronRound = Math.round(microns);
    document.getElementById("micron-display").textContent =
      `≈ ${micronRound} μm · ${grindCategory(micronRound)}`;
    const rich = formatGrinderSettingRich(tg, targetSetting);
    const resultEl = document.getElementById("result-value");
    if (rich) {
      // Show R.N.T notation with clicks count below
      resultEl.innerHTML =
        `<span>${rich.rnt}</span><span class="click-count">${rich.clicks} clicks</span>`;
    } else {
      resultEl.textContent = `${formatGrinderSetting(tg, targetSetting)} ${tg.settingUnit}`;
    }

    // Warn if out of range
    if (microns < tg.micronMin || microns > tg.micronMax) {
      document.getElementById("result-value").textContent += " ⚠️";
      document.getElementById("target-hint").textContent =
        "Outside target grinder range — result is extrapolated";
    } else {
      updateHints();
    }
  }

  // Swap button
  document.getElementById("swap-btn").addEventListener("click", () => {
    const tmp = srcSelect.value;
    srcSelect.value = tgtSelect.value;
    tgtSelect.value = tmp;
    updateHints();
    doConvert();
  });

  // Event listeners
  document.getElementById("source-value").addEventListener("input", doConvert);
  srcSelect.addEventListener("change", () => { updateHints(); doConvert(); });
  tgtSelect.addEventListener("change", () => { updateHints(); doConvert(); });

  // --- Microns to Grinder converter ---
  const micronTargetSelect = document.getElementById("micron-target-grinder");
  grinderKeys.forEach(key => {
    micronTargetSelect.add(new Option(GRINDERS[key].name, key));
  });
  micronTargetSelect.value = "comandante";

  function updateMicronTargetHint() {
    document.getElementById("micron-target-hint").textContent =
      grinderHint(GRINDERS[micronTargetSelect.value]);
  }

  function doMicronConvert() {
    const raw = document.getElementById("micron-input").value.trim();
    const resultEl = document.getElementById("micron-result-value");
    const catEl = document.getElementById("micron-category");
    if (!raw) {
      resultEl.textContent = "—";
      catEl.textContent = "—";
      return;
    }
    const microns = Number.parseFloat(raw);
    if (isNaN(microns) || microns < 0) {
      resultEl.textContent = "Invalid";
      catEl.textContent = "—";
      return;
    }
    catEl.textContent = grindCategory(microns);
    const tg = GRINDERS[micronTargetSelect.value];
    const targetSetting = micronsToSetting(tg, microns);
    const rich = formatGrinderSettingRich(tg, targetSetting);
    if (rich) {
      resultEl.innerHTML =
        `<span>${rich.rnt}</span><span class="click-count">${rich.clicks} clicks</span>`;
    } else {
      resultEl.textContent = `${formatGrinderSetting(tg, targetSetting)} ${tg.settingUnit}`;
    }
    // Warn if outside grinder range
    const hintEl = document.getElementById("micron-target-hint");
    if (microns < tg.micronMin || microns > tg.micronMax) {
      hintEl.textContent = "⚠️ Outside grinder range — result is extrapolated";
    } else {
      updateMicronTargetHint();
    }
  }

  document.getElementById("micron-input").addEventListener("input", doMicronConvert);
  micronTargetSelect.addEventListener("change", () => { updateMicronTargetHint(); doMicronConvert(); });
  updateMicronTargetHint();

  // Brew method reference
  function renderBrewResults() {
    const methodId = brewSelect.value;
    const method = BREW_METHODS.find(m => m.id === methodId);
    const container = document.getElementById("brew-results");
    container.innerHTML = "";
    grinderKeys.forEach(key => {
      const g = GRINDERS[key];
      const range = g.brewMethods[methodId];
      const div = document.createElement("div");
      div.className = "brew-result-item";
      const rangeStr = formatBrewRange(g, methodId);
      const micronStr = range
        ? `≈ ${Math.round(settingToMicrons(g, range.min))}–${Math.round(settingToMicrons(g, range.max))} μm`
        : "";
      const unitLabel = g.formatSetting ? "" : ` ${g.settingUnit}`;
      div.innerHTML = `
        <div class="grinder-name">${g.name} <span style="color:var(--text2);font-weight:400;font-size:.8rem">(${g.type})</span></div>
        <div class="grinder-range">${rangeStr}${unitLabel}</div>
        <div class="micron-range">${micronStr}</div>`;
      container.appendChild(div);
    });
  }
  brewSelect.addEventListener("change", renderBrewResults);

  // Reference table tabs
  function renderTabs() {
    const tabBar = document.getElementById("grinder-tabs");
    tabBar.innerHTML = "";
    grinderKeys.forEach((key, i) => {
      const btn = document.createElement("button");
      btn.textContent = GRINDERS[key].name;
      btn.dataset.key = key;
      if (i === 0) btn.classList.add("active");
      btn.addEventListener("click", () => {
        tabBar.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderTable(key);
      });
      tabBar.appendChild(btn);
    });
  }

  function renderTable(grinderKey) {
    const g = GRINDERS[grinderKey];
    const wrap = document.getElementById("reference-table");
    let html = `<table><thead><tr>
      <th>Brew Method</th>
      <th>Setting (${g.settingUnit})</th>
      <th>Micron Range</th>
      <th>Grind Size</th>
    </tr></thead><tbody>`;
    BREW_METHODS.forEach(m => {
      const range = g.brewMethods[m.id];
      const settingStr = formatBrewRange(g, m.id);
      const micronStr = getBrewMicronRange(m.id);
      const midMicron = (m.micronMin + m.micronMax) / 2;
      const cat = range ? grindCategory(midMicron) : "—";
      html += `<tr>
        <td>${m.icon} ${m.name}</td>
        <td>${settingStr}</td>
        <td>${micronStr}</td>
        <td>${cat}</td>
      </tr>`;
    });
    html += "</tbody></table>";
    wrap.innerHTML = html;
  }

  // Micron scale visualization
  function renderScale() {
    const container = document.getElementById("micron-scale");
    const maxMicron = 1400;
    const colors = [
      "#8B4513","#A0522D","#B8733D","#C4944A",
      "#C8A860","#A8B060","#88A870"
    ];
    const categories = [
      { label: "Extra Fine",    min: 0,    max: 200 },
      { label: "Fine",          min: 200,  max: 400 },
      { label: "Medium Fine",   min: 400,  max: 600 },
      { label: "Medium",        min: 600,  max: 800 },
      { label: "Medium Coarse", min: 800,  max: 1000 },
      { label: "Coarse",        min: 1000, max: 1200 },
      { label: "Extra Coarse",  min: 1200, max: 1400 },
    ];
    container.innerHTML = "";
    categories.forEach((cat, i) => {
      const row = document.createElement("div");
      row.className = "scale-row";
      const pctLeft = (cat.min / maxMicron) * 100;
      const pctWidth = ((cat.max - cat.min) / maxMicron) * 100;
      row.innerHTML = `
        <div class="scale-label">${cat.label}</div>
        <div class="scale-bar-wrap">
          <div class="scale-bar" style="left:${pctLeft}%;width:${pctWidth}%;background:${colors[i]}"></div>
        </div>
        <div class="scale-range">${cat.min}–${cat.max} μm</div>`;
      container.appendChild(row);
    });
  }

  // Initialize
  updateHints();
  renderBrewResults();
  renderTabs();
  renderTable(grinderKeys[0]);
  renderScale();
});
