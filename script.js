 // Initialize blogs array in localStorage if it doesn't exist
 if (!localStorage.getItem('generatedBlogs')) {
    localStorage.setItem('generatedBlogs', JSON.stringify([]));
}

function showUserPage() { 
    const generatorPage = document.getElementById('generator-page');
    const userPage = document.getElementById('user-page');

    generatorPage.classList.add('page-exit');
    setTimeout(() => {
        generatorPage.style.display = 'none';
        generatorPage.classList.remove('page-exit');
        userPage.style.display = 'block';
        userPage.classList.add('page-enter');
        setTimeout(() => {
            userPage.classList.remove('page-enter');
        }, 50);
    }, 300);

    displayBlogHistory();
}

function showGeneratorPage() {
    const generatorPage = document.getElementById('generator-page');
    const userPage = document.getElementById('user-page');

    userPage.classList.add('page-exit');
    setTimeout(() => {
        userPage.style.display = 'none';
        userPage.classList.remove('page-exit');
        generatorPage.style.display = 'block';
        generatorPage.classList.add('page-enter');
        setTimeout(() => {
            generatorPage.classList.remove('page-enter');
            generatorPage.classList.remove('page-exit');
        }, 50);
    }, 300);
}

function displayBlogHistory() {
    const blogHistory = document.getElementById('blog-history');
    const blogs = JSON.parse(localStorage.getItem('generatedBlogs'));

    if (blogs.length === 0) {
        blogHistory.innerHTML = '<p>No blogs generated yet.</p>';
        return;
    }

    blogHistory.innerHTML = blogs.map((blog, index) => `
        <div class="blog-entry" style="animation-delay: ${index * 0.1}s">
            <div class="blog-meta">
                <strong>Topic:</strong> ${blog.topic}<br>
                <strong>Tone:</strong> ${blog.tone}<br>
                <strong>Word Count:</strong> ${blog.wordCount}<br>
                <strong>Date:</strong> ${new Date(blog.date).toLocaleString()}
            </div>
            <div class="blog-content">
                ${blog.content}
            </div>
        </div>
    `).join('');
}

async function generateBlogPost() {
    const topic = document.getElementById("topicInput").value;
    const tone = document.getElementById("languageTone").value;
    const wordCount = document.getElementById("wordCount").value;
    const generatedPostElement = document.getElementById("generatedPost");
    const loadingElement = document.getElementById("loading");
    const copyButton = document.getElementById("copyButton");
    const copiedText = document.getElementById("copiedText");

    if (!topic) {
        alert("Please enter a blog post topic");
        return;
    }

    loadingElement.style.display = "block";
    generatedPostElement.innerHTML = "";

    try {
        const response = await fetch(
            "https://models.inference.ai.azure.com/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer API_KEY",
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: `Write a ${tone} blog post about "${topic}" in approximately ${wordCount} words.`,
                        },
                    ],
                    max_tokens: parseInt(wordCount) + 50,
                }),
            }
        );

        const data = await response.json();
        loadingElement.style.display = "none";

        if (data.choices && data.choices[0].message) {
            const content = data.choices[0].message.content;
            generatedPostElement.innerHTML = content;

            // Save the generated blog
            const blogs = JSON.parse(localStorage.getItem('generatedBlogs'));
            blogs.push({
                topic,
                tone,
                wordCount,
                content,
                date: new Date().toISOString()
            });
            localStorage.setItem('generatedBlogs', JSON.stringify(blogs));
        } else {
            generatedPostElement.innerHTML =
                "Error generating blog post. Please try again.";
        }
    } catch (error) {
        loadingElement.style.display = "none";
        generatedPostElement.innerHTML = `Error: ${error.message}. 
        Note: This is a mock implementation. 
        Replace with actual OpenAI API integration.`;
        console.error("Blog Post Generation Error:", error);
    }
}

copyButton.addEventListener("click", () => {
    const originalContent = copyButton.innerHTML;
    const linkToCopy = "https://lavannyaaa.github.io/Blogify/";

    navigator.clipboard.writeText(linkToCopy).then(() => {
    copyButton.innerHTML = '<i class="fa-solid fa-check"></i>';

setTimeout(() => {
    copyButton.innerHTML = originalContent;
}, 2000);
}).catch(err => {
console.error("Failed to copy text: ", err);
});
});

function shareOnFacebook() {
    window.open('https://www.facebook.com/sharer/sharer.php?u=https://lavannyaaa.github.io/Blogify/',
        '_blank');
}

function shareOnWhatsApp() {
    window.open('https://api.whatsapp.com/send?text=Check%20this%20out!%20https://lavannyaaa.github.io/Blogify/',
        '_blank');
}
