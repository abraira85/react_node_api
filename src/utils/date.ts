export function parseDate(str: string) {
    const parsedDate = new Date(str);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');

    return `${year}/${month}/${day}`;
}

export function parseDateTime(str: string) {
    const parsedDate = new Date(str);
    const datePart = parseDate(str);

    const hours = parsedDate.getHours().toString().padStart(2, "0");
    const minutes = parsedDate.getMinutes().toString().padStart(2, "0");
    const seconds = parsedDate.getSeconds().toString().padStart(2, "0");

    return `${datePart} ${hours}:${minutes}:${seconds}`;
}
