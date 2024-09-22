let move_speed = 3, gravedad = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

// Workers
let birdWorker = new Worker('./scripts/birdWorker.js');
let pipeWorker = new Worker('./scripts/pipeWorker.js');
let scoreWorker = new Worker('./scripts/scoreWorker.js');

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');

        birdWorker.postMessage({ action: 'start' });
        pipeWorker.postMessage({ action: 'start' });
        scoreWorker.postMessage({ action: 'restablecerpuntuación' });

        console.log('Mensaje de inicio enviado a pipeWorker');

    }
});

document.addEventListener('keydown', (e) => {
    if ((e.key === 'ArrowUp' || e.key === ' ') && game_state === 'Play') {
        birdWorker.postMessage({ action: 'flap' });
    }
});

birdWorker.onmessage = function (event) {
    if (event.data.action === 'actualizarPosición') {
        bird.style.top = bird_props.top + event.data.pajarito + 'px';
        bird_props = bird.getBoundingClientRect();

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            endGame();
        }
    }
};

pipeWorker.onmessage = function (event) {
    if (event.data.action === 'createPipe') {
        const gapHeight = 15;  

        // Tubo superior
        let pipeTop = document.createElement('div');
        pipeTop.className = 'pipe_sprite pipeTop';
        pipeTop.style.position = 'absolute';
        pipeTop.style.height = event.data.topPosition + 'vh';
        pipeTop.style.top = '0';  
        pipeTop.style.left = '100vw';  
        document.body.appendChild(pipeTop);

        // Tubo inferior
        let pipeBottom = document.createElement('div');
        pipeBottom.className = 'pipe_sprite';
        pipeBottom.style.position = 'absolute';
        pipeBottom.style.height = (100 - event.data.bottomPosition - gapHeight) + 'vh';
        pipeBottom.style.top = (event.data.bottomPosition + gapHeight) + 'vh';  
        pipeBottom.style.left = '100vw';  
        document.body.appendChild(pipeBottom);
    }
};

scoreWorker.onmessage = function(event) {
    if (event.data.action === 'actualizarPuntuación') {
        score_val.innerHTML = event.data.score;
    }
};


let score = 0;

function movePipes() {
    let pipes = document.querySelectorAll('.pipe_sprite');

    pipes.forEach((pipe) => {
        let pipe_left = parseFloat(window.getComputedStyle(pipe).getPropertyValue('left'));
        pipe.style.left = (pipe_left - move_speed) + 'px';

        if (pipe_left <= -10) {
            pipe.remove();
        }

        detectCollision(bird, pipes);
        if (!pipe.scored && pipe_left + pipe.getBoundingClientRect().width < bird.getBoundingClientRect().left) {
            if (pipe.classList.contains('pipeTop')) {  
                pipe.scored = true;  
                scoreWorker.postMessage({ action: 'incrementoPuntuación' });
                sound_point.play();  
            }
        }
    });

    requestAnimationFrame(movePipes);
}





document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state === 'Play') {
        requestAnimationFrame(movePipes);  
    }
});


function detectCollision(bird, pipes) {
    let birdRect = bird.getBoundingClientRect();

    pipes.forEach(pipe => {
        let pipeRect = pipe.getBoundingClientRect();

        if (
            birdRect.right > pipeRect.left &&
            birdRect.left < pipeRect.right &&
            birdRect.bottom > pipeRect.top &&
            birdRect.top < pipeRect.bottom
        ) {
            endGame();  
        }
    });
}




setInterval(() => {
    let pipes = document.querySelectorAll('.pipe_sprite');
    pipes.forEach(pipe => {
        let currentRight = parseFloat(pipe.style.right);
        currentRight += move_speed; 
        pipe.style.right = `${currentRight}vw`;  

        if (currentRight > 100) { 
            pipe.remove();
            console.log('Pipe removed from DOM');
        }
    });
}, 20);





function endGame() {
    game_state = 'End';
    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
    message.classList.add('messageStyle');
    img.style.display = 'none';
    sound_die.play();

    birdWorker.terminate();
    pipeWorker.terminate();
    scoreWorker.terminate();
}
