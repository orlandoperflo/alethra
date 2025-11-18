document.addEventListener("DOMContentLoaded", async () => {
    const CASES_JSON_PATH = "/case/cases.json";
    const MAX_RELATED_CASES = 2;

    const titleEl = document.getElementById("case-title");
    const contentEl = document.getElementById("case-content");
    const imageEl = document.getElementById("case-image");
    const relatedContainer = document.getElementById("related-cases-container");
    const pageContainer = document.getElementById("case-container");

    // ==highlight== text → red
    const parseRedText = text =>
        text.replace(/==(.+?)==/g, (_, p1) => `<span class="text-klyr-red">${p1}</span>`);

    // Date formatter (in case you use dates later)
    const formatDate = dateString => {
        if (!dateString) return "";
        const date = new Date(dateString.replace(/-/g, "/"));
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
    };

    // Related case card builder
    const createRelatedCaseCard = caseItem => `
        <div class="flex flex-col bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
            <a href="${caseItem.url}" class="block mb-4 group">
                <div class="aspect-[16/9] w-full bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300 group-hover:opacity-90 transition-opacity">
                    ${caseItem.image
                        ? `<img src="${caseItem.image}" alt="${caseItem.title}" class="w-full h-full object-cover rounded-lg border border-gray-300">`
                        : `<span class="text-gray-500 font-medium">Related Image (16:9)</span>`}
                </div>
            </a>
            <h3 class="text-xl font-bold text-klyr-dark mb-3">
                <a href="${caseItem.url}" class="hover:text-klyr-red transition-colors">
                    ${parseRedText(caseItem.title)}
                </a>
            </h3>
            <p class="text-gray-600 text-base mb-4 description-alignment-fix">
                ${parseRedText(caseItem.excerpt || "")}
            </p>
            <div class="mt-auto">
                <a href="${caseItem.url}" class="font-bold text-klyr-red hover:underline">
                    ${caseItem.ctaText || "View Details"} &raquo;
                </a>
            </div>
        </div>
    `;

    try {
        // --- 1. Load cases.json ---
        const res = await fetch(CASES_JSON_PATH);
        if (!res.ok) throw new Error("Failed to load cases.json");

        const raw = await res.json();
        const cases = Array.isArray(raw) ? raw : raw.cases;

        if (!Array.isArray(cases)) {
            throw new Error("cases.json is not an array and has no `.cases` array");
        }

        // --- 2. Extract {id} from ANY valid case path ---
        // Works for:
        // /case/id/
        // /case/id
        // /case/id/index.html
        let path = window.location.pathname.replace(/\/index\.html$/, "");
        let segments = path.split("/").filter(Boolean);

        let pathId = segments[1]; // because segments = ["case", "{id}"]

        // --- 3. Find matching case ---
        const current = cases.find(c => c.id === pathId);
        if (!current) throw new Error("Case not found in JSON");

        // --- 4. Load Markdown content ---
        let markdown = "";
        if (current.contentFile) {
            const mdRes = await fetch(current.contentFile);

            if (mdRes.ok) {
                markdown = await mdRes.text();
            } else {
                console.error("Markdown NOT FOUND:", current.contentFile);
            }
        }

        // If markdown is empty → show fallback instead of a blank page
        if (!markdown.trim()) {
            contentEl.innerHTML = `<p class="text-red-500">Case content is missing.</p>`;
        } else {
            contentEl.innerHTML = marked.parse(parseRedText(markdown));
        }

        // --- 5. Title & image ---
        titleEl.innerHTML = parseRedText(current.title);

        if (current.image) {
            imageEl.innerHTML = `
                <img src="${current.image}" alt="${current.title}" 
                class="w-full h-full object-cover rounded-lg border border-gray-300">
            `;
        }

        document.title = `${current.title} – Case Study`;
        pageContainer.style.opacity = 1;

        // --- 6. Related cases ---
        const otherCases = cases.filter(c => c.id !== current.id);
        const related = otherCases.slice(0, MAX_RELATED_CASES);

        if (related.length > 0) {
            relatedContainer.innerHTML = related.map(createRelatedCaseCard).join("");
        } else {
            relatedContainer.parentElement.style.display = "none";
        }

    } catch (err) {
        console.error("Case page error:", err);
        contentEl.innerHTML = `<p class="text-red-500">Failed to load case study.</p>`;
        pageContainer.style.opacity = 1;
        if (relatedContainer) relatedContainer.parentElement.style.display = "none";
    }
});
