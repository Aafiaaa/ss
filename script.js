// 🚀 4️⃣ Get User's Spotify ID (Fixed Syntax)
async function getUserId() {
    const token = localStorage.getItem("spotifyAccessToken");
    if (!token) {
        console.error("❌ No Spotify access token available.");
        return;
    }

    const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }  // Fixed this line
    });

    const data = await response.json();
    return data.id; // Returns Spotify User ID
}

// 🚀 5️⃣ Get Recommended Tracks Based on Mood & Artists (Fixed Template Strings)
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
        headers: { "Authorization": `Bearer ${token}` }  // Fixed this line
    });

    const data = await response.json();
    return data.tracks.map(track => track.uri); // Returns an array of track URIs
}

// 🚀 6️⃣ Create a Playlist on the User's Spotify Account (Fixed)
async function createPlaylist(userId, mood) {
    const token = localStorage.getItem("spotifyAccessToken");

    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {  // Fixed this line
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: `SoulSync - ${mood} Vibes`,  // Fixed this line
            description: `A personalized playlist based on your mood (${mood}) and favorite artists.`,
            public: false
        })
    });

    const data = await response.json();
    return data.id; // Returns the playlist ID
}

// 🚀 7️⃣ Add Songs to the Playlist (Fixed)
async function addTracksToPlaylist(playlistId, tracks) {
    const token = localStorage.getItem("spotifyAccessToken");

    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {  // Fixed this line
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ uris: tracks })
    });

    console.log("🎵 Tracks added to playlist!");
}
