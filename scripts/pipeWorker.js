onmessage = function(event) {
    if (event.data.action === 'start') {
        console.log('pipeWorker received start message');
        startCreatingPipes(); // Asegúrate que esta función esté definida
    }
};

function startCreatingPipes() {
    // Aquí debes tener la lógica para empezar a crear los tubos
    console.log('Pipe creation started');

    // Simulación de creación de tubos para depurar
    setInterval(() => {
        const topPosition = Math.floor(Math.random() * 43) + 8;
        const bottomPosition = topPosition + 35;

        postMessage({
            action: 'createPipe',
            topPosition: topPosition,
            bottomPosition: bottomPosition
        });

        console.log('Pipe created with positions:', topPosition, bottomPosition);
    }, 3000); // Crea un tubo cada 3 segundos
}
