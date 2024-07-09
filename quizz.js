const initialTime = 600; 
const timerElement = document.getElementById('timer');
let time = initialTime;
let countdown;

const questions = [
    {
        "question": "What does AI stand for?",
        "options": ["Artificial Intelligence", "Automated Intelligence", "Actual Intelligence", "Automated Information"],
        "answer": "Artificial Intelligence"
    },
    {
        "question": "Which of these is a type of AI?",
        "options": ["Supervised Learning", "Machine Learning", "Deep Learning", "All of the above"],
        "answer": "All of the above"
    },
    {
        "question": "Who is considered the father of AI?",
        "options": ["Alan Turing", "John McCarthy", "Elon Musk", "Jeff Bezos"],
        "answer": "John McCarthy"
    },
    {
        "question": "What language is commonly used for AI?",
        "options": ["JavaScript", "Python", "HTML", "CSS"],
        "answer": "Python"
    },
    {
        "question": "Which of these is a goal of AI?",
        "options": ["To create human-like intelligence", "To replace humans", "To solve specific tasks", "Both A and C"],
        "answer": "Both A and C"
    },
    {
        "question": "What is Machine Learning?",
        "options": ["A type of AI", "A programming language", "A hardware component", "None of the above"],
        "answer": "A type of AI"
    },
    {
        "question": "Which AI technology is used for speech recognition?",
        "options": ["NLP", "RPA", "ML", "DL"],
        "answer": "NLP"
    },
    {
        "question": "What is Deep Learning?",
        "options": ["A subset of ML", "A type of network", "A programming language", "None of the above"],
        "answer": "A subset of ML"
    },
    {
        "question": "Which of the following is an example of AI in daily life?",
        "options": ["Virtual assistants", "Recommendation systems", "Self-driving cars", "All of the above"],
        "answer": "All of the above"
    },
    {
        "question": "What is the purpose of a neural network?",
        "options": ["To mimic the human brain", "To create web pages", "To design hardware", "None of the above"],
        "answer": "To mimic the human brain"
    },
    {
        "question": "What is a common use of AI in healthcare?",
        "options": ["Disease diagnosis", "Treatment recommendation", "Predicting patient outcomes", "All of the above"],
        "answer": "All of the above"
    },
    {
        "question": "Which company is known for its AI research?",
        "options": ["Google", "Amazon", "Facebook", "All of the above"],
        "answer": "All of the above"
    }
];

let currentPage = 1;
const questionsPerPage = 4;
let userAnswers = new Array(questions.length).fill(null);

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
