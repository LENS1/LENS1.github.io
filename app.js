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

function renderAblation(key) {
  const values = ablations[key];
  const best = Math.max(...values.map(([, , avg]) => avg));
  const worst = Math.min(...values.map(([, , avg]) => avg));
  document.getElementById("ablation-chart").innerHTML = values.map(([name, ppl, avg]) => {
    const height = 20 + ((avg - worst) / (best - worst || 1)) * 74;
    return `<div class="ablation-column"><div class="ablation-bar-area"><span class="ablation-value">${ppl.toFixed(2)} PPL</span><div class="ablation-bar" style="height:${height}%"></div></div><span class="ablation-name">${name.replace("\n", "<br>")}<br><b>${avg.toFixed(2)}</b></span></div>`;
  }).join("");
}

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
  const nodes = Array.from({ length: 30 }, (_, index) => ({
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

renderAblation("llama2");
drawHero();
