import { ref } from 'vue';
import PersistentData from './persistent_data.js';
import NOT_FOUND from '../localizations/not_found.js';
import MAIN_MENU from '../localizations/main_menu.js';
import GAME_DETAILS from '../localizations/game_details.js';
import GAME_MENU from '../localizations/game_menu.js';
import META from '../localizations/meta.js';
import SETTINGS from '../localizations/settings.js';
import PRIVACY from '../localizations/privacy.js';
import RELEASE_NOTES from '../localizations/release_notes.js';
import OBJECTIVES from '../localizations/objectives.js';
import SHOP from '../localizations/shop.js';
import STATS from '../localizations/stats.js';
import PAUSE from '../localizations/pause.js';
import INSPECT from '../localizations/inspect.js';
import BANK from '../localizations/bank.js';
import CONSTRUCTIONS from '../localizations/constructions.js';
import UNITS from '../localizations/units.js';
import TIMELINE from '../localizations/timeline.js';
import INTRO from '../localizations/intro.js';
import TOASTS from '../localizations/toasts.js';
import GAME_END from '../localizations/game_end.js';

const LANGUAGE_TYPES = {
    ENGLISH: 'en',
    DANISH: 'da'
}

const LANGUAGE = ref('en');

const locals = {
    ...NOT_FOUND,
    ...MAIN_MENU,
    ...GAME_DETAILS,
    ...GAME_MENU,
    ...META,
    ...SETTINGS,
    ...PRIVACY,
    ...RELEASE_NOTES,
    ...OBJECTIVES,
    ...SHOP,
    ...STATS,
    ...PAUSE,
    ...INSPECT,
    ...BANK,
    ...CONSTRUCTIONS,
    ...UNITS,
    ...TIMELINE,
    ...INTRO,
    ...TOASTS,
    ...GAME_END,
}

export const useLocalization = (_locals = locals) => {

    const getLocale = (key) => {
        let result = _locals;

        const splitKey = key.split('.');
        while (splitKey.length > 1) {
            const currentKey = splitKey.shift();
            result = result[currentKey];
        }

        return result[splitKey[0]][LANGUAGE.value];
    }

    const setLanguage = (lang) => {
        const isLanguageValid = Object.values(LANGUAGE_TYPES).includes(lang);
        if (!isLanguageValid) {
            throw new Error('Invalid language');
        }

        LANGUAGE.value = lang;
        PersistentData.set('language', {lang});
    }

    return {
        getLocale,
        setLanguage,
        LANGUAGE_TYPES,
        LANGUAGE
    }
}
