let move_speed = 3, gravity = 0.5;
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

        console.log('Sent start message to pipeWorker');

    }
});

document.addEventListener('keydown', (e) => {
    if ((e.key === 'ArrowUp' || e.key === ' ') && game_state === 'Play') {
        birdWorker.postMessage({ action: 'flap' });
    }
});

birdWorker.onmessage = function (event) {
    if (event.data.action === 'updatePosition') {
        bird.style.top = bird_props.top + event.data.bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            endGame();
        }
    }
};

pipeWorker.onmessage = function (event) {
    if (event.data.action === 'createPipe') {
        console.log('Creating pipe with top position:', event.data.topPosition, 'and bottom position:', event.data.bottomPosition);

        // Crear el tubo superior
        let pipe_sprite_inv = document.createElement('div');
        pipe_sprite_inv.className = 'pipe_sprite';
        pipe_sprite_inv.style.top = '0';  // Anclado arriba
        pipe_sprite_inv.style.height = event.data.topPosition + 'vh';
        pipe_sprite_inv.style.right = '100vw';
        document.body.appendChild(pipe_sprite_inv);

        // Crear el tubo inferior
        let pipe_sprite = document.createElement('div');
        pipe_sprite.className = 'pipe_sprite';
        pipe_sprite.style.top = event.data.bottomPosition + 'vh';
        pipe_sprite.style.height = `calc(100vh - ${event.data.bottomPosition}vh)`;
        pipe_sprite.style.right = '100vw';
        pipe_sprite.increase_score = '1';
        document.body.appendChild(pipe_sprite);

        console.log('Pipes added to DOM at initial right: 100vw');
    }
};

setInterval(() => {
    let pipes = document.querySelectorAll('.pipe_sprite');
    pipes.forEach(pipe => {
        let currentRight = parseFloat(pipe.style.right);
        currentRight += move_speed; // Incrementamos gradualmente la posición "right"
        pipe.style.right = `${currentRight}vw`;  // Actualizamos la posición

        if (currentRight > 100) {  // Si el tubo sale de la pantalla
            pipe.remove();
            console.log('Pipe removed from DOM');
        }
    });
}, 20);









scoreWorker.onmessage = function(event) {
    if (event.data.action === 'updateScore') {
        score_val.innerHTML = event.data.score;
    }
};



function endGame() {
    game_state = 'End';
    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
    message.classList.add('messageStyle');
    img.style.display = 'none';
    sound_die.play();

    birdWorker.terminate();
    pipeWorker.terminate();
}
