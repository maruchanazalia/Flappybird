onmessage = function(event) {
    if (event.data.action === 'start') {
        console.log('pipeWorker recibió el mensaje de inicio');
        creacionTuberias(); 
    }
};

function creacionTuberias() {
    console.log('Se inició la creación de tuberías');

    setInterval(() => {
        const topPosition = Math.floor(Math.random() * 43) + 8;
        const bottomPosition = topPosition + 15;

        postMessage({
            action: 'createPipe',
            topPosition: topPosition,
            bottomPosition: bottomPosition
        });

        console.log('Tuberías creadas en las posiciones:', topPosition, bottomPosition);
    }, 3000);
}
