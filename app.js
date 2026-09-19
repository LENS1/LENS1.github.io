

const figureInfo = {
  robustness: {
    image: "assets/images/robustness-1.png",
    alt:
      "LENS robustness across compression ratios, calibration datasets, low-rank compressors and quantization.",
    caption:
      "Compression-ratio robustness, calibration-data robustness, compatibility with other low-rank compressors, and 4-bit quantization."
  },

  compatibility: {
    image: "assets/images/compatibility-1.png",
    alt:
      "LENS applied to other low-rank compressors and combined with 4-bit quantization.",
    caption:
      "LENS improves BoLaCo, SoLA, and SVD-LLM across model families and remains compatible with subsequent GPTQ or RTN quantization."
  },

  analysis: {
    image: "assets/images/analysis-1.png",
    alt:
      "LENS sensitivity to validated direction fraction and scale, with calibration anatomy heatmaps.",
    caption:
      "LENS is stable around its selected direction fraction and scale; Amplify and later Suppress yield distinct calibration patterns."
  }
};


const partCopy = {
  u:
    "<strong>LENS updates only U.</strong> The calibrated gain is folded offline into the output factor; rank, V, preserved columns, and inference cost stay fixed.",

  v:
    "<strong>V stays fixed.</strong> LENS does not alter the input-side low-rank coordinates selected by compression.",

  columns:
    "<strong>Preserved columns stay fixed.</strong> The column-preserving branch is outside the gain fold and remains untouched."
};


/* ============================================================
   Ablation chart
   ============================================================ */

/* ============================================================
   Ablation Study
   ============================================================ */

const ablationResults = {

  llama2: {

    label: "LLaMA-2-7B",

    variants: [
      {
        key: "duo",
        name: "Duo-SVD",
        ppl: 5.95,
        avg: 56.59
      },

      {
        key: "amplify",
        name: "Amplify Only",
        ppl: 5.76,
        avg: 57.87
      },

      {
        key: "suppress",
        name: "Suppress Only",
        ppl: 5.83,
        avg: 56.67
      },

      {
        key: "joint",
        name: "Joint Amplify + Suppress",
        ppl: 5.85,
        avg: 57.89
      },

      {
        key: "reverse",
        name: "Suppress → Amplify",
        ppl: 5.67,
        avg: 57.68
      },

      {
        key: "lens",
        name: "LENS",
        ppl: 5.61,
        avg: 58.07
      }
    ]

  },


  qwen3: {

    label: "Qwen3-8B",

    variants: [
      {
        key: "duo",
        name: "Duo-SVD",
        ppl: 7.54,
        avg: 66.52
      },

      {
        key: "amplify",
        name: "Amplify Only",
        ppl: 7.40,
        avg: 66.34
      },

      {
        key: "suppress",
        name: "Suppress Only",
        ppl: 7.52,
        avg: 66.45
      },

      {
        key: "joint",
        name: "Joint Amplify + Suppress",
        ppl: 7.36,
        avg: 65.94
      },

      {
        key: "reverse",
        name: "Suppress → Amplify",
        ppl: 7.36,
        avg: 66.53
      },

      {
        key: "lens",
        name: "LENS",
        ppl: 7.34,
        avg: 66.63
      }
    ]

  },


  mistral: {

    label: "Mistral-7B",

    variants: [
      {
        key: "duo",
        name: "Duo-SVD",
        ppl: 5.81,
        avg: 59.61
      },

      {
        key: "amplify",
        name: "Amplify Only",
        ppl: 5.60,
        avg: 61.42
      },

      {
        key: "suppress",
        name: "Suppress Only",
        ppl: 5.65,
        avg: 59.95
      },

      {
        key: "joint",
        name: "Joint Amplify + Suppress",
        ppl: 5.74,
        avg: 61.70
      },

      {
        key: "reverse",
        name: "Suppress → Amplify",
        ppl: 5.49,
        avg: 61.31
      },

      {
        key: "lens",
        name: "LENS",
        ppl: 5.51,
        avg: 61.59
      }
    ]

  },


  llama31: {

    label: "LLaMA-3.1-8B",

    variants: [
      {
        key: "duo",
        name: "Duo-SVD",
        ppl: 8.68,
        avg: 60.30
      },

      {
        key: "amplify",
        name: "Amplify Only",
        ppl: 8.00,
        avg: 61.63
      },

      {
        key: "suppress",
        name: "Suppress Only",
        ppl: 8.58,
        avg: 60.30
      },

      {
        key: "joint",
        name: "Joint Amplify + Suppress",
        ppl: 8.00,
        avg: 61.65
      },

      {
        key: "reverse",
        name: "Suppress → Amplify",
        ppl: 8.03,
        avg: 61.73
      },

      {
        key: "lens",
        name: "LENS",
        ppl: 7.95,
        avg: 61.86
      }
    ]

  }

};



/* ============================================================
   Calibration recipe HTML
   ============================================================ */

