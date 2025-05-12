document.getElementById("yield-form").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const crop = document.getElementById("crop").value;
    const area = document.getElementById("area").value;
    const production = document.getElementById("production").value;
  
    const res = await fetch("/api/yields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crop, area, production })
    });
  
    const data = await res.json();
    alert("Yield data submitted!");
    loadChart();
  });
  
  async function loadChart() {
    const res = await fetch("/api/yields");
    const yieldData = await res.json();
  
    const labels = yieldData.map(d => d.crop + " (" + new Date(d.date).toLocaleDateString() + ")");
    const yieldValues = yieldData.map(d => d.yield.toFixed(2));
  
    const ctx = document.getElementById("yieldChart").getContext("2d");
  
    if (window.myChart) window.myChart.destroy();
  
    window.myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Yield (tons/hectare)",
          data: yieldValues,
          backgroundColor: "rgba(75, 192, 192, 0.6)"
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
  
  loadChart();
  