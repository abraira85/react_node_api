export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toCamelCase(str: string) {
    return str.replace(/([-_][a-z])/gi, ($1) => {
        return $1.toUpperCase().replace("-", "").replace("_", "");
    });
}

export function fromCamelCase(str: string, delimiter: '_') {
    return str.replace(/[A-Z]/g, (match, offset) => {
        return (offset !== 0 ? delimiter : '') + match.toLowerCase();
    });
}