function getAblationRecipe(key) {

  const recipes = {

    duo: `
      <div class="calibration-recipe">

        <span class="calibration-step none">
          No calibration
        </span>

      </div>
    `,


    amplify: `
      <div class="calibration-recipe">

        <span class="calibration-step amplify">
          Amplify
        </span>

      </div>
    `,


    suppress: `
      <div class="calibration-recipe">

        <span class="calibration-step suppress">
          Suppress
        </span>

      </div>
    `,


    joint: `
      <div class="calibration-recipe">

        <span class="calibration-step joint">
          Joint Amplify + Suppress
        </span>

        <span class="recipe-note">
          Profiled jointly at the original compressed state
        </span>

      </div>
    `,


    reverse: `
      <div class="calibration-recipe">

        <span class="calibration-step suppress">
          Suppress
        </span>

        <span class="recipe-arrow">
          →
        </span>

        <span class="calibration-step reprofile">
          Re-profile
        </span>

        <span class="recipe-arrow">
          →
        </span>

        <span class="calibration-step amplify">
          Amplify
        </span>

      </div>
    `,


    lens: `
      <div class="calibration-recipe">

        <span class="calibration-step amplify">
          Amplify
        </span>

        <span class="recipe-arrow">
          →
        </span>

        <span class="calibration-step reprofile">
          Re-profile
        </span>

        <span class="recipe-arrow">
          →
        </span>

        <span class="calibration-step suppress">
          Suppress
        </span>

      </div>
    `

  };


  return recipes[key] || "";

}



/* ============================================================
   Find best and second-best distinct values

   For PPL:
   lower is better.

   For Avg:
   higher is better.

   Ties share the same rank.
   ============================================================ */

function getTopTwoDistinct(
  variants,
  metric,
  direction
) {

  const values =
    variants.map(
      (variant) => variant[metric]
    );


  const unique =
    Array.from(
      new Set(values)
    );


  unique.sort(
    (a, b) =>
      direction === "min"
        ? a - b
        : b - a
  );


  return {
    best:
      unique[0],

    second:
      unique.length > 1
        ? unique[1]
        : null
  };

}



/* ============================================================
   Metric highlight class
   ============================================================ */

function getAblationMetricClass(
  value,
  ranking
) {

  if (
    Math.abs(
      value - ranking.best
    ) < 1e-10
  ) {
    return "ablation-result-best";
  }


  if (
    ranking.second !== null &&
    Math.abs(
      value - ranking.second
    ) < 1e-10
  ) {
    return "ablation-result-second";
  }


  return "";

}



/* ============================================================
   Render Ablation Study
   ============================================================ */

function renderAblation(key) {

  const data =
    ablationResults[key];


  const body =
    document.getElementById(
      "ablation-results-body"
    );


  const title =
    document.getElementById(
      "ablation-backbone-title"
    );


  if (
    !data ||
    !body
  ) {
    return;
  }


  if (title) {
    title.textContent =
      data.label;
  }


  const pplRanks =
    getTopTwoDistinct(
      data.variants,
      "ppl",
      "min"
    );


  const avgRanks =
    getTopTwoDistinct(
      data.variants,
      "avg",
      "max"
    );


  body.innerHTML =
    data.variants
      .map(
        (variant) => {

          const pplClass =
            getAblationMetricClass(
              variant.ppl,
              pplRanks
            );


          const avgClass =
            getAblationMetricClass(
              variant.avg,
              avgRanks
            );


          const lensRowClass =
            variant.key === "lens"
              ? "ablation-lens-row"
              : "";


          const oursBadge =
            variant.key === "lens"
              ? `
                <span class="ablation-variant-badge">
                  OURS
                </span>
              `
              : "";


          return `
            <tr class="${lensRowClass}">

              <th scope="row">

                <span class="ablation-variant-title">
                  ${variant.name}
                </span>

                ${oursBadge}

              </th>


              <td>
                ${getAblationRecipe(
                  variant.key
                )}
              </td>


              <td class="${pplClass}">
                ${variant.ppl.toFixed(2)}
              </td>


              <td class="${avgClass}">
                ${variant.avg.toFixed(2)}
              </td>

            </tr>
          `;

        }
      )
      .join("");


  body.classList.remove(
    "ablation-refresh"
  );


  void body.offsetWidth;


  body.classList.add(
    "ablation-refresh"
  );

}



/* ============================================================
   Ablation backbone tabs
   ============================================================ */

document
  .querySelectorAll(
    ".ablation-backbone-tab"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".ablation-backbone-tab"
            )
            .forEach(
              (item) => {

                const active =
                  item === button;


                item.classList.toggle(
                  "active",
                  active
                );


                item.setAttribute(
                  "aria-selected",
                  String(active)
                );

              }
            );


          renderAblation(
            button.dataset
              .ablationBackbone
          );

        }
      );

    }
  );
/* ============================================================
   Main Results — Table 1 data
   ============================================================ */

