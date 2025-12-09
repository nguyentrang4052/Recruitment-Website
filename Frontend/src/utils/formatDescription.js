export const formatDescription = (text) => {
    if (!text) return "";

    const isHTML = /<\/?[a-z][\s\S]*>/i.test(text);
    if (isHTML) {
        return { __html: text };
    }

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

    if (text.includes("-")) {
        const items = text
            .split("-")              
            .map(i => i.trim())      
            .filter(i => i.length > 0);

        const ul = `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
        return { __html: ul };
    }

    if (!text.includes("-")) {
    const items = text
        .split(/(?<=\.)\s+/)      
        .map(i => i.trim())
        .filter(i => i.length > 0);

    const ul = `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
    return { __html: ul };
}

    if (text.includes("\n")) {
        const paragraphs = text
            .split(/\r?\n/)
            .map(p => `<p>${p}</p>`)
            .join("");
        return { __html: paragraphs };
    }

    return { __html: `<p>${text}</p>` };
};
