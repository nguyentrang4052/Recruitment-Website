export const formatDescription = (text) => {
    if (!text) return "";

    const isHTML = /<\/?[a-z][\s\S]*>/i.test(text);
    if (isHTML) {
        return { __html: text }; 
    }

    // Nếu có bullet point • 
    if (text.includes("•")) {
        const lines = text
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const items = lines.map(line =>
            line.replace(/^•\s*/, "")
        );

        const ul = `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
        return { __html: ul };
    }

    // Nếu chỉ có xuống dòng → chuyển thành <p>
    if (text.includes("\n")) {
        const paragraphs = text
            .split(/\r?\n/)
            .map(p => `<p>${p}</p>`)
            .join("");
        return { __html: paragraphs };
    }

    // Chuỗi đơn bình thường
    return { __html: `<p>${text}</p>` };
};
