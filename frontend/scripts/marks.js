// marks.js
// Fetch classes, students, and handle marks entry

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  // Fetch classes for dropdown
  const classRes = await fetch('http://localhost:5000/classes', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const classes = await classRes.json();
  renderClassDropdown(classes);
});

function renderClassDropdown(classes) {
  const selectDiv = document.getElementById('marksClassSelect');
  if (!Array.isArray(classes) || classes.length === 0) {
    selectDiv.innerHTML = '<p>No classes found.</p>';
    return;
  }
  const select = document.createElement('select');
  select.id = 'marksClassSelectDropdown';
  select.innerHTML = '<option value="">Select Class</option>' +
    classes.map(cls => `<option value="${cls._id}">${cls.name}</option>`).join('');
  selectDiv.appendChild(select);
  select.addEventListener('change', onClassChange);
}

async function onClassChange(e) {
  const classId = e.target.value;
  if (!classId) return;
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/students/${classId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const students = await res.json();
  renderMarksList(students);
}

function renderMarksList(students) {
  const form = document.getElementById('marksForm');
  const listDiv = document.getElementById('marksList');
  if (!Array.isArray(students) || students.length === 0) {
    listDiv.innerHTML = '<p>No students found.</p>';
    form.style.display = 'none';
    return;
  }
  listDiv.innerHTML = students.map(s =>
    `<div style='margin-bottom:10px;'>
      <strong>${s.name}</strong><br>
      Subject: <input type='text' name='subject_${s._id}' required>
      Test: <input type='text' name='test_${s._id}' required>
      Scored: <input type='number' name='scored_${s._id}' required style='width:60px;'>
      Total: <input type='number' name='total_${s._id}' required style='width:60px;'>
    </div>`
  ).join('');
  form.style.display = 'block';
  form.onsubmit = (e) => submitMarks(e, students);
}

async function submitMarks(e, students) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  let success = 0;
  for (const s of students) {
    const subject = document.querySelector(`[name='subject_${s._id}']`).value;
    const testName = document.querySelector(`[name='test_${s._id}']`).value;
    const scoredMarks = document.querySelector(`[name='scored_${s._id}']`).value;
    const totalMarks = document.querySelector(`[name='total_${s._id}']`).value;
    const date = new Date().toISOString().slice(0,10);
    const res = await fetch('http://localhost:5000/marks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ studentId: s._id, subject, testName, scoredMarks, totalMarks, date })
    });
    if (res.ok) success++;
  }
  document.getElementById('marksMessage').textContent = `Marks submitted for ${success} students.`;
}
