// 🚀 1️⃣ Get the Access Token from the URL 
function getAccessToken() {
    const params = new URLSearchParams(window.location.hash.substring(1));
    return params.get("access_token");
}

const accessToken = getAccessToken();
if (accessToken) {
    console.log("✅ Spotify Access Token:", accessToken);
    localStorage.setItem("spotifyAccessToken", accessToken); // Save token for later use
} else {
    console.log("❌ No access token found.");
}

// 🚀 2️⃣ Handling Page Navigation
document.getElementById("continue").addEventListener("click", () => {
    const currentPage = document.body.classList[0]; 
    console.log("➡ Navigating from:", currentPage);

    if (currentPage === 'welcome-page') {
        window.location.href = 'intro.html';
    } else if (currentPage === 'intro-page') {
        window.location.href = 'mood.html';
    } else if (currentPage === 'mood-page') {
        window.location.href = 'artist.html';
    } else {
        console.error("⚠ Page class not recognized. Make sure the body tag has the correct class.");
    }
});

// 🚀 3️⃣ Get User's Spotify ID
async function getUserId() {
    const token = localStorage.getItem("spotifyAccessToken");
    if (!token) {
        console.error("❌ No Spotify access token available.");
        return;
    }

    const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    return data.id; // Returns Spotify User ID
}

// 🚀 4️⃣ Get Recommended Tracks Based on Mood & Artists
async function getRecommendedTracks(artists, mood) {
    const token = localStorage.getItem("spotifyAccessToken");

    const moodAttributes = {
        happy: { valence: 0.8, energy: 0.8 },
        sad: { valence: 0.2, energy: 0.3 },
        energetic: { valence: 0.7, energy: 1.0 },
        calm: { valence: 0.4, energy: 0.4 },
        romantic: { valence: 0.9, energy: 0.5 },
    };

    const attributes = moodAttributes[mood] || { valence: 0.5, energy: 0.5 };

    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_artists=${artists.join(",")}&limit=10&target_valence=${attributes.valence}&target_energy=${attributes.energy}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    return data.tracks.map(track => track.uri); // Returns an array of track URIs
}

// 🚀 5️⃣ Create a Playlist on the User's Spotify Account
async function createPlaylist(userId, mood) {
    const token = localStorage.getItem("spotifyAccessToken");

    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {  
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: `SoulSync - ${mood} Vibes`,
            description: `A personalized playlist based on your mood (${mood}) and favorite artists.`,
            public: false
        })
    });

    const data = await response.json();
    return data.id; // Returns the playlist ID
}

// 🚀 6️⃣ Add Songs to the Playlist
async function addTracksToPlaylist(playlistId, tracks) {
    const token = localStorage.getItem("spotifyAccessToken");

    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {  
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ uris: tracks })
    });

    console.log("🎵 Tracks added to playlist!");
}

// 🚀 7️⃣ Handle Playlist Generation When Button is Clicked
document.getElementById("generate-playlist").addEventListener("click", async () => {
    const userId = await getUserId();
    
    if (!userId) {
        alert("❌ Failed to fetch user data. Please log in again.");
        return;
    }

    // 🎵 Get user-selected mood & artists from input fields
    const selectedMood = selectedMoods.length > 0 ? selectedMoods[0] : "happy"; 

    const artist1 = document.getElementById("artist1").value;
    const artist2 = document.getElementById("artist2").value;
    const artist3 = document.getElementById("artist3").value;
    const artist4 = document.getElementById("artist4").value;
    const artist5 = document.getElementById("artist5").value;
    const selectedArtists = [artist1, artist2, artist3, artist4, artist5].filter(Boolean);

    if (selectedArtists.length === 0) {
        alert("❌ Please enter at least one artist!");
        return;
    }

    const playlistId = await createPlaylist(userId, selectedMood);
    const recommendedTracks = await getRecommendedTracks(selectedArtists, selectedMood);
    
    await addTracksToPlaylist(playlistId, recommendedTracks);

    alert("🎵 Your personalized playlist has been created on Spotify!");
});
