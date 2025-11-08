// aqui chamará os sons de notificação
const listSound = [
    "sounds/yamete-kudasai.wav",
    "sounds/sucesso.mp3",
    "sounds/erro.mp3",
    "sounds/confirmar.mp3",
];

function Sound() {
    const playSound = async (soundFile) => {
        const audio = new Audio(soundFile);
        audio.volume = 0.5;
        await audio.play();
    }
    return { playSound, listSound };
}
export default Sound;