const mainResultMethods = [
  {
    key: "dense",
    label: "Dense",
    reference: true
  },

  {
    key: "llmPruner",
    label: "LLM-Pruner"
  },

  {
    key: "flap",
    label: "FLAP"
  },

  {
    key: "sliceGPT",
    label: "SliceGPT"
  },

  {
    key: "svdLLM",
    label: "SVD-LLM"
  },

  {
    key: "bolaco",
    label: "BoLaCo"
  },

  {
    key: "sola",
    label: "SoLA"
  },

  {
    key: "duoSVD",
    label: "Duo-SVD"
  },

  {
    key: "lens",
    label: "LENS"
  }
];


const mainResultMetrics = [
  {
    key: "ppl",
    label: "PPL",
    full: "WikiText-2 Perplexity",
    direction: "min",
    summary: true
  },

  {
    key: "avg",
    label: "Avg.",
    full: "Average downstream accuracy",
    direction: "max",
    summary: true,
    summaryEnd: true
  },

  {
    key: "mmlu",
    label: "MMLU",
    full: "MMLU 5-shot accuracy",
    direction: "max"
  },

  {
    key: "piqa",
    label: "PIQA",
    full: "PIQA accuracy",
    direction: "max"
  },

  {
    key: "winog",
    label: "WinoG.",
    full: "WinoGrande accuracy",
    direction: "max"
  },

  {
    key: "hellas",
    label: "HellaS.",
    full: "HellaSwag accuracy",
    direction: "max"
  },

  {
    key: "arce",
    label: "ARC-e",
    full: "ARC-Easy accuracy",
    direction: "max"
  },

  {
    key: "arcc",
    label: "ARC-c",
    full: "ARC-Challenge accuracy",
    direction: "max"
  },

  {
    key: "obqa",
    label: "OBQA",
    full: "OpenBookQA accuracy",
    direction: "max"
  }
];


const mainResults = {

  llama2: {

    label: "LLaMA-2-7B",

    values: {

      dense: [
        5.12,
        62.17,
        45.93,
        79.11,
        68.90,
        76.02,
        74.62,
        46.42,
        44.20
      ],

      llmPruner: [
        7.68,
        55.08,
        30.49,
        76.55,
        62.27,
        69.34,
        65.57,
        39.76,
        41.60
      ],

      flap: [
        6.63,
        52.63,
        31.60,
        74.65,
        65.35,
        65.04,
        59.39,
        34.22,
        38.20
      ],

      sliceGPT: [
        6.33,
        51.18,
        30.95,
        68.28,
        64.40,
        58.59,
        62.33,
        36.09,
        37.60
      ],

      svdLLM: [
        7.05,
        54.76,
        29.04,
        75.19,
        64.48,
        68.56,
        65.36,
        40.70,
        40.00
      ],

      bolaco: [
        7.16,
        53.73,
        32.04,
        73.29,
        66.06,
        61.27,
        67.80,
        37.46,
        38.20
      ],

      sola: [
        6.82,
        52.13,
        31.40,
        72.63,
        65.19,
        59.86,
        63.30,
        35.49,
        37.00
      ],

      duoSVD: [
        5.95,
        56.59,
        32.09,
        76.55,
        67.56,
        69.97,
        69.32,
        39.08,
        41.60
      ],

      lens: [
        5.61,
        58.07,
        34.73,
        76.71,
        67.88,
        72.68,
        71.17,
        40.53,
        42.80
      ]

    }

  },



  qwen3: {

    label: "Qwen3-8B",

    values: {

      dense: [
        6.51,
        69.49,
        76.56,
        79.38,
        72.69,
        78.64,
        80.13,
        57.00,
        42.00
      ],

      llmPruner: [
        9.89,
        62.23,
        57.42,
        76.88,
        66.77,
        71.59,
        75.80,
        47.78,
        39.40
      ],

      flap: [
        8.14,
        60.02,
        62.40,
        72.36,
        68.67,
        63.14,
        68.31,
        44.03,
        41.20
      ],

      sliceGPT: [
        7.76,
        55.12,
        42.32,
        72.20,
        69.53,
        64.66,
        59.22,
        40.10,
        37.80
      ],

      svdLLM: [
        9.09,
        62.96,
        59.22,
        74.76,
        70.09,
        69.76,
        73.48,
        51.19,
        42.20
      ],

      bolaco: [
        8.33,
        60.04,
        53.48,
        75.30,
        66.61,
        64.49,
        75.21,
        47.01,
        38.20
      ],

      sola: [
        8.99,
        53.91,
        49.68,
        69.75,
        66.61,
        53.37,
        63.76,
        36.60,
        37.60
      ],

      duoSVD: [
        7.54,
        66.52,
        63.87,
        78.62,
        70.80,
        71.54,
        81.78,
        56.23,
        42.80
      ],

      lens: [
        7.34,
        66.63,
        64.26,
        78.51,
        70.56,
        71.77,
        81.94,
        56.57,
        42.80
      ]

    }

  },



  mistral: {

    label: "Mistral-7B",

    values: {

      dense: [
        4.91,
        68.20,
        62.64,
        82.15,
        73.95,
        81.06,
        79.59,
        54.01,
        44.00
      ],

      llmPruner: [
        7.63,
        59.55,
        39.87,
        79.22,
        66.14,
        76.45,
        69.57,
        43.60,
        42.00
      ],

      flap: [
        5.97,
        53.37,
        40.38,
        69.42,
        65.67,
        57.52,
        64.39,
        36.60,
        39.60
      ],

      sliceGPT: [
        6.07,
        53.31,
        37.71,
        68.66,
        68.51,
        59.63,
        62.58,
        38.05,
        38.00
      ],

      svdLLM: [
        7.56,
        58.77,
        43.60,
        75.57,
        64.96,
        70.35,
        74.12,
        44.03,
        38.80
      ],

      bolaco: [
        7.01,
        52.73,
        29.28,
        72.96,
        67.48,
        59.02,
        68.22,
        36.35,
        35.80
      ],

      sola: [
        6.92,
        51.66,
        33.25,
        70.24,
        68.19,
        55.24,
        62.79,
        35.49,
        36.40
      ],

      duoSVD: [
        5.81,
        59.61,
        40.16,
        78.07,
        68.98,
        72.10,
        72.47,
        43.86,
        41.60
      ],

      lens: [
        5.51,
        61.59,
        42.99,
        78.45,
        70.40,
        76.27,
        74.20,
        47.01,
        41.80
      ]

    }

  },



  llama31: {

    label: "LLaMA-3.1-8B",

    values: {

      dense: [
        5.84,
        68.44,
        65.35,
        81.28,
        73.95,
        78.91,
        81.14,
        53.41,
        45.00
      ],

      llmPruner: [
        9.81,
        57.75,
        35.72,
        78.78,
        64.01,
        71.22,
        70.37,
        45.14,
        39.00
      ],

      flap: [
        8.23,
        51.64,
        37.17,
        72.63,
        64.56,
        58.68,
        57.07,
        32.94,
        38.40
      ],

      sliceGPT: [
        8.33,
        51.74,
        37.23,
        66.43,
        67.88,
        56.69,
        59.72,
        35.41,
        38.80
      ],

      svdLLM: [
        10.03,
        54.20,
        39.00,
        72.47,
        63.06,
        65.38,
        64.35,
        39.76,
        35.40
      ],

      bolaco: [
        10.31,
        53.58,
        32.44,
        72.14,
        66.46,
        59.50,
        66.50,
        38.99,
        39.00
      ],

      sola: [
        9.48,
        52.60,
        40.81,
        72.14,
        67.72,
        58.39,
        55.56,
        34.56,
        39.00
      ],

      duoSVD: [
        8.68,
        60.30,
        52.49,
        75.41,
        69.61,
        68.13,
        71.04,
        44.20,
        41.20
      ],

      lens: [
        7.95,
        61.86,
        54.78,
        76.33,
        69.85,
        70.02,
        73.02,
        46.42,
        42.60
      ]

    }

  }

};



/* ============================================================
   Rank one metric row

   Dense is excluded.

   We use "dense ranking":
   if two methods tie for best, both receive rank 1,
   and the next distinct value receives rank 2.
   ============================================================ */

function computeMetricRanks(
  backboneData,
  metricIndex,
  direction
) {

  const candidates =
    mainResultMethods
      .filter(
        (method) => !method.reference
      )
      .map(
        (method) => ({
          key: method.key,
          value:
            backboneData.values[
              method.key
            ][metricIndex]
        })
      );


  const uniqueValues =
    Array.from(
      new Set(
        candidates.map(
          (item) => item.value
        )
      )
    );


  uniqueValues.sort(
    (a, b) =>
      direction === "min"
        ? a - b
        : b - a
  );


  const ranks = {};


  candidates.forEach(
    (item) => {

      ranks[item.key] =
        uniqueValues.findIndex(
          (value) =>
            Math.abs(
              value -
              item.value
            ) < 1e-10
        ) + 1;

    }
  );


  return ranks;
}



/* ============================================================
   Render one backbone
   ============================================================ */

function clearMainResultsHighlights() {

  const table =
    document.querySelector(
      ".main-results-table"
    );


  if (table) {
    table.classList.remove(
      "results-best-active"
    );
  }

}



function replayMainResultsHighlights() {

  const table =
    document.querySelector(
      ".main-results-table"
    );


  if (!table) return;


  table.classList.remove(
    "results-best-active"
  );


  void table.offsetWidth;


  table.classList.add(
    "results-best-active"
  );

}



