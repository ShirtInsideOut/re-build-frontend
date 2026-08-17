const API_BASE = "https://re-build-backend-1.onrender.com";

const state = {
  mode: "craft",
  materials: [],
  purpose: null,
  budget: null,
  difficulty: null,
  time: null,
  lastProject: null
};

const screens = ["intro", "mode", "materials", "purpose", "budget", "difficulty", "time", "loading", "doof", "result"];

const catalog = {
  craft: [
    ["▱", "Cardboard Box", "Boxes & packaging"],
    ["○", "Plastic Bottle", "PET bottles"],
    ["●", "Bottle Cap", "Plastic caps"],
    ["▤", "Tin Can", "Food & drink cans"],
    ["╫", "Ice-Cream Sticks", "Wooden sticks"],
    ["▥", "Egg Carton", "Cardboard carton"],
    ["◫", "Toilet Paper Roll", "Paper tubes"],
    ["≋", "Newspaper", "Old newspapers"],
    ["▤", "Magazine", "Old magazines"],
    ["▱", "Paper Bag", "Paper packaging"],
    ["□", "Plastic Container", "Food containers"],
    ["◇", "Glass Jar", "Used jars"],
    ["⌂", "Old T-Shirt", "Old clothing"],
    ["▥", "Jeans", "Old denim"],
    ["≈", "Fabric Scraps", "Leftover fabric"],
    ["•", "Buttons", "Loose buttons"],
    ["⌁", "Shoelaces", "Old laces"],
    ["○", "Cork", "Bottle corks"],
    ["◉", "Old CD", "Unused discs"],
    ["⌁", "Wire", "Loose wire"]
  ],
  tech: [
    ["⌁", "USB Cable", "Old data/charging cable"],
    ["▣", "Old Charger", "Unused charger"],
    ["◌", "Earphones", "Old wired earphones"],
    ["◉", "Computer Mouse", "Old mouse"],
    ["⌨", "Keyboard", "Old keyboard"],
    ["▣", "Remote", "Old remote control"],
    ["✦", "LED Bulb", "Low-voltage LED bulb"],
    ["✧", "Fairy Lights", "Battery/USB fairy lights"],
    ["◉", "Small Speaker", "Small portable speaker"],
    ["↻", "DC Motor", "Small DC motor"],
    ["◌", "Computer Fan", "Small fan"],
    ["▣", "Old Phone", "Old phone/device"],
    ["▦", "Circuit Board", "Loose board"],
    ["▰", "Power Bank", "Old power bank"],
    ["✦", "LED Strip", "Low-voltage LED strip"],
    ["□", "Switches", "Small switches"],
    ["✦", "LEDs", "Loose LEDs"],
    ["⌁", "Wires", "Low-voltage wires"]
  ]
};

const purposes = [
  ["Organization", "Storage, desk & room organization", "▦"],
  ["Decoration", "Something cool for your space", "✦"],
  ["Study", "Useful for school & studying", "⌁"],
  ["Gaming", "A gaming-related build", "◇"],
  ["Gardening", "Plants, pots & garden utility", "✿"],
  ["Utility", "A practical everyday object", "⚙"]
];

const budgets = [
  [0, "₹0", "Use only what you already have", "FREE"],
  [50, "₹50", "Small amount for extras", "LOW"],
  [100, "₹100", "More room for materials", "MID"],
  [250, "₹250", "Flexible project budget", "HIGH"],
  [500, "₹500", "Maximum build flexibility", "MAX"]
];

const difficulties = [
  ["Easy", "Beginner-friendly", "01"],
  ["Intermediate", "A little more challenging", "02"],
  ["Hard", "Ambitious & advanced", "03"]
];

const times = [
  ["30 minutes", "Quick build", "30M"],
  ["1 hour", "Standard project", "1H"],
  ["2 hours", "Longer build", "2H"],
  ["Half a day", "Take your time", "½D"]
];

const $ = (id) => document.getElementById(id);

function showScreen(name) {
  screens.forEach((screen) => {
    const el = $(`screen-${screen}`);
    if (el) el.classList.toggle("active", screen === name);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setError(id, message = "") {
  $(id).textContent = message;
}

function clearErrors() {
  ["materialError", "purposeError", "budgetError", "difficultyError", "timeError", "apiError"].forEach((id) => setError(id));
}

function renderMaterials() {
  const container = $("materials");
  container.innerHTML = "";
  catalog[state.mode].forEach(([icon, name, description]) => {
    const button = document.createElement("button");
    button.className = "material-card";
    button.type = "button";
    button.dataset.name = name;
    button.innerHTML = `
      <span class="material-icon">${icon}</span>
      <span class="material-copy"><strong>${name}</strong><small>${description}</small></span>
      <span class="material-check">✓</span>`;
    button.addEventListener("click", () => toggleMaterial(name, button));
    container.appendChild(button);
  });
}

function toggleMaterial(name, button) {
  if (state.materials.includes(name)) {
    state.materials = state.materials.filter((item) => item !== name);
    button.classList.remove("selected");
  } else {
    state.materials.push(name);
    button.classList.add("selected");
  }
  $("materialCount").textContent = `${state.materials.length} SELECTED`;
  setError("materialError");
}

function renderOptions() {
  const purposeContainer = $("purposes");
  purposeContainer.innerHTML = purposes.map(([value, desc, icon]) => `
    <button class="choice-card ${state.purpose === value ? "selected" : ""}" data-purpose="${value}" type="button">
      <span class="choice-icon">${icon}</span><span class="choice-copy"><strong>${value}</strong><small>${desc}</small></span><span class="choice-mark">✓</span>
    </button>`).join("");
  purposeContainer.querySelectorAll("[data-purpose]").forEach((button) => button.addEventListener("click", () => {
    state.purpose = button.dataset.purpose;
    purposeContainer.querySelectorAll(".choice-card").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    setError("purposeError");
  }));

  const budgetContainer = $("budgets");
  budgetContainer.innerHTML = budgets.map(([value, label, desc, tag]) => `
    <button class="choice-card ${state.budget === value ? "selected" : ""}" data-budget="${value}" type="button">
      <span class="choice-tag">${tag}</span><span class="choice-copy"><strong>${label}</strong><small>${desc}</small></span><span class="choice-mark">✓</span>
    </button>`).join("");
  budgetContainer.querySelectorAll("[data-budget]").forEach((button) => button.addEventListener("click", () => {
    state.budget = Number(button.dataset.budget);
    budgetContainer.querySelectorAll(".choice-card").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    setError("budgetError");
  }));

  const difficultyContainer = $("difficulties");
  difficultyContainer.innerHTML = difficulties.map(([value, desc, number]) => `
    <button class="difficulty-card ${state.difficulty === value ? "selected" : ""}" data-difficulty="${value}" type="button">
      <span class="difficulty-number">${number}</span><span><strong>${value}</strong><small>${desc}</small></span><span class="choice-mark">✓</span>
    </button>`).join("");
  difficultyContainer.querySelectorAll("[data-difficulty]").forEach((button) => button.addEventListener("click", () => {
    state.difficulty = button.dataset.difficulty;
    difficultyContainer.querySelectorAll(".difficulty-card").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    setError("difficultyError");
  }));

  const timeContainer = $("times");
  timeContainer.innerHTML = times.map(([value, desc, tag]) => `
    <button class="choice-card ${state.time === value ? "selected" : ""}" data-time="${value}" type="button">
      <span class="choice-tag">${tag}</span><span class="choice-copy"><strong>${value}</strong><small>${desc}</small></span><span class="choice-mark">✓</span>
    </button>`).join("");
  timeContainer.querySelectorAll("[data-time]").forEach((button) => button.addEventListener("click", () => {
    state.time = button.dataset.time;
    timeContainer.querySelectorAll(".choice-card").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    setError("timeError");
  }));
}

function selectMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".mode-card").forEach((card) => card.classList.toggle("selected", card.dataset.mode === mode));
  $("modeStatus").textContent = `${mode.toUpperCase()} MODE`;
  state.materials = [];
  $("materialCount").textContent = "0 SELECTED";
  renderMaterials();
}

function validateBeforeGenerate() {
  let valid = true;
  if (!state.materials.length) { setError("materialError", "Select at least one material."); valid = false; }
  if (!state.purpose) { setError("purposeError", "Choose a purpose."); valid = false; }
  if (state.budget === null) { setError("budgetError", "Choose a budget."); valid = false; }
  if (!state.difficulty) { setError("difficultyError", "Choose a difficulty."); valid = false; }
  if (!state.time) { setError("timeError", "Choose a time limit."); valid = false; }
  return valid;
}

function loadingSequence() {
  const messages = [
    "Sorting possibilities...",
    "Matching your materials...",
    "Checking the budget...",
    "Running the Doof filter...",
    "Assembling something useful..."
  ];
  let index = 0;
  let progress = 8;
  $("loadingText").textContent = messages[0];
  $("progressBar").style.width = `${progress}%`;
  const timer = setInterval(() => {
    index = (index + 1) % messages.length;
    progress = Math.min(progress + 18, 88);
    $("loadingText").textContent = messages[index];
    $("progressBar").style.width = `${progress}%`;
  }, 750);
  return () => clearInterval(timer);
}

async function generateInvention() {
  clearErrors();
  if (!validateBeforeGenerate()) return;

  showScreen("loading");
  const stopLoading = loadingSequence();

  const payload = {
    mode: state.mode,
    materials: state.materials,
    purpose: state.purpose,
    budget: Number(state.budget),
    difficulty: state.difficulty,
    time: state.time
  };

  console.log("RE:BUILD → backend", payload);

  try {
    const response = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(`Backend returned HTTP ${response.status} without valid JSON.`);
    }

    console.log("RE:BUILD ← backend", data);

    if (!response.ok || !data.success) {
      throw new Error(data.error || `Backend returned HTTP ${response.status}.`);
    }

    if (data.tooDoof) {
      stopLoading();
      $("progressBar").style.width = "100%";
      $("doofReason").textContent = data.reason || data.message || "This build is too complex right now.";
      showScreen("doof");
      return;
    }

    if (!data.project || typeof data.project !== "object") {
      throw new Error("The backend responded successfully, but no project was returned.");
    }

    stopLoading();
    $("progressBar").style.width = "100%";
    state.lastProject = data.project;
    renderResult(data.project);
    showScreen("result");
  } catch (error) {
    stopLoading();
    console.error("RE:BUILD generation failed:", error);

    // IMPORTANT: do NOT silently navigate back to the time screen.
    // Keep the user on the generation screen and show the real error.
    $("loadingText").textContent = "GENERATION FAILED";
    $("progressBar").style.width = "100%";
    const loadingError = $("loadingError");
    if (loadingError) {
      loadingError.textContent = error.message || "Unknown error.";
      loadingError.classList.add("visible");
    }
    const retry = $("loadingRetry");
    if (retry) retry.classList.add("visible");
    const back = $("loadingBack");
    if (back) back.classList.add("visible");
  }
}

