let score = 0;

onmessage = function(event) {
    if (event.data.action === 'incrementScore') {
        score++;
        postMessage({ action: 'updateScore', score: score });
    }

    if (event.data.action === 'resetScore') {
        score = 0;
    }
};
