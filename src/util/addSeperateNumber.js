export function addSeperateNumber(number) {
    // Sayıyı 2 ondalık basamağa yuvarla
    const roundedNumber = Number(number.toFixed(2));
    return roundedNumber;
}