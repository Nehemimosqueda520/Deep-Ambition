import { EN_US, ES_AR, PT_BR } from '../enums/languages';

const PROJECT_ID = '60';
let translations = null;
let language = ES_AR;

export function getTranslations(lang, callback) {
    localStorage.clear();
    translations = null;
    language = lang;
    if (language === ES_AR) {
        return callback ? callback() : Promise.resolve(false);
    }

    return fetch(`https://traduci-la-strapi.herokuapp.com/api/translations/${PROJECT_ID}/${language}`)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('translations', JSON.stringify(data));
            translations = data;
            if (callback) callback();
        });
}

export function getPhrase(key) {
    if (!translations) {
        const locals = localStorage.getItem('translations');
        translations = locals ? JSON.parse(locals) : null;
    }

    let phrase = key;
    if (translations && translations[key]) {
        phrase = translations[key];
    }

    return phrase;
}

function isAllowedLanguge(lang) {
    const allowedLanguages = [ES_AR, EN_US, PT_BR];
    return allowedLanguages.indexOf(lang) !== -1;
}

export function getLanguageConfig() {
    const path = window.location.pathname !== '/' ? window.location.pathname : null;
    const params = new URL(window.location.href).searchParams;
    const queryLang = params.get('lang');

    const languageConfig = path ?? queryLang;

    if (languageConfig) {
        if (isAllowedLanguge(languageConfig)) {
            return languageConfig;
        }
    }

    const browserLanguage = window.navigator.language;
    if (isAllowedLanguge(browserLanguage)) {
        return browserLanguage;
    }

    return ES_AR;
}