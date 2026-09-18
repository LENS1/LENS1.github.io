const models = {
  llama2: {
    name: "LLaMA-2-7B",
    methods: [["LLM-Pruner", 7.68, 55.08], ["FLAP", 6.63, 52.63], ["SliceGPT", 6.33, 51.18], ["SVD-LLM", 7.05, 54.76], ["BoLaCo", 7.16, 53.73], ["SoLA", 6.82, 52.13], ["Duo-SVD", 5.95, 56.59], ["LENS", 5.61, 58.07]]
  },
  qwen3: {
    name: "Qwen3-8B",
    methods: [["LLM-Pruner", 9.89, 62.23], ["FLAP", 8.14, 60.02], ["SliceGPT", 7.76, 55.12], ["SVD-LLM", 9.09, 62.96], ["BoLaCo", 8.33, 60.04], ["SoLA", 8.99, 53.91], ["Duo-SVD", 7.54, 66.52], ["LENS", 7.34, 66.63]]
  },
  mistral: {
    name: "Mistral-7B",
    methods: [["LLM-Pruner", 7.63, 59.55], ["FLAP", 5.97, 53.37], ["SliceGPT", 6.07, 53.31], ["SVD-LLM", 7.56, 58.77], ["BoLaCo", 7.01, 52.73], ["SoLA", 6.92, 51.66], ["Duo-SVD", 5.81, 59.61], ["LENS", 5.51, 61.59]]
  },
  llama31: {
    name: "LLaMA-3.1-8B",
    methods: [["LLM-Pruner", 9.81, 57.75], ["FLAP", 8.23, 51.64], ["SliceGPT", 8.33, 51.74], ["SVD-LLM", 10.03, 54.20], ["BoLaCo", 10.31, 53.58], ["SoLA", 9.48, 52.60], ["Duo-SVD", 8.68, 60.30], ["LENS", 7.95, 61.86]]
  }
};

const ablations = {
  llama2: [["Duo-SVD", 5.95, 56.59], ["V1\nAmplify", 5.76, 57.87], ["V2\nSuppress", 5.83, 56.67], ["V3\nJoint", 5.85, 57.89], ["V4\nS → A", 5.67, 57.68], ["LENS\nA → S", 5.61, 58.07]],
  qwen3: [["Duo-SVD", 7.54, 66.52], ["V1\nAmplify", 7.40, 66.34], ["V2\nSuppress", 7.52, 66.45], ["V3\nJoint", 7.36, 65.94], ["V4\nS → A", 7.36, 66.53], ["LENS\nA → S", 7.34, 66.63]],
  llama31: [["Duo-SVD", 8.68, 60.30], ["V1\nAmplify", 8.00, 61.63], ["V2\nSuppress", 8.58, 60.30], ["V3\nJoint", 8.00, 61.65], ["V4\nS → A", 8.03, 61.73], ["LENS\nA → S", 7.95, 61.86]]
};

const figureInfo = {
  robustness: {
    image: "assets/images/robustness-1.png",
    alt: "LENS robustness across compression ratios, calibration datasets, low-rank compressors and quantization.",
    caption: "Compression-ratio robustness, calibration-data robustness, compatibility with other low-rank compressors, and 4-bit quantization."
  },
  compatibility: {
    image: "assets/images/compatibility-1.png",
    alt: "LENS applied to other low-rank compressors and combined with 4-bit quantization.",
    caption: "LENS improves BoLaCo, SoLA, and SVD-LLM across model families and remains compatible with subsequent GPTQ or RTN quantization."
  },
  analysis: {
    image: "assets/images/analysis-1.png",
    alt: "LENS sensitivity to validated direction fraction and scale, with calibration anatomy heatmaps.",
    caption: "LENS is stable around its selected direction fraction and scale; Amplify and later Suppress yield distinct calibration patterns."
  }
};

const partCopy = {
  u: "<strong>LENS updates only U.</strong> The calibrated gain is folded offline into the output factor; rank, V, preserved columns, and inference cost stay fixed.",
  v: "<strong>V stays fixed.</strong> LENS does not alter the input-side low-rank coordinates selected by compression.",
  columns: "<strong>Preserved columns stay fixed.</strong> The column-preserving branch is outside the gain fold and remains untouched."
};

function getMethod(model, label) {
  return model.methods.find(([name]) => name === label);
}

function renderBarChart(id, values, index, lowerIsBetter) {
  const target = document.getElementById(id);
  const ordered = [...values].sort((a, b) => lowerIsBetter ? a[index] - b[index] : b[index] - a[index]);
  const metricValues = ordered.map((row) => row[index]);
  const min = Math.min(...metricValues);
  const max = Math.max(...metricValues);
  target.innerHTML = ordered.map(([name, ppl, avg]) => {
    const value = index === 1 ? ppl : avg;
    const normalized = lowerIsBetter ? (max - value) / (max - min || 1) : (value - min) / (max - min || 1);
    const width = 24 + normalized * 76;
    return `<div class="bar-row ${name === "LENS" ? "ours" : ""}"><span>${name}</span><span class="bar-track"><span class="bar-fill" style="width:${width}%"></span></span><b>${value.toFixed(2)}</b></div>`;
  }).join("");
}

