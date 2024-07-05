const initialTime = 600; 
const timerElement = document.getElementById('timer');
let time = initialTime;
let countdown;

let questions = [];
let currentPage = 1;
const questionsPerPage = 4;
let userAnswers = [];

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        userAnswers = new Array(questions.length).fill(null);
        renderQuestions(currentPage);
        updatePaginationButtons();
    })
    .catch(error => console.error('Error loading questions:', error));

function updateTimerDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerElement.textContent = `Time left: ${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    countdown = setInterval(() => {
        time--;
        updateTimerDisplay();
        if (time <= 0) {
            clearInterval(countdown);
            alert('Time is up!');
            calculateScore();
        }
    }, 1000);
}

function renderQuestions(page) {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    for (let i = (page - 1) * questionsPerPage; i < page * questionsPerPage && i < questions.length; i++) {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        const questionObj = questions[i];

        let optionsHTML = '';
        questionObj.options.forEach((option, index) => {
            const isChecked = userAnswers[i] === option ? 'checked' : '';
            optionsHTML += `<label><input type="radio" name="question${i}" value="${option}" ${isChecked}> ${option}</label><br>`;
        });

        questionDiv.innerHTML = `<p>Question ${i + 1}: ${questionObj.question}</p>${optionsHTML}`;
        questionContainer.appendChild(questionDiv);
        questionDiv.querySelectorAll(`input[name="question${i}"]`).forEach(input => {
            input.addEventListener('change', (event) => {
                userAnswers[i] = event.target.value;
            });
        });
    }
}

function updatePaginationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.style.display = currentPage === Math.ceil(questions.length / questionsPerPage) ? 'none' : 'inline-block';
    submitBtn.style.display = currentPage === Math.ceil(questions.length / questionsPerPage) ? 'inline-block' : 'none';
}

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderQuestions(currentPage);
        updatePaginationButtons();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage < Math.ceil(questions.length / questionsPerPage)) {
        currentPage++;
        renderQuestions(currentPage);
        updatePaginationButtons();
    }
});

document.getElementById('submit-btn').addEventListener('click', () => {
    clearInterval(countdown);
    calculateScore();
});

document.getElementById('start-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    if (username) {
        document.getElementById('username-container').style.display = 'none';
        document.getElementById('question-container').style.display = 'block';
        document.querySelector('.pagination-controls').style.display = 'flex';
        startTimer();
        renderQuestions(currentPage);
        updatePaginationButtons();
    } else {
        alert('Please enter your username');
    }
});

function calculateScore() {
    let score = 0;

    questions.forEach((question, index) => {
        if (userAnswers[index] === question.answer) {
            score++;
        }
    });

    alert(`Thank you for participating! You scored ${score} out of ${questions.length}`);
}
