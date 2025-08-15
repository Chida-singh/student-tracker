// attendance.js
// Fetch classes, students, and handle attendance marking

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
  const selectDiv = document.getElementById('attendanceClassSelect');
  if (!Array.isArray(classes) || classes.length === 0) {
    selectDiv.innerHTML = '<p>No classes found.</p>';
    return;
  }
  const select = document.createElement('select');
  select.id = 'classSelect';
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
  renderAttendanceList(students);
}

function renderAttendanceList(students) {
  const form = document.getElementById('attendanceForm');
  const listDiv = document.getElementById('attendanceList');
  if (!Array.isArray(students) || students.length === 0) {
    listDiv.innerHTML = '<p>No students found.</p>';
    form.style.display = 'none';
    return;
  }
  listDiv.innerHTML = students.map(s =>
    `<label><input type="checkbox" name="attendance" value="${s._id}" checked> ${s.name}</label><br>`
  ).join('');
  form.style.display = 'block';
  form.onsubmit = (e) => submitAttendance(e, students);
}

async function submitAttendance(e, students) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const checked = Array.from(document.querySelectorAll('input[name="attendance"]:checked')).map(cb => cb.value);
  const classId = document.getElementById('classSelect').value;
  const date = new Date().toISOString().slice(0,10);
  let success = 0;
  for (const s of students) {
    const status = checked.includes(s._id) ? 'Present' : 'Absent';
    const res = await fetch('http://localhost:5000/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ studentId: s._id, date, status })
    });
    if (res.ok) success++;
  }
  document.getElementById('attendanceMessage').textContent = `Attendance submitted for ${success} students.`;
}
