// dashboard.js
// Loads dashboard data after login

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  // Example: Fetch classes for the teacher
  fetch('http://localhost:5000/classes', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        renderClasses(data);
      } else {
        document.getElementById('dashboardContent').textContent = 'Failed to load classes.';
      }
    })
    .catch(() => {
      document.getElementById('dashboardContent').textContent = 'Server error.';
    });

  document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  };
});

function renderClasses(classes) {
  const container = document.getElementById('dashboardContent');
  container.innerHTML = '<h2>Your Classes</h2>';
  if (classes.length === 0) {
    container.innerHTML += '<p>No classes found. Create one!</p>';
    return;
  }
  const ul = document.createElement('ul');
  classes.forEach(cls => {
    const li = document.createElement('li');
    li.textContent = cls.name;
    // You can add links to class.html, etc. here
    ul.appendChild(li);
  });
  container.appendChild(ul);
}
