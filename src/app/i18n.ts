import 'server-only';

const dictionaries = {
    'fr': () => import('@/dictionaries/fr.json').then((module) => module.default),
    'en-US': () => import('@/dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    if (locale === 'en-US') {
        return dictionaries['en-US']();
    }
    return dictionaries['fr']();
};
