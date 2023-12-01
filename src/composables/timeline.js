
export default (sequencies, onStop=()=>{}) => {
    const state = [...sequencies];
    const player = { index: 0 };
    let timeout = null;

    const playNext = () => {
        const nextSequence = state[player.index];
        nextSequence.callback();
        player.index++;

        timeout = setTimeout(() => {
            if (player.index >= state.length) {
                player.index = 0;
                return;
            }

            playNext();
        }, nextSequence.playTime);
    }

    const play = () => {
        if (timeout) return;
        playNext();
    }

    const stop = () => {
        clearTimeout(timeout);
        timeout = null;
        player.index = 0;
        onStop();
    }

    const isPlaying = () => {
        return timeout !== null;
    }

    return {
        play,
        stop,
        isPlaying,
    }
}
