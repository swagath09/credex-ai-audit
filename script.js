const loggedInUser =
localStorage.getItem("loggedInUser");

if(loggedInUser){

    document.addEventListener("DOMContentLoaded", () => {

        document.getElementById("dashboardUsername")
        .innerText = loggedInUser;

    });

}

const userAvatar =
document.getElementById("userAvatar");

if(loggedInUser){

    userAvatar.innerText =
    loggedInUser.charAt(0).toUpperCase();

}

/* LOGOUT */

document
.getElementById("logoutBtn")
.addEventListener("click", () => {

    localStorage.removeItem("loggedInUser");

    window.location.href = "Auth.html";

});

/* MOBILE SIDEBAR */

const menuToggle =
document.getElementById("menuToggle");

const sidebar =
document.querySelector(".sidebar");

menuToggle.addEventListener("click", () => {

    if(sidebar.classList.contains("active-sidebar")){

        sidebar.classList.remove("active-sidebar");

    }
    else{

        sidebar.classList.add("active-sidebar");

    }

});

/* CLOSE SIDEBAR WHEN CLICKING OUTSIDE */

document.addEventListener("click", (e) => {

    if(
        window.innerWidth <= 768 &&
        !sidebar.contains(e.target) &&
        !menuToggle.contains(e.target)
    ){

        sidebar.classList.remove("active-sidebar");

    }

});

const toolContainer = document.getElementById("toolContainer");

const tools = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "GitHub Copilot",
  "Gemini",
  "OpenAI API",
  "Anthropic API",
  "Windsurf"
];

let pieChart;
let barChart;

/* ADD TOOL */

function addToolRow() {

  const row = document.createElement("div");
  row.classList.add("tool-row");

  row.innerHTML = `
  
    <div class="tool-grid">

      <select class="tool-name">
        ${tools.map(tool => `<option>${tool}</option>`).join("")}
      </select>

      <select class="tool-plan">
        <option>Free</option>
        <option>Pro</option>
        <option>Team</option>
        <option>Enterprise</option>
      </select>

      <input type="number" class="tool-cost" placeholder="Monthly Cost">

      <input type="number" class="tool-seats" placeholder="Seats">

      <select class="tool-usecase">
        <option>Coding</option>
        <option>Writing</option>
        <option>Research</option>
        <option>Data</option>
        <option>Mixed</option>
      </select>

      <button class="primary-btn remove-btn">
        Remove
      </button>

    </div>
  
  `;

  toolContainer.appendChild(row);

  row.querySelector(".remove-btn").addEventListener("click", () => {
    row.remove();
  });

}

/* INITIAL ROW */

addToolRow();

/* ADD BUTTON */

document
.getElementById("addToolBtn")
.addEventListener("click", addToolRow);

/* GENERATE AUDIT */

document
.getElementById("generateAuditBtn")
.addEventListener("click", generateAudit);

