let currentLevel = '';
let currentQuestions = [];
let currentIndex = 0;
let score = { correct: 0, wrong: 0 };
let timer;
let timeLeft = 15;
let isTransitioning = false;

function startGame(level) {
    currentLevel = level;
    currentQuestions = shuffleArray([...data[level]]);
    currentIndex = 0;
    score = { correct: 0, wrong: 0 };
    
    showScreen('game-screen');
    nextQuestion();
}

function shuffleArray(array) {
    // Logic to shuffle while ensuring no more than 3 consecutive same answers
    let shuffled;
    let valid = false;
    while (!valid) {
        shuffled = array.sort(() => Math.random() - 0.5);
        valid = true;
        let count = 1;
        for (let i = 1; i < shuffled.length; i++) {
            if (shuffled[i].a === shuffled[i-1].a) {
                count++;
                if (count > 3) { valid = false; break; }
            } else {
                count = 1;
            }
        }
    }
    return shuffled;
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function nextQuestion() {
    if (currentIndex >= 10) {
        showResult();
        return;
    }

    isTransitioning = false;
    document.querySelectorAll('.option-btn').forEach(b => b.className = 'option-btn');
    document.getElementById('progress-text').innerText = `第 ${currentIndex + 1} / 10 題`;
    
    const qData = currentQuestions[currentIndex];
    const area = document.getElementById('question-area');
    area.innerHTML = '';

    // Render Question
    if (currentLevel === 'basic') {
        qData.q.forEach(item => {
            if (item[0] === '___') {
                area.innerHTML += `<span style="border-bottom: 2px solid #3498db; padding: 0 10px;">( ? )</span>`;
            } else {
                area.innerHTML += `<ruby>${item[0]}<rt>${item[1]}</rt></ruby>`;
            }
        });
        speak(qData.raw);
    } else {
        area.innerText = qData.q.replace('___', '(?)');
        speak(qData.q.replace('___', '的')); // Đọc mẫu với "de"
    }

    resetTimer();
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 15;
    const bar = document.getElementById('timer-bar');
    bar.style.width = '100%';
    bar.style.backgroundColor = 'var(--primary-color)';

    timer = setInterval(() => {
        timeLeft -= 0.1;
        const percentage = (timeLeft / 15) * 100;
        bar.style.width = percentage + '%';
        
        if (timeLeft <= 3) bar.style.backgroundColor = 'var(--error-color)';

        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null); // Time's up
        }
    }, 100);
}

function checkAnswer(userChoice) {
    if (isTransitioning) return;
    isTransitioning = true;
    clearInterval(timer);

    const correctAns = currentQuestions[currentIndex].a;
    const btns = document.querySelectorAll('.option-btn');

    // 取得音效元素
    const sfxCorrect = document.getElementById('sound-correct');
    const sfxWrong = document.getElementById('sound-wrong');

    if (userChoice === correctAns) {
        score.correct++;
        
        // 播放答對音效
        sfxCorrect.currentTime = 0; // 重設播放時間，避免連續點擊沒聲音
        sfxCorrect.play();

        if (userChoice === 'A') btns[0].classList.add('correct');
        else btns[1].classList.add('correct');
    } else {
        score.wrong++;

        // 播放答錯音效
        sfxWrong.currentTime = 0;
        sfxWrong.play();

        if (userChoice === 'A') btns[0].classList.add('wrong');
        else if (userChoice === 'B') btns[1].classList.add('wrong');
        
        // 顯示正確答案
        if (correctAns === 'A') btns[0].classList.add('correct');
        else btns[1].classList.add('correct');
    }

    setTimeout(() => {
        currentIndex++;
        nextQuestion();
    }, 800); 
}

function showResult() {
    showScreen('result-screen');
    document.getElementById('correct-count').innerText = score.correct;
    document.getElementById('wrong-count').innerText = score.wrong;
}

function speak(text) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'zh-TW';
    msg.rate = 1.0;
    window.speechSynthesis.speak(msg);
}