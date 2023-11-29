
export default (sequencies) => {
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
        player.index = 0;
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
