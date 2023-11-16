import NOT_FOUND from '../localizations/not_found.js';
import MAIN_MENU from '../localizations/main_menu.js';
import GAME_DETAILS from '../localizations/game_details.js';
import GAME from '../localizations/game.js';
import HEADER from '../localizations/header.js';
import META from '../localizations/meta.js';

const LANGUAGE_TYPES = {
    ENGLISH: 'en',
    DANISH: 'da'
}

let LANGUAGE = 'en';

const locals = {
    ...NOT_FOUND,
    ...MAIN_MENU,
    ...GAME_DETAILS,
    ...GAME,
    ...HEADER,
    ...META,
}

export const useLocalization = (_locals = locals) => {

    const getLocale = (key) => {
        let result = _locals;

        const splitKey = key.split('.');
        while (splitKey.length > 1) {
            const currentKey = splitKey.shift();
            result = result[currentKey];
        }

        return result[splitKey[0]][LANGUAGE];
    }

    const setLanguage = (lang) => {
        const isLanguageValid = Object.values(LANGUAGE_TYPES).includes(lang);
        if (!isLanguageValid) {
            throw new Error('Invalid language');
        }

        LANGUAGE = lang;
    }

    return {
        getLocale,
        setLanguage
    }
}
