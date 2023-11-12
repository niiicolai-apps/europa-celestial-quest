import { useLocalization } from "./localization.js"

const locals = useLocalization();

const setTitle = (key) => {
    document.title = locals.getLocale('meta.title.prefix')
                   + locals.getLocale(`meta.title.${key}`);
}

export const setMeta = (title_key) => {
    setTitle(title_key);
}
