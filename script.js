import { db } from "./firebase.js";
import { ref, push, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

let currentStudent = {}, quizActive = false, timeLeft, timerInterval;

// Example Questions
const questions = Array.from({ length: 10 }, (_, i) => ({
    q: `Question ${i + 1}`,
    a: ["Option A", "Option B", "Option C"],
    c: 1
}));

// Show login forms
window.showLogin = function (type) {
    document.getElementById("chooseSection").style.display = "none";
    document.getElementById("studentLogin").style.display = (type === "student") ? "block" : "none";
    document.getElementById("adminLogin").style.display = (type === "admin") ? "block" : "none";
    document.getElementById("navbar").style.display = "flex";
}

// Student login
window.studentLogin = function () {
    const name = document.getElementById("studentName").value.trim();
    const adm = document.getElementById("admission").value.trim();
    const cls = document.getElementById("studentClass").value;
    const pass = document.getElementById("studentPassword").value;
    if (!name || !adm || !cls || pass !== "mary") return alert("Fill correctly. Password=mary");
    currentStudent = { name, adm, cls };
    showSection("subjects");
}

// Admin login
window.adminLogin = function () {
    const pass = document.getElementById("adminPassword").value.trim();
    if (pass !== "headteacher") return alert("Password=headteacher");
    showSection("adminPanel");
    loadAdmin();
}

// Show section
window.showSection = function (id) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// Start quiz
window.startQuiz = function () {
    quizActive = true;
    const sub = document.getElementById("subject").value;
    document.getElementById("quizTitle").innerText = sub + " Assessment";
    const form = document.getElementById("quizForm");
    form.innerHTML = "";
    questions.forEach((q, i) => {
        form.innerHTML += `<p><strong>${q.q}</strong><br>
      <input type="radio" name="q${i}" value="0"> ${q.a[0]}<br>
      <input type="radio" name="q${i}" value="1"> ${q.a[1]}<br>
      <input type="radio" name="q${i}" value="2"> ${q.a[2]}</p>`;
    });
    setTimer(sub === "Mathematics" ? 30 : 20);
    showSection("quiz");
}

// Timer
function setTimer(mins) {
    clearInterval(timerInterval);
    timeLeft = mins * 60;
    updateTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) { clearInterval(timerInterval); alert("Time up! Submitting..."); submitQuiz(); }
    }, 1000);
}
function updateTimer() {
    const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    document.getElementById("timer").innerText = `Time Left: ${m}:${s.toString().padStart(2, "0")}`;
}

// Submit quiz
window.submitQuiz = function () {
    quizActive = false; clearInterval(timerInterval);
    let score = 0;
    questions.forEach((q, i) => {
        const ans = document.querySelector(`input[name="q${i}"]:checked`);
        if (ans && ans.value == q.c) score++;
    });
    const submission = {
        name: currentStudent.name,
        adm: currentStudent.adm,
        cls: currentStudent.cls,
        subject: document.getElementById("subject").value,
        score,
        time: new Date().toLocaleString()
    };
    push(ref(db, "submissions"), submission)
        .then(() => alert(`Submitted! Score: ${score}/10`))
        .catch(err => alert("Error submitting: " + err));
    showSection("subjects");
}

// Load admin panel
function loadAdmin() {
    get(ref(db, "submissions")).then(snap => {
        const table = document.getElementById("adminTable");
        table.innerHTML = "";
        const data = snap.val();
        if (!data) { table.innerHTML = "<tr><td colspan='6'>No submissions yet</td></tr>"; return; }
        Object.values(data).forEach(d => {
            table.innerHTML += `<tr>
        <td>${d.name}</td><td>${d.adm}</td><td>${d.cls}</td>
        <td>${d.subject}</td><td>${d.score}</td><td>${d.time}</td>
      </tr>`;
        });
    });
}

// Logout
window.logout = function () {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById("navbar").style.display = "none";
    document.getElementById("chooseSection").style.display = "block";
    currentStudent = {}; quizActive = false;
}