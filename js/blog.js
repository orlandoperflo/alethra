document.addEventListener("DOMContentLoaded", async () => {
    const BLOG_JSON_PATH = "/blog/posts.json";
    const MAX_RELATED_POSTS = 2; // Set the number of related posts to display

    const articleContainer = document.getElementById("article-container");
    const titleEl = document.getElementById("blog-title");
    const contentEl = document.getElementById("blog-content");
    const imageEl = document.getElementById("blog-image");
    const relatedContainer = document.getElementById("related-posts-container"); // New Element

    // Function to replace ==text== with red spans
    const parseRedText = text => text.replace(/==(.+?)==/g, (_, p1) => `<span class="text-klyr-red">${p1}</span>`);
    
    // Function to format the date string (e.g., 'YYYY-MM-DD' to 'MONTH YEAR')
    const formatDate = dateString => {
        if (!dateString) return '';
        const date = new Date(dateString.replace(/-/g, '/')); // Handle Safari date parsing
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
    };

    // Function to generate the HTML for a single related post card
    const createRelatedPostCard = (post) => {
        const postLink = `/press/${post.id}/`;
 // Assuming the blog template generates files like /blog/post-id.html
        const formattedDate = formatDate(post.date);

        return `
            <div class="flex flex-col bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                <a href="${postLink}" class="block mb-4 group">
                    <div class="aspect-[16/9] w-full bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300 group-hover:opacity-90 transition-opacity">
                        ${post.image 
                            ? `<img src="${post.image}" alt="${post.title.replace(/==/g, "")}" class="w-full h-full object-cover rounded-lg border border-gray-300">`
                            : `<span class="text-gray-500 font-medium">Related Image (16:9)</span>`
                        }
                    </div>
                </a>
                <p class="text-sm text-klyr-red font-semibold uppercase mb-2">${formattedDate}</p>
                <h3 class="text-xl font-bold text-klyr-dark mb-3">
                    <a href="${postLink}" class="hover:text-klyr-red transition-colors">
                        ${parseRedText(post.title)}
                    </a>
                </h3>
                <p class="text-gray-600 text-base mb-4 description-alignment-fix">
                    ${parseRedText(post.excerpt || "")}
                </p>
                <div class="mt-auto">
                    <a href="${postLink}" class="font-bold text-klyr-red hover:underline">Read More &raquo;</a>
                </div>
            </div>
        `;
    };

    try {
        // --- 1. Fetch posts and identify current post ---
        const res = await fetch(BLOG_JSON_PATH);
        if (!res.ok) throw new Error(`Failed to fetch ${BLOG_JSON_PATH}: ${res.status}`);
        const posts = await res.json();

        // Get post ID from URL path (e.g., /ai-driven-clarity)
        let pathId = window.location.pathname.split("/").filter(Boolean).pop().replace(".html", ""); // Clean the ID
        
        let post = posts.find(p => p.id === pathId) || posts[0];
        if (!post) throw new Error("No blog post found");
        
        // --- 2. Load and Inject Main Post Content ---
        const contentFilePath = post.contentFile || post.file;
        let contentMd = "";
        if (contentFilePath) {
            const mdRes = await fetch(contentFilePath);
            if (mdRes.ok) contentMd = await mdRes.text();
        }

        titleEl.innerHTML = parseRedText(post.title);
        contentEl.innerHTML = marked.parse(parseRedText(contentMd || post.excerpt || ""));

        if (post.image) {
            imageEl.innerHTML = `<img src="${post.image}" alt="${post.title.replace(/==/g, "")}" class="w-full h-full object-cover rounded-lg border border-gray-300">`;
        }

        document.title = `${post.title.replace(/==/g, "")} - Press Center`;
        articleContainer.style.opacity = 1;

        // --- 3. Generate and Inject Related Posts ---
        
        // Filter out the current post
        const otherPosts = posts.filter(p => p.id !== post.id);

        // Sort by date (newest first, assuming a 'date' property in your JSON)
        otherPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Select the top N related posts
        const relatedPosts = otherPosts.slice(0, MAX_RELATED_POSTS);

        if (relatedPosts.length > 0 && relatedContainer) {
            const relatedHtml = relatedPosts.map(createRelatedPostCard).join('');
            relatedContainer.innerHTML = relatedHtml;
        } else if (relatedContainer) {
            // Hide the related news section if no related posts are found
            relatedContainer.parentElement.style.display = 'none';
        }

    } catch (error) {
        console.error("Error loading blog:", error);
        if (contentEl) contentEl.innerHTML = "<p class='text-red-500'>Failed to load blog content.</p>";
        articleContainer.style.opacity = 1;
        if (relatedContainer) relatedContainer.parentElement.style.display = 'none';
    }
});