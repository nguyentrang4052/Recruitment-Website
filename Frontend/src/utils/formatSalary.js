function formatCurrencyShort(value) {
    if (value == null || isNaN(value)) return "";

    value = Number(value);

    if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + " tỷ";
    }

    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(2).replace(/\.00$/, "") + " triệu";
    }

    if (value >= 1_000) {
        return (value / 1_000).toFixed(2).replace(/\.00$/, "") + " nghìn";
    }

    return value + " VND";
}


// Hàm format chuỗi dạng "0.00 VND - 10000000.00 VND"
function formatRangeShort(str) {
    const numRegex = /[\d.]+/g;
    const numbers = str.match(numRegex);

    if (!numbers || numbers.length < 2) return "";

    const num1 = parseFloat(numbers[0]);
    const num2 = parseFloat(numbers[1]);

    return `${formatCurrencyShort(num1)} - ${formatCurrencyShort(num2)}`;
}
export { formatCurrencyShort, formatRangeShort };