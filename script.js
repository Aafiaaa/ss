// 🚀 1️⃣ Get the Access Token from the URL (after Spotify login)
function getAccessToken() {
    const params = new URLSearchParams(window.location.hash.substring(1));
    return params.get("access_token");
}

// Save the access token in localStorage
const accessToken = getAccessToken();
if (accessToken) {
    console.log("✅ Spotify Access Token:", accessToken);
    localStorage.setItem("spotifyAccessToken", accessToken); // Save token for later use
} else {
    console.log("❌ No access token found.");
}

// 🚀 2️⃣ Handling Page Navigation (Continue Button)
document.getElementById("continue")?.addEventListener("click", () => {
    window.location.href = 'mood.html';  // Navigate to mood page
});

// 🚀 3️⃣ Handle Mood Button Clicks on Mood Page
document.querySelectorAll('.mood-btn').forEach(button => {
    button.addEventListener("click", (event) => {
        const selectedMood = event.target.id;
        console.log("Selected Mood:", selectedMood);
        // Store selected mood for playlist generation (you can store it in localStorage if needed)
    });
});

// 🚀 4️⃣ Generate Playlist (Handling the Generate Playlist Button)
document.getElementById("generate-playlist")?.addEventListener("click", async () => {
    const token = localStorage.getItem("spotifyAccessToken");

    if (!token) {
        alert("❌ No access token available.");
        return;
    }

    // Get selected mood from the stored value
    const selectedMood = localStorage.getItem("selectedMood") || "happy"; // Default to "happy"
    console.log("Selected Mood for Playlist:", selectedMood);

    // Example of creating a playlist (you can expand this with real functionality)
    alert("🎵 Playlist for mood '" + selectedMood + "' generated!");
});