function generateAudit(){

  const rows = document.querySelectorAll(".tool-row");

  let totalCurrent = 0;
  let totalOptimized = 0;

  const breakdownContainer =
    document.getElementById("breakdownContainer");

  const recommendationContainer =
    document.getElementById("recommendationContainer");

  breakdownContainer.innerHTML = "";
  recommendationContainer.innerHTML = "";

  let labels = [];
  let spendData = [];

  rows.forEach(row => {

    const tool =
      row.querySelector(".tool-name").value;

    const plan =
      row.querySelector(".tool-plan").value;

    const cost =
      Number(row.querySelector(".tool-cost").value);

    const seats =
      Number(row.querySelector(".tool-seats").value);

    const usecase =
      row.querySelector(".tool-usecase").value;

    if(!cost) return;

    totalCurrent += cost;

    let optimized = cost;
    let reason = "Your current plan is optimized.";

    /* AI LOGIC */

    if(plan === "Enterprise" && seats < 10){

      optimized = cost * 0.6;

      reason =
      "Enterprise plan is unnecessary for small teams.";

    }

    else if(plan === "Team" && seats <= 2){

      optimized = cost * 0.7;

      reason =
      "Switching to Pro plans can reduce costs.";

    }

    else if(tool.includes("API")){

      optimized = cost * 0.85;

      reason =
      "Caching and optimized prompts can reduce API costs.";

    }

    const savings = cost - optimized;

    totalOptimized += optimized;

    labels.push(tool);
    spendData.push(cost);

    /* BREAKDOWN CARD */

    const breakdown = document.createElement("div");

    breakdown.classList.add("breakdown-card");

    breakdown.innerHTML = `
    
      <h4>${tool}</h4>

      <p>
        Current: $${cost} → Optimized: $${optimized.toFixed(0)}
      </p>

      <p>
        Savings: $${savings.toFixed(0)}/month
      </p>

      <p>
        ${reason}
      </p>
    
    `;

    breakdownContainer.appendChild(breakdown);

    /* RECOMMENDATION */

    if(savings > 0){

      const rec = document.createElement("div");

      rec.classList.add("recommendation");

      rec.innerHTML = `
      
        <h4>${tool} Optimization</h4>

        <p>${reason}</p>
      
      `;

      recommendationContainer.appendChild(rec);

    }

  });

  const monthlySavings =
    totalCurrent - totalOptimized;

  const annualSavings =
    monthlySavings * 12;

  /* UPDATE HERO */

  document.getElementById("currentSpend")
  .innerText = `$${totalCurrent.toFixed(0)}`;

  document.getElementById("optimizedSpend")
  .innerText = `$${totalOptimized.toFixed(0)}`;

  document.getElementById("monthlySavings")
  .innerText = `$${monthlySavings.toFixed(0)}`;

  document.getElementById("annualSavings")
  .innerText = `$${annualSavings.toFixed(0)}`;

  /* AI SUMMARY */

  document.getElementById("summaryText")
  .innerText =
  `Your organization is currently overspending by approximately $${monthlySavings.toFixed(0)} per month. We identified multiple optimization opportunities involving enterprise-tier plans, inactive seats, and inefficient AI infrastructure usage. Implementing these recommendations could significantly reduce operational AI costs annually.`;

  /* CHARTS */

  renderCharts(labels, spendData, totalOptimized);

}

/* CHARTS */

function renderCharts(labels, spendData, optimized){

  const pieCtx =
    document.getElementById("pieChart");

  const barCtx =
    document.getElementById("barChart");

  if(pieChart){
    pieChart.destroy();
  }

  if(barChart){
    barChart.destroy();
  }

  pieChart = new Chart(pieCtx, {

    type:"doughnut",

    data:{
      labels:labels,

      datasets:[{
        data:spendData,

        backgroundColor:[
          "#6C63FF",
          "#00D4FF",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6"
        ]
      }]
    }

  });

  barChart = new Chart(barCtx, {

    type:"bar",

    data:{
      labels:["Current Spend","Optimized Spend"],

      datasets:[{
        label:"AI Costs",

        data:[
          spendData.reduce((a,b)=>a+b,0),
          optimized
        ],

        backgroundColor:[
          "#6C63FF",
          "#10B981"
        ]
      }]
    }

  });

}

/* =========================================
   CREATE EXTRA PAGES
========================================= */