function renderResult(project) {
  $("resultTitle").textContent = project.title || project.projectName || "YOUR INVENTION";
  $("resultDescription").textContent = project.description || "A RE:BUILD project generated from your selected materials.";
  $("resultMode").textContent = state.mode.toUpperCase();
  $("resultPurpose").textContent = project.purpose || state.purpose || "—";
  $("resultBudget").textContent = `₹${state.budget}`;
  $("resultTime").textContent = project.estimatedTime || state.time || "—";
  $("resultTime2").textContent = project.estimatedTime || state.time || "—";
  $("resultDifficulty").textContent = project.difficulty || state.difficulty || "—";
  $("resultCost").textContent = project.estimatedCost ?? "—";

  const materials = Array.isArray(project.materials) ? project.materials : state.materials;
  $("resultMaterialCount").textContent = String(materials.length).padStart(2, "0");
  $("resultMaterials").innerHTML = materials.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  const steps = Array.isArray(project.steps) ? project.steps : [];
  $("resultSteps").innerHTML = steps.map((step, index) => `<li><span class="step-num">${String(index + 1).padStart(2, "0")}</span><span>${escapeHtml(step)}</span></li>`).join("");

  const tips = Array.isArray(project.tips) ? project.tips : Array.isArray(project.safetyNotes) ? project.safetyNotes : [];
  $("resultTips").innerHTML = tips.length ? tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("") : "<li>No extra notes returned.</li>";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function resetAll() {
  state.mode = "craft";
  state.materials = [];
  state.purpose = null;
  state.budget = null;
  state.difficulty = null;
  state.time = null;
  state.lastProject = null;
  $("modeStatus").textContent = "CRAFT MODE";
  $("materialCount").textContent = "0 SELECTED";
  document.querySelectorAll(".mode-card").forEach((card) => card.classList.toggle("selected", card.dataset.mode === "craft"));
  renderMaterials();
  renderOptions();
  clearErrors();
}

// Navigation
$("startButton").addEventListener("click", () => showScreen("mode"));
$("brandHome").addEventListener("click", () => { resetAll(); showScreen("intro"); });
$("toMaterials").addEventListener("click", () => showScreen("materials"));
$("toPurpose").addEventListener("click", () => {
  if (!state.materials.length) return setError("materialError", "Select at least one material.");
  showScreen("purpose");
});
$("toBudget").addEventListener("click", () => {
  if (!state.purpose) return setError("purposeError", "Choose a purpose.");
  showScreen("budget");
});
$("toDifficulty").addEventListener("click", () => {
  if (state.budget === null) return setError("budgetError", "Choose a budget.");
  showScreen("difficulty");
});
$("toTime").addEventListener("click", () => {
  if (!state.difficulty) return setError("difficultyError", "Choose a difficulty.");
  showScreen("time");
});
$("generate").addEventListener("click", generateInvention);
$("loadingRetry").addEventListener("click", () => {
  $("loadingError").classList.remove("visible");
  $("loadingRetry").classList.remove("visible");
  $("loadingBack").classList.remove("visible");
  generateInvention();
});
$("loadingBack").addEventListener("click", () => {
  $("loadingError").classList.remove("visible");
  $("loadingRetry").classList.remove("visible");
  $("loadingBack").classList.remove("visible");
  showScreen("time");
});

$("doofBack").addEventListener("click", () => showScreen("time"));
$("editInputs").addEventListener("click", () => showScreen("time"));
$("tryAnother").addEventListener("click", () => {
  setError("apiError");
  showScreen("time");
});

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.back));
});

document.querySelectorAll(".mode-card").forEach((card) => {
  card.addEventListener("click", () => selectMode(card.dataset.mode));
});

renderMaterials();
renderOptions();
