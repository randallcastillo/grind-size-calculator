// Coffee Grind Size Calculator - Data & Logic
"use strict";

// Micron ranges per brew method (from Honest Coffee Guide research)
const BREW_METHODS = [
  { id: "turkish",       name: "Turkish",              icon: "☕", micronMin: 40,  micronMax: 220 },
  { id: "espresso",      name: "Espresso",             icon: "⚡", micronMin: 180, micronMax: 380 },
  { id: "moka",          name: "Moka Pot",             icon: "🫖", micronMin: 360, micronMax: 660 },
  { id: "aeropress",     name: "AeroPress",            icon: "🔽", micronMin: 320, micronMax: 960 },
  { id: "v60",           name: "V60",                  icon: "🔻", micronMin: 400, micronMax: 700 },
  { id: "siphon",        name: "Siphon",               icon: "🧪", micronMin: 375, micronMax: 800 },
  { id: "pourover",      name: "Pour Over",            icon: "💧", micronMin: 410, micronMax: 930 },
  { id: "filter",        name: "Filter Coffee Machine", icon: "▦", micronMin: 300, micronMax: 900 },
  { id: "steep",         name: "Steep-and-Release",    icon: "⏳", micronMin: 450, micronMax: 825 },
  { id: "cupping",       name: "Cupping",              icon: "🥄", micronMin: 460, micronMax: 850 },
  { id: "frenchpress",   name: "French Press",         icon: "🫗", micronMin: 690, micronMax: 1300 },
  { id: "coldbrew",      name: "Cold Brew",            icon: "🧊", micronMin: 800, micronMax: 1400 },
  { id: "colddrip",      name: "Cold Drip",            icon: "❄️", micronMin: 820, micronMax: 1270 },
];