const extraPages = `

<!-- NEW AUDIT PAGE -->

<section id="newAuditPage" class="tab-page" style="display:none;">

    <div class="dashboard-card">

        <div class="section-header">

            <div>
                <h2>Create New AI Audit</h2>
                <p>Start a fresh AI infrastructure optimization audit.</p>
            </div>

        </div>

        <div class="stats-grid">

            <div class="stat-card">
                <div class="card-icon purple">
                    <i class="fa-solid fa-microchip"></i>
                </div>

                <h3>Supported Tools</h3>
                <h2>8+</h2>
                <p>Enterprise AI providers</p>
            </div>

            <div class="stat-card">
                <div class="card-icon blue">
                    <i class="fa-solid fa-chart-line"></i>
                </div>

                <h3>Average Savings</h3>
                <h2>42%</h2>
                <p>Cost reduction potential</p>
            </div>

            <div class="stat-card">
                <div class="card-icon green">
                    <i class="fa-solid fa-wallet"></i>
                </div>

                <h3>Monthly Audits</h3>
                <h2>12K+</h2>
                <p>AI audits processed</p>
            </div>

            <div class="stat-card">
                <div class="card-icon orange">
                    <i class="fa-solid fa-rocket"></i>
                </div>

                <h3>Audit Speed</h3>
                <h2>5s</h2>
                <p>Instant optimization engine</p>
            </div>

        </div>

    </div>

</section>

<!-- REPORTS PAGE -->

<section id="reportsPage" class="tab-page" style="display:none;">

    <div class="dashboard-card">

        <div class="section-header">
            <div>
                <h2>Audit Reports</h2>
                <p>Recent optimization reports.</p>
            </div>
        </div>

        <div class="breakdown-card">
            <h4>Engineering Team Audit</h4>
            <p>Savings: $4,200/year</p>
        </div>

        <div class="breakdown-card">
            <h4>Marketing Stack Audit</h4>
            <p>Savings: $1,850/year</p>
        </div>

    </div>

</section>

<!-- ANALYTICS PAGE -->

<section id="analyticsPage" class="tab-page" style="display:none;">

    <div class="dashboard-card">

        <div class="section-header">
            <div>
                <h2>Analytics Overview</h2>
                <p>AI spend growth insights.</p>
            </div>
        </div>

        <canvas id="analyticsChart"></canvas>

    </div>

</section>

`;

document
.querySelector(".main-content")
.insertAdjacentHTML("beforeend", extraPages);

/* =========================================
   TAB SWITCHING
========================================= */
const menuItems = document.querySelectorAll(".menu li");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        const text = item.innerText.trim();

        /* IGNORE SETTINGS */

        if(text.includes("Settings")){
            return;
        }

        menuItems.forEach(i => i.classList.remove("active"));

        item.classList.add("active");

        /* HIDE ALL PAGES */

        document.querySelectorAll(".tab-page")
        .forEach(page => {
            page.style.display = "none";
        });

        /* HIDE DASHBOARD FIRST */

        hideDashboard();

        /* PAGE SWITCH */

        if(text.includes("Dashboard")){

            showDashboard();

        }

        else if(text.includes("New Audit")){

            document.getElementById("newAuditPage")
            .style.display = "block";

        }

        else if(text.includes("Reports")){

            document.getElementById("reportsPage")
            .style.display = "block";

        }

        else if(text.includes("Analytics")){

            document.getElementById("analyticsPage")
            .style.display = "block";

            renderAnalyticsChart();

        }

    });

});

/* =========================================
   HIDE DASHBOARD
========================================= */

function hideDashboard(){

    document.querySelector(".stats-grid")
    .style.display = "none";

    document.querySelector(".ai-summary")
    .style.display = "none";

    document.querySelector(".breakdown-grid")
    .style.display = "none";

    document.querySelector(".charts-grid")
    .style.display = "none";

    document.querySelector(".credex-cta")
    .style.display = "none";

    document.querySelectorAll(".dashboard-card")[0]
    .style.display = "none";

    document.querySelectorAll(".dashboard-card")[3]
    .style.display = "none";

}

/* =========================================
   SHOW DASHBOARD
========================================= */

function showDashboard(){

    document.querySelector(".stats-grid")
    .style.display = "grid";

    document.querySelector(".ai-summary")
    .style.display = "flex";

    document.querySelector(".breakdown-grid")
    .style.display = "grid";

    document.querySelector(".charts-grid")
    .style.display = "grid";

    document.querySelector(".credex-cta")
    .style.display = "block";

    document.querySelectorAll(".dashboard-card")[0]
    .style.display = "block";

    document.querySelectorAll(".dashboard-card")[3]
    .style.display = "block";

}

/* =========================================
   ANALYTICS CHART
========================================= */

let analyticsChart;

function renderAnalyticsChart(){

    const ctx =
    document.getElementById("analyticsChart");

    if(analyticsChart){
        analyticsChart.destroy();
    }

    analyticsChart = new Chart(ctx, {

        type:"line",

        data:{

            labels:[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May"
            ],

            datasets:[{

                label:"AI Spend",

                data:[
                    1200,
                    1900,
                    2600,
                    3400,
                    4200
                ],

                borderColor:"#6C63FF",

                backgroundColor:"rgba(108,99,255,0.2)",

                tension:0.4,

                fill:true

            }]

        }

    });

}