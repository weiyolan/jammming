import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import React from 'react';

class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      searchResults:[],
      playlistName:"My Playlist",
      playlistTracks:[]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find((t)=>t.id === track.id)) { 
    return;} else {
      this.setState(prevState => ({playlistTracks:[...prevState.playlistTracks,track]}));
    };
  }

  removeTrack(track) {
    const newTracks = this.state.playlistTracks.filter(t=>t.id!==track.id);
    this.setState({playlistTracks : newTracks});
  }

  updatePlaylistName (name) {
    this.setState({playlistName:name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track=>track.uri);
    console.log("TRACK URIs: " + trackURIs)
    Spotify.savePlaylist(this.state.playlistName,trackURIs)
      .then(()=>{
        this.setState({
          playlistName:'New Playlist',
          playlistTracks:[]
        })
    });
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    });
    // console.log("Search results from API:");
    // console.log(this.state.SearchResults);
  }

  render () {
    return (<div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={this.search}/>
        <div className="App-playlist">
          <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults}/>
          <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} />
        </div>
      </div>
    </div>
    )
}

}

export default App;
