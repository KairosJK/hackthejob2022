import axios from 'axios';
import { div } from 'prelude-ls';
import { useEffect, useState} from 'react';
import './App.css';



function App() {

  // All parts of custom URL piecemeal for easy reading
  const CLIENT_ID = "a3e3bd7621534326b6974b50299a1f1b" // App ID on Spotify developer portal
  const RESPONSE_TYPE = "token" // Request the token back from Spotify
  const REDIRECT_URI = "http://localhost:3000/hackthejob2022"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize" // Website to authorize login and account
  
  const [token, setToken] = useState("") // Users token
  const [searchKey, setSearchKey] = useState("") // Artist Searchkey for user
  const [artists, setArtists] = useState([]) // Empty array, will be used to store artist data
  const [songSearchKey, setSongSearchKey] = useState("")// Song Searchkey for user
  const [songs, setSongs]  = useState([]) // Empty array, will be used to store song data


  useEffect( () => {
    const hash = window.location.hash // Grabs Hash from pages URL
    let token = window.localStorage.getItem("token") // Sets token to token stored in local Storage if possible
    
    //This next section is for seperating the token in the url from the rest of the url
    if(!token && hash){
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1] // Splits user token from url
      window.location.hash = "" // Sets hash back to empty string
      window.localStorage.setItem("token", token) // Places our new token in localstorage in case of reloads of page
    }

    setToken(token)

  }, [])

  const releaseToken = () => {
    setToken("") // Sets token to blank string
    window.localStorage.removeItem("token") // Deletes token from local storage
  }

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} =  await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type:"artist"
      }
    })
    console.log(data);
    setArtists(data.artists.items)
  }

  const processArtists = () => {
    if (artists.length > 0) {
      const artist = artists[0]
      return (
        <div key={artist.id}>
          <br></br>
          {artist.images.length ? <img src={artist.images[0].url}/> : <div>No Image could be found</div>}
          <p style={{fontWeight:"bold"}}>{artist.name}</p>
          <p style={{fontWeight:"bold"}}>{artist.genres[0]}</p>
          <p style={{fontWeight:"bold"}}>Spotify Followers: {artist.followers.total}</p>
        </div>
      )
    }
  }



  // Miliseconds To Minutes Conversion
  const msToMins = (ms) => {
    var minutesDec = ms / 60000
    var minutes = minutesDec - minutesDec % 1
    var seconds = Math.ceil((minutesDec - minutes) * 60)

    return `${minutes}:${seconds}`
  }

  // Search Song On Spotify API
  const searchSongs = async (song) => {
    song.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: songSearchKey,
        type:"track"
      }
    })
    console.log(data)
    setSongs(data.tracks.items)
  }

  // Process Songs from API Request
  const processSongs = () => {
    if (songs.length > 0) {
      const track = songs[0]
      return (
        <div key={track.id}>
          <br></br>
          {track.album.images.length ? <img src={track.album.images[0].url}/> : <div>No Image could be found</div>}
          <p style={{fontWeight:"bold"}}>{track.name}</p>
          <p style={{fontWeight:"bold"}}>{track.album.name}</p>
          <p style={{fontWeight:"bold"}}>Track Number {track.track_number}</p>
          <p style={{fontWeight:"bold"}}>Track Duration {msToMins(track.duration_ms)}</p>
          {/* <p style={{fontWeight:"bold"}}>Spotify Followers: {artist.followers.total}</p> */}
        </div>
      )
    }
  }

  const goToAuth = () => {
    // Redirects user to Authentication and Login
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`
  }


  return (
    <div className="App">
      <header className="App-header">

        <h1>🎶 SpotiView 🎶</h1>
        
        {!token ?
          <button style={{backgroundColor:"#2C5F2D",
                          border:"none",
                          color:"#97BC62FF",
                          borderStyle:"outset",
                          padding:"1vh",
                          borderWidth:"0.8vh",
                          fontSize: "calc(10px + 2vmin)"
                        }} onClick={goToAuth}>Login to Spotify</button>
          : <button style={{backgroundColor:"#2C5F2D",
                            border:"none",
                            color:"#97BC62FF",
                            borderStyle:"outset",
                            padding:"1vh",
                            borderWidth:"0.8vh",
                            fontSize: "calc(10px + 2vmin)"
                        }}onClick={releaseToken}>Logout of Spotify</button>
        }


        {token ?
          // Display artist form
          <div style={{backgroundColor:"#2C5F2D",border:"none",color:"#97BC62FF",borderStyle:"outset",padding:"1vh",borderWidth:"0.8vh",fontSize: "calc(10px + 2vmin)"}}>
            <p>Search for Artists</p>
            <form onSubmit={searchArtists}>
            <input type="text" onChange={e => setSearchKey(e.target.value)}/>
            <button type={"submit"}>Search</button>
          </form>
          </div>

          : <p>Please Login to Spotify to Continue...</p>
        }

        {processArtists()}


        {token ?
          // Display artist form
          <div style={{backgroundColor:"#2C5F2D",border:"none",color:"#97BC62FF",borderStyle:"outset",padding:"1vh",borderWidth:"0.8vh",fontSize: "calc(10px + 2vmin)"}}>
            <p>Search for Songs</p>
            <form onSubmit={searchSongs}>
            <input type="text" onChange={songPrompt => setSongSearchKey(songPrompt.target.value)}/>
            <button type={"submit"}>Search</button>
          </form>
          </div>

          : <></> // No Else
        }

        {processSongs()}

        <p>Webapp written by Jonathan, Lester, and Thomas</p>
      </header>
    </div>
  );
}

export default App;