function renderMainResults(
  backboneKey,
  shouldHighlight = false
) {

  const backbone =
    mainResults[backboneKey];

  const body =
    document.getElementById(
      "main-results-body"
    );

  const title =
    document.getElementById(
      "results-backbone-title"
    );


  if (
    !backbone ||
    !body
  ) {
    return;
  }


  if (title) {
    title.textContent =
      backbone.label;
  }


  const metricRanks =
    mainResultMetrics.map(
      (metric, metricIndex) =>
        computeMetricRanks(
          backbone,
          metricIndex,
          metric.direction
        )
    );


  clearMainResultsHighlights();


  body.innerHTML =
    mainResultMethods
      .map(
        (method) => {

          const rowClass =
            method.key === "lens"
              ? "results-lens-row"
              : "";


          const methodLabel =
            method.key === "lens"
              ? `
                <span>LENS</span>
                <small>OURS</small>
              `
              : method.label;


          const cells =
            mainResultMetrics
              .map(
                (metric, metricIndex) => {

                  const value =
                    backbone.values[
                      method.key
                    ][metricIndex];


                  if (method.reference) {
                    return `
                      <td
                        class="result-reference"
                        aria-label="${method.label}: ${value.toFixed(2)}; uncompressed reference"
                      >
                        ${value.toFixed(2)}
                      </td>
                    `;
                  }


                  const rank =
                    metricRanks[
                      metricIndex
                    ][method.key];


                  const isBest =
                    rank === 1;


                  const rankDescription =
                    isBest
                      ? "best compressed result"
                      : "compressed result";


                  return `
                    <td
                      class="${isBest ? "result-best" : ""}"
                      data-best="${isBest}"
                      aria-label="${method.label}: ${value.toFixed(2)}; ${rankDescription}"
                      title="${method.label} · ${rankDescription}"
                    >
                      ${value.toFixed(2)}
                    </td>
                  `;

                }
              )
              .join("");


          return `
            <tr class="${rowClass}">

              <th scope="row">
                ${methodLabel}
              </th>

              ${cells}

            </tr>
          `;

        }
      )
      .join("");


  body.classList.remove(
    "results-refresh"
  );


  void body.offsetWidth;


  body.classList.add(
    "results-refresh"
  );


  if (shouldHighlight) {
    window.requestAnimationFrame(
      replayMainResultsHighlights
    );
  }

}



/* ============================================================
   Backbone tab interaction
   ============================================================ */

document
  .querySelectorAll(
    ".results-backbone-tab"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".results-backbone-tab"
            )
            .forEach(
              (item) => {

                const active =
                  item === button;


                item.classList.toggle(
                  "active",
                  active
                );


                item.setAttribute(
                  "aria-selected",
                  String(active)
                );

              }
            );


          renderMainResults(
            button.dataset.backbone,
            true
          );

        }
      );

    }
  );



const mainResultsExplorer =
  document.querySelector(
    ".main-results-explorer"
  );


if (mainResultsExplorer) {

  const mainResultsHighlightObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            replayMainResultsHighlights();
          }

          else {
            clearMainResultsHighlights();
          }
        });

      },
      {
        threshold: 0.18
      }
    );


  mainResultsHighlightObserver.observe(
    mainResultsExplorer
  );

}

/* ============================================================
   Method interaction
   U / V / preserved columns
   ============================================================ */

document
  .querySelectorAll(".module-switch button")
  .forEach((button) => {
    button.addEventListener("click", () => {

      document
        .querySelectorAll(".module-switch button")
        .forEach((item) => {
          const active = item === button;

          item.classList.toggle("active", active);
          item.setAttribute(
            "aria-selected",
            String(active)
          );
        });

      const part = button.dataset.part;

      const stage =
        document.querySelector(".factorization-stage");

      if (stage) {
        stage.dataset.activePart = part;
      }

      const description =
        document.getElementById("part-description");

      if (description && partCopy[part]) {
        description.innerHTML = partCopy[part];
      }
    });
  });


/* ============================================================
   Ablation backbone selector
   ============================================================ */




/* ============================================================
   Evidence figure tabs
   ============================================================ */

document
  .querySelectorAll(".evidence-tabs button")
  .forEach((button) => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".evidence-tabs button")
        .forEach((item) => {
          const active = item === button;

          item.classList.toggle("active", active);
          item.setAttribute(
            "aria-selected",
            String(active)
          );
        });

      const figureKey = button.dataset.figure;
      const info = figureInfo[figureKey];

      if (!info) return;

      const image =
        document.getElementById("evidence-image");

      const caption =
        document.getElementById(
          "evidence-caption"
        );

      if (!image) return;

      image.style.opacity = "0";

      window.setTimeout(() => {
        image.src = info.image;
        image.alt = info.alt;

        if (caption) {
          caption.textContent = info.caption;
        }

        image.style.opacity = "1";
      }, 130);

    });

  });


/* ============================================================
   Experiment explorers
   05 / Robustness, 06 / Analysis
   ============================================================ */

