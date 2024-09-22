let gravedad = 0.5;
let pajarito = 0;

onmessage = (event) => {
    if (event.data.action === 'start') {
        aplicarGravedad();
    } else if (event.data.action === 'flap') {
        pajarito = -7.6;  
    }
};

function aplicarGravedad() {
    pajarito += gravedad;

    postMessage({
        action: 'actualizarPosición',
        pajarito: pajarito
    });

    setTimeout(aplicarGravedad, 20);  
}
