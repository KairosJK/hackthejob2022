import axios from 'axios';
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
    setArtists(data.artists.items)
  }

  const processArtists = () => {
    return artists.map(artist => (
      <div key={artist.id}>
        <br></br>
        {artist.images.length ? <img src={artist.images[0].url}/> : <div>No Image could be found</div>}
        <p style="border-style=dobule 5px">{artist.name}</p>
      </div>
    ))
  }


  return (
    <div className="App">
      <header className="App-header">

        <h1>🎶 SpotiView 🎶</h1>
        <p>By Jonathan, Lester, and Thomas</p>

        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
            Login to Spotify
            </a>

          : <button onClick={releaseToken}>Logout of Spotify</button>
        }

        {token ?
          // Display artist form
          <form onSubmit={searchArtists}>
            <input type="text" onChange={e => setSearchKey(e.target.value)}/>
            <button type={"submit"}>Search</button>
          </form>

          : <p>Please Login to Spotify to Continue...</p>
        }

        {processArtists()}

      </header>
    </div>
  );
}

export default App;