function renderResults(key) {
  const model = models[key];
  const lens = getMethod(model, "LENS");
  const duo = getMethod(model, "Duo-SVD");
  const pplDelta = duo[1] - lens[1];
  const avgDelta = lens[2] - duo[2];
  document.getElementById("lens-ppl").textContent = lens[1].toFixed(2);
  document.getElementById("lens-avg").textContent = lens[2].toFixed(2);
  document.getElementById("ppl-delta").textContent = pplDelta.toFixed(2);
  document.getElementById("avg-delta").textContent = `+${avgDelta.toFixed(2)}`;
  renderBarChart("ppl-chart", model.methods, 1, true);
  renderBarChart("avg-chart", model.methods, 2, false);
  document.getElementById("comparison-table").innerHTML = model.methods.map(([name, ppl, avg]) => `<tr class="${name === "LENS" ? "ours" : ""}"><td>${name}</td><td>${ppl.toFixed(2)}</td><td>${avg.toFixed(2)}</td></tr>`).join("");
}

function renderAblation(key) {
  const values = ablations[key];
  const best = Math.max(...values.map(([, , avg]) => avg));
  const worst = Math.min(...values.map(([, , avg]) => avg));
  document.getElementById("ablation-chart").innerHTML = values.map(([name, ppl, avg]) => {
    const height = 20 + ((avg - worst) / (best - worst || 1)) * 74;
    return `<div class="ablation-column"><div class="ablation-bar-area"><span class="ablation-value">${ppl.toFixed(2)} PPL</span><div class="ablation-bar" style="height:${height}%"></div></div><span class="ablation-name">${name.replace("\n", "<br>")}<br><b>${avg.toFixed(2)}</b></span></div>`;
  }).join("");
}

document.querySelectorAll(".model-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".model-tabs button").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    renderResults(button.dataset.model);
  });
});

document.querySelectorAll(".module-switch button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".module-switch button").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    const part = button.dataset.part;
    document.querySelector(".factorization-stage").dataset.activePart = part;
    document.getElementById("part-description").innerHTML = partCopy[part];
  });
});

document.getElementById("ablation-model").addEventListener("change", (event) => renderAblation(event.target.value));

document.querySelectorAll(".evidence-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".evidence-tabs button").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    const info = figureInfo[button.dataset.figure];
    const image = document.getElementById("evidence-image");
    image.style.opacity = "0";
    window.setTimeout(() => {
      image.src = info.image;
      image.alt = info.alt;
      document.getElementById("evidence-caption").textContent = info.caption;
      image.style.opacity = "1";
    }, 130);
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
}, { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById("progress-bar").style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
}
window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

document.getElementById("copy-bibtex").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(document.getElementById("bibtex").textContent);
    button.textContent = "Copied ✓";
  } catch {
    button.textContent = "Select & copy";
  }
  window.setTimeout(() => { button.textContent = "Copy BibTeX"; }, 1600);
});

document.getElementById("back-to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

function drawHero() {
  const canvas = document.getElementById("hero-canvas");
  const context = canvas.getContext("2d");
  const colors = ["#d3654d", "#3d8759", "#6274b8", "#ce7328"];
  let width = 0;
  let height = 0;
  let pointer = { x: .52, y: .38 };
  let phase = 0;
  const nodes = Array.from({ length: 68 }, (_, index) => ({
    x: .46 + Math.cos(index * 2.39) * (.14 + (index % 6) * .027),
    y: .5 + Math.sin(index * 1.71) * (.12 + (index % 4) * .035),
    size: 1.3 + (index % 4) * .4,
    color: colors[index % colors.length],
    drift: .17 + (index % 5) * .09
  }));
  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function frame() {
    phase += .004;
    context.clearRect(0, 0, width, height);
    const originX = width * (.55 + (pointer.x - .5) * .03);
    const originY = height * (.50 + (pointer.y - .5) * .03);
    context.save();
    context.globalAlpha = .42;
    for (let index = 0; index < 13; index += 1) {
      const x = width * .69 + index * 17;
      const y = height * .12 + index * 9;
      context.strokeStyle = "#6274b8";
      context.strokeRect(x, y, 138, 86);
    }
    context.restore();
    nodes.forEach((node, index) => {
      const x = originX + (node.x - .55) * width + Math.sin(phase * node.drift * 8 + index) * 7;
      const y = originY + (node.y - .5) * height + Math.cos(phase * node.drift * 7 + index) * 7;
      context.beginPath();
      context.moveTo(originX, originY);
      context.lineTo(x, y);
      context.strokeStyle = `${node.color}35`;
      context.lineWidth = index % 8 === 0 ? 1.5 : .65;
      context.stroke();
      context.beginPath();
      context.arc(x, y, node.size, 0, Math.PI * 2);
      context.fillStyle = node.color;
      context.globalAlpha = .46 + (index % 3) * .1;
      context.fill();
    });
    context.globalAlpha = 1;
    context.beginPath();
    context.arc(originX, originY, 7, 0, Math.PI * 2);
    context.fillStyle = "#152d46";
    context.fill();
    window.requestAnimationFrame(frame);
  }
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => { pointer = { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight }; }, { passive: true });
  resize();
  frame();
}

renderResults("llama2");
renderAblation("llama2");
drawHero();