const generalizationExperiments = {
  compression: {
    title: "Robustness to Compression Ratio",
    question:
      "Does LENS remain effective as compression becomes increasingly aggressive?",
    takeaway:
      "The advantage persists from 10% to 40% compression.",
    image:
      "assets/new_images/compression_ratio_web.png",
    alt:
      "Compression-ratio comparison of LENS and low-rank compression baselines across four model families."
  },

  calibration: {
    title: "Calibration Dataset Robustness",
    question:
      "How sensitive is LENS to the data used for calibration?",
    takeaway:
      "Calibration performance follows the evaluation distribution, while downstream accuracy remains comparatively stable.",
    image:
      "assets/new_images/calibration_data_web.png",
    alt:
      "Calibration-dataset robustness of LENS across four model families."
  },

  quantization: {
    title: "Compatibility with Low-Bit Quantization",
    question:
      "Can LENS-compressed models be further quantized?",
    takeaway:
      "LENS remains compatible with subsequent GPTQ and RTN 4-bit quantization.",
    image:
      "assets/new_images/quantization_web.png",
    alt:
      "Compatibility of LENS-compressed models with GPTQ and RTN 4-bit quantization."
  }
};


const compressorExperiments = {
  bolaco: {
    title: "Other Low-Rank Compressors",
    question:
      "Does LENS transfer beyond the default Duo-SVD initialization?",
    takeaway:
      "LENS consistently improves BoLaCo across all four backbones.",
    image:
      "assets/new_images/other_compressors_bolaco_web.png",
    alt:
      "BoLaCo results before and after applying LENS across four language model backbones."
  },

  svdllm: {
    title: "Other Low-Rank Compressors",
    question:
      "Does LENS transfer beyond the default Duo-SVD initialization?",
    takeaway:
      "LENS consistently improves SVD-LLM across all four backbones.",
    image:
      "assets/new_images/other_compressors_svdllm_web.png",
    alt:
      "SVD-LLM results before and after applying LENS across four language model backbones."
  },

  sola: {
    title: "Other Low-Rank Compressors",
    question:
      "Does LENS transfer beyond the default Duo-SVD initialization?",
    takeaway:
      "LENS consistently improves SoLA across all four backbones.",
    image:
      "assets/new_images/other_compressors_sola_web.png",
    alt:
      "SoLA results before and after applying LENS across four language model backbones."
  }
};


const sensitivityExperiments = {
  fraction: {
    title: "Direction Fraction",
    question:
      "How sensitive is LENS to the fraction of validated directions retained?",
    takeaway:
      "Performance varies only mildly across direction fractions.",
    image:
      "assets/new_images/direction_fraction_web.png",
    alt:
      "Sensitivity of LENS to the retained direction fraction across four language models."
  },

  eta: {
    title: "Scale Sensitivity",
    question:
      "How sensitive is calibration to the selected global scale?",
    takeaway:
      "Performance remains stable around the selected η, while overly aggressive scaling can degrade some backbones.",
    image:
      "assets/new_images/eta_sensitivity_web.png",
    alt:
      "Sensitivity of LENS to the global calibration scale eta across four language models."
  }
};


const anatomyExperiments = {
  llama2: {
    image:
      "assets/new_images/calibration_anatomy_lllama2_web.png",
    alt:
      "LLaMA-2-7B calibration anatomy showing Amplify and Suppress corrections across layers and module families."
  },

  mistral: {
    image:
      "assets/new_images/calibration_anatomy_mistral_web.png",
    alt:
      "Mistral-7B calibration anatomy showing Amplify and Suppress corrections across layers and module families."
  },

  llama31: {
    image:
      "assets/new_images/calibration_anatomy_llama31.png",
    alt:
      "LLaMA-3.1-8B calibration anatomy showing Amplify and Suppress corrections across layers and module families."
  },

  qwen3: {
    image:
      "assets/new_images/calibration_anatomy_qwen3.png",
    alt:
      "Qwen3-8B calibration anatomy showing Amplify and Suppress corrections across layers and module families."
  }
};


function setExplorerTabState(buttons, activeButton) {
  buttons.forEach((button) => {
    const active = button === activeButton;

    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });
}


function swapExperimentFigure(image, info) {
  if (!image || !info) return;

  image.classList.add("is-switching");

  const preload = new Image();

  preload.addEventListener(
    "load",
    () => {
      image.src = info.image;
      image.alt = info.alt;

      window.requestAnimationFrame(() => {
        image.classList.remove("is-switching");
      });
    },
    { once: true }
  );

  preload.addEventListener(
    "error",
    () => {
      image.classList.remove("is-switching");
    },
    { once: true }
  );

  preload.src = info.image;
}


function enableExplorerArrowKeys(tablist) {
  const buttons = Array.from(
    tablist.querySelectorAll('button[role="tab"]')
  );

  tablist.addEventListener("keydown", (event) => {
    if (
      !["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
    ) {
      return;
    }

    event.preventDefault();

    const currentIndex = buttons.indexOf(document.activeElement);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % buttons.length;
    }

    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    }

    if (event.key === "Home") {
      nextIndex = 0;
    }

    if (event.key === "End") {
      nextIndex = buttons.length - 1;
    }

    buttons[nextIndex].focus();
    buttons[nextIndex].click();
  });
}


document
  .querySelectorAll('.experiment-tabs[role="tablist"]')
  .forEach(enableExplorerArrowKeys);


const generalizationExplorer = document.querySelector(
  "[data-generalization-explorer]"
);


if (generalizationExplorer) {
  const experimentButtons = Array.from(
    generalizationExplorer.querySelectorAll(
      "[data-generalization-experiment]"
    )
  );

  const compressorButtons = Array.from(
    generalizationExplorer.querySelectorAll("[data-compressor]")
  );

  const compressorControls = generalizationExplorer.querySelector(
    "[data-compressor-controls]"
  );

  const title = generalizationExplorer.querySelector(
    "[data-generalization-title]"
  );

  const question = generalizationExplorer.querySelector(
    "[data-generalization-question]"
  );

  const takeaway = generalizationExplorer.querySelector(
    "[data-generalization-takeaway]"
  );

  const image = generalizationExplorer.querySelector(
    "[data-generalization-image]"
  );

  let activeCompressor = "bolaco";


  function renderGeneralizationExperiment(experimentKey) {
    const showingCompressors = experimentKey === "compressors";
    const info = showingCompressors
      ? compressorExperiments[activeCompressor]
      : generalizationExperiments[experimentKey];

    if (!info) return;

    compressorControls.hidden = !showingCompressors;
    title.textContent = info.title;
    question.textContent = info.question;
    takeaway.textContent = info.takeaway;
    swapExperimentFigure(image, info);
  }


  experimentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setExplorerTabState(experimentButtons, button);
      renderGeneralizationExperiment(
        button.dataset.generalizationExperiment
      );
    });
  });


  compressorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCompressor = button.dataset.compressor;
      setExplorerTabState(compressorButtons, button);

      const showingCompressors =
        generalizationExplorer
          .querySelector(
            "[data-generalization-experiment].active"
          )
          ?.dataset.generalizationExperiment === "compressors";

      if (showingCompressors) {
        renderGeneralizationExperiment("compressors");
      }
    });
  });
}


const sensitivityExplorer = document.querySelector(
  ".analysis-explorer"
);


if (sensitivityExplorer) {
  const buttons = Array.from(
    sensitivityExplorer.querySelectorAll("[data-sensitivity]")
  );

  const title = sensitivityExplorer.querySelector(
    "[data-sensitivity-title]"
  );

  const question = sensitivityExplorer.querySelector(
    "[data-sensitivity-question]"
  );

  const takeaway = sensitivityExplorer.querySelector(
    "[data-sensitivity-takeaway]"
  );

  const image = sensitivityExplorer.querySelector(
    "[data-sensitivity-image]"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const info =
        sensitivityExperiments[button.dataset.sensitivity];

      if (!info) return;

      setExplorerTabState(buttons, button);
      title.textContent = info.title;
      question.textContent = info.question;
      takeaway.textContent = info.takeaway;
      swapExperimentFigure(image, info);
    });
  });
}


const anatomyExplorer = document.querySelector(
  ".anatomy-explorer"
);


if (anatomyExplorer) {
  const buttons = Array.from(
    anatomyExplorer.querySelectorAll("[data-anatomy]")
  );

  const image = anatomyExplorer.querySelector(
    "[data-anatomy-image]"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const info = anatomyExperiments[button.dataset.anatomy];

      if (!info) return;

      setExplorerTabState(buttons, button);
      swapExperimentFigure(image, info);
    });
  });
}


/* ============================================================
   Reveal animation
   ============================================================ */

const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }

      });

    },
    {
      threshold: 0.08
    }
  );


document
  .querySelectorAll(".reveal")
  .forEach((element) => {
    revealObserver.observe(element);
  });


/* ============================================================
   Scroll progress bar
   ============================================================ */

function updateScroll() {
  const progressBar =
    document.getElementById("progress-bar");

  if (!progressBar) return;

  const max =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const progress =
    max
      ? (window.scrollY / max) * 100
      : 0;

  progressBar.style.width =
    `${progress}%`;
}


window.addEventListener(
  "scroll",
  updateScroll,
  { passive: true }
);

window.addEventListener(
  "resize",
  updateScroll
);

updateScroll();


/* ============================================================
   Copy BibTeX
   ============================================================ */

const copyBibtexButton =
  document.getElementById("copy-bibtex");

if (copyBibtexButton) {

  copyBibtexButton.addEventListener(
    "click",
    async (event) => {

      const button =
        event.currentTarget;

      const bibtex =
        document.getElementById("bibtex");

      if (!bibtex) return;

      try {

        await navigator.clipboard.writeText(
          bibtex.textContent
        );

        button.textContent =
          "Copied ✓";

      } catch {

        button.textContent =
          "Select & copy";

      }

      window.setTimeout(() => {
        button.textContent =
          "Copy BibTeX";
      }, 1600);

    }
  );

}


