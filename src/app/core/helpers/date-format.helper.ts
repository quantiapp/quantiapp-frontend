export function formatDate(date: string, locale: string = 'pt-PT', monthLength: "numeric" | "2-digit" | "long" | "short" | "narrow" = 'short'): string {

    const dateInstance = new Date(date);

    const day = dateInstance.toLocaleDateString(locale, { day: '2-digit' });
    const month = dateInstance.toLocaleDateString(locale, { month: monthLength });
    const year = dateInstance.getFullYear();
    const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

    return `${ day }, ${ monthCapitalized } ${ year }`;

}