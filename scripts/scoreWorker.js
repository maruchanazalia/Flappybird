let score = 0;

onmessage = function(event) {
    if (event.data.action === 'incrementoPuntuación') {
        score++;
        postMessage({ action: 'actualizarPuntuación', score: score });
    }

    if (event.data.action === 'restablecerpuntuación') {
        score = 0;
        postMessage({ action: 'actualizarPuntuación', score: score });
    }
};
