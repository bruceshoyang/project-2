async function loadCsv(path) {
  const response = await fetch(path);
  const text = await response.text();

  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row = {};
    headers.forEach((h, i) => {
      row[h.trim()] = values[i] !== undefined ? values[i].trim() : '';
    });
    return row;
  });
}

// Line chart - Monthly members
async function buildMembersLineChart() {
  const data = await loadCsv('data/members_by_month.csv');
  const labels = data.map(row => row.month);
  const values = data.map(row => Number(row.new_members));

  const ctx = document.getElementById('membersLineChart').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'New Members',
        data: values,
        borderWidth: 2,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Pie chart - Membership types
async function buildMembershipPieChart() {
  const data = await loadCsv('data/membership_types.csv');
  const labels = data.map(row => row.type);
  const values = data.map(row => Number(row.count));

  const ctx = document.getElementById('membershipPieChart').getContext('2d');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: values
      }]
    },
    options: {
      responsive: true
    }
  });
}

// Bar chart - Class attendance
async function buildAttendanceBarChart() {
  const data = await loadCsv('data/class_attendance.csv');
  const labels = data.map(row => row.day);
  const values = data.map(row => Number(row.average_attendance));

  const ctx = document.getElementById('attendanceBarChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Avg Attendance',
        data: values
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Radar chart - Satisfaction
async function buildSatisfactionRadarChart() {
  const data = await loadCsv('data/satisfaction_scores.csv');
  const labels = data.map(row => row.dimension);
  const values = data.map(row => Number(row.score));

  const ctx = document.getElementById('satisfactionRadarChart').getContext('2d');

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: 'Average Score',
        data: values
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 10
        }
      }
    }
  });
}

// Scatter chart - Revenue by category
async function buildRevenueScatterChart() {
  const data = await loadCsv('data/revenue_by_category.csv');

  const points = data.map(row => ({
    x: Number(row.customers),
    y: Number(row.avg_spend),
    category: row.category
  }));

  const ctx = document.getElementById('revenueScatterChart').getContext('2d');

  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Revenue Segments',
        data: points,
        parsing: {
          xAxisKey: 'x',
          yAxisKey: 'y'
        }
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const p = context.raw;
              return `${p.category}: ${p.x} customers, $${p.y} avg spend`;
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Number of Customers' },
          beginAtZero: true
        },
        y: {
          title: { display: true, text: 'Average Spend ($)' },
          beginAtZero: true
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildMembersLineChart();
  buildMembershipPieChart();
  buildAttendanceBarChart();
  buildSatisfactionRadarChart();
  buildRevenueScatterChart();
});
