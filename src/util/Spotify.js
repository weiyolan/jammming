let token;
// let expiresIn = 0;

var client_id = 'decf12aa7ad441a68919305fe073fd57';
var redirect_uri = 'http://localhost:3000/';

var search_url= 'https://api.spotify.com/v1/search?type=track';

const Spotify = {
    getAccessToken() {
        if (token) {
            return token
        }
        
        const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);   


        if (tokenMatch && expiresInMatch) {
            token = tokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => token = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            console.log('token='+token);
            console.log('expires in ' + expiresIn);
            return token
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`
            // token = this.getAccessToken();
            // return this.getAccessToken();
        }
    },

    search(term) {
        const newToken = Spotify.getAccessToken();
        const header = { headers: {Authorization:`Bearer ${newToken}`} };
            // const tracks = tracklistjson.tracks;
        return fetch(search_url+`&q=${term}`, header)
            .then(response=>{
                return response.json();
            }).then(jsonResponse=>{
                if (!jsonResponse.tracks) {
                    return [];
                }
                return jsonResponse.tracks.items.map(track => ({
                    id :track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));
            })
            .catch(e=>console.log(e));
    },

    savePlaylist(name,tracks) {
        if (!name || !tracks.length) {
            console.log(tracks.length);
            console.log("NAme = " + name);
            console.log('NOTHING TO SAVE')
            return
        }
        
        const access_token = Spotify.getAccessToken();
        const headers = {Authorization:`Bearer ${access_token}`}; 
        let userId = '';

        console.log("tracks to post: " + tracks)

        return fetch('https://api.spotify.com/v1/me',{headers:headers}
        ).then(response=>response.json()
        ).then(jsonResponse => {
            
            userId = jsonResponse.id;
            console.log('Fetched UserID = ' + userId)
            
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
                headers: headers, 
                method: 'POST',
                body: JSON.stringify({name:name})
                }
                ).then(response=>response.json()
                ).then(jsonResponse=>{
                    const playlistId = jsonResponse.id;
                    console.log("Posted new Playlist with ID = " + playlistId)
                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                    {
                        headers: headers,
                        method:'POST',
                        body:JSON.stringify({uris:tracks})
                    });}
                );
        });
    }   
    


};

export default Spotify;