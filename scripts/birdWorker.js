let gravity = 0.5;
let bird_dy = 0;

onmessage = (event) => {
    if (event.data.action === 'start') {
        applyGravity();
    } else if (event.data.action === 'flap') {
        bird_dy = -7.6;  
    }
};

function applyGravity() {
    bird_dy += gravity;

    postMessage({
        action: 'updatePosition',
        bird_dy: bird_dy
    });

    setTimeout(applyGravity, 20);  
}
