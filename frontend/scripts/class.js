// class.js
// Handles class creation and student addition (frontend only, no backend)

let className = '';
const students = [];

document.getElementById('classForm').addEventListener('submit', function(e) {
  e.preventDefault();
  className = document.getElementById('className').value.trim();
  if (className) {
    document.getElementById('classMessage').textContent = `Class "${className}" created!`;
    document.getElementById('classForm').reset();
  }
});

document.getElementById('studentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!className) {
    document.getElementById('studentMessage').textContent = 'Please create a class first.';
    return;
  }
  const name = document.getElementById('studentName').value.trim();
  const roll = document.getElementById('rollNumber').value.trim();
  const age = document.getElementById('studentAge').value.trim();
  if (!name || !roll) {
    document.getElementById('studentMessage').textContent = 'Name and Roll Number are required.';
    return;
  }
  students.push({ name, roll, age });
  renderStudents();
  document.getElementById('studentForm').reset();
  document.getElementById('studentMessage').textContent = 'Student added!';
});

function renderStudents() {
  const ul = document.getElementById('studentsList');
  ul.innerHTML = '';
  students.forEach((student, idx) => {
    const li = document.createElement('li');
    li.textContent = `${student.name} (Roll: ${student.roll}${student.age ? ', Age: ' + student.age : ''})`;
    ul.appendChild(li);
  });
}