/* ============================================================
   Back to top
   ============================================================ */

const backToTop =
  document.getElementById("back-to-top");

if (backToTop) {

  backToTop.addEventListener(
    "click",
    () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );

}


/* ============================================================
   Hero directional animation
   ============================================================ */

function drawHero() {

  const canvas =
    document.getElementById("hero-canvas");

  if (!canvas) return;

  const context =
    canvas.getContext("2d");

  if (!context) return;


  const colors = [
    "#d3654d",
    "#3d8759",
    "#6274b8",
    "#ce7328"
  ];


  let width = 0;
  let height = 0;

  let pointer = {
    x: 0.52,
    y: 0.38
  };

  let phase = 0;


  const nodes =
    Array.from(
      { length: 30 },
      (_, index) => ({
        x:
          0.46 +
          Math.cos(index * 2.39) *
            (
              0.14 +
              (index % 6) * 0.027
            ),

        y:
          0.5 +
          Math.sin(index * 1.71) *
            (
              0.12 +
              (index % 4) * 0.035
            ),

        size:
          1.3 +
          (index % 4) * 0.4,

        color:
          colors[
            index % colors.length
          ],

        drift:
          0.17 +
          (index % 5) * 0.09
      })
    );


  function resize() {

    const ratio =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    width =
      canvas.clientWidth;

    height =
      canvas.clientHeight;

    canvas.width =
      width * ratio;

    canvas.height =
      height * ratio;

    context.setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
    );

  }


  function frame() {

    phase += 0.004;

    context.clearRect(
      0,
      0,
      width,
      height
    );


    const originX =
      width *
      (
        0.55 +
        (pointer.x - 0.5) * 0.03
      );


    const originY =
      height *
      (
        0.50 +
        (pointer.y - 0.5) * 0.03
      );


    nodes.forEach(
      (node, index) => {

        const x =
          originX +
          (node.x - 0.55) * width +
          Math.sin(
            phase *
              node.drift *
              8 +
              index
          ) *
            7;


        const y =
          originY +
          (node.y - 0.5) * height +
          Math.cos(
            phase *
              node.drift *
              7 +
              index
          ) *
            7;


        context.beginPath();

        context.moveTo(
          originX,
          originY
        );

        context.lineTo(
          x,
          y
        );

        context.strokeStyle =
          `${node.color}35`;

        context.lineWidth =
          index % 8 === 0
            ? 1.5
            : 0.65;

        context.stroke();


        context.beginPath();

        context.arc(
          x,
          y,
          node.size,
          0,
          Math.PI * 2
        );

        context.fillStyle =
          node.color;

        context.globalAlpha =
          0.46 +
          (index % 3) * 0.1;

        context.fill();

      }
    );


    context.globalAlpha = 1;


    context.beginPath();

    context.arc(
      originX,
      originY,
      7,
      0,
      Math.PI * 2
    );

    context.fillStyle =
      "#152d46";

    context.fill();


    window.requestAnimationFrame(
      frame
    );

  }


  window.addEventListener(
    "resize",
    resize
  );


  window.addEventListener(
    "pointermove",
    (event) => {

      pointer = {
        x:
          event.clientX /
          window.innerWidth,

        y:
          event.clientY /
          window.innerHeight
      };

    },
    {
      passive: true
    }
  );


  resize();
  frame();

}


/* ============================================================
   Active navigation / Scroll Spy
   ============================================================ */

const navSectionLinks =
  Array.from(
    document.querySelectorAll(
      '.nav-links a[href^="#"]'
    )
  )
    .map((link) => {

      const id =
        link
          .getAttribute("href")
          .slice(1);

      return {
        link,
        section:
          document.getElementById(id)
      };

    })
    .filter(
      (item) => item.section
    );


function updateActiveNavigation() {

  if (!navSectionLinks.length) {
    return;
  }


  const probeY =
    window.scrollY +
    window.innerHeight * 0.32;


  let activeItem = null;


  navSectionLinks.forEach(
    (item) => {

      if (
        item.section.offsetTop <=
        probeY
      ) {
        activeItem = item;
      }

    }
  );


  navSectionLinks.forEach(
    (item) => {

      const active =
        item === activeItem;


      item.link.classList.toggle(
        "active",
        active
      );


      if (active) {

        item.link.setAttribute(
          "aria-current",
          "location"
        );

      } else {

        item.link.removeAttribute(
          "aria-current"
        );

      }

    }
  );

}


window.addEventListener(
  "scroll",
  updateActiveNavigation,
  { passive: true }
);


window.addEventListener(
  "resize",
  updateActiveNavigation
);


updateActiveNavigation();


/* ============================================================
   Initial render
   ============================================================ */
renderMainResults("llama2");
renderAblation("llama2");
drawHero();
