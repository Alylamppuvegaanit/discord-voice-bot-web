import { React, useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

var config = require('./config.json')

const playlistColumns = [
  { field: 'id', headerName: 'Playlist name', flex: 0.5 },
];


const songColumns = [
  { field: 'title', headerName: 'Song title', flex: 1 }
];


function PlayListTable() {
  const [ activePlaylist, setActivePlaylist ] = useState('');
  const [ activeSong, setActiveSong ] = useState('');
  const [ newPlaylistDialogOpen, setNewPlaylistDialogOpen ] = useState(false);
  const [ newSongDialogOpen, setNewSongDialogOpen ] = useState(false);
  const [ authDialogOpen, setAuthDialogOpen ] = useState(false);
  const [ songRows, setSongRows ] = useState([]);
  const [ playlistRows, setPlaylistRows ] = useState([]);
  const [ newPlaylistTitle, setNewPlaylistTitle ] = useState('');
  const [ newSongURL, setNewSongURL ] = useState('');
  const [ authKey, setAuthKey ] = useState('');


  // Fetch playlists from backend entrypoint
  const fetchPlaylists = async () => {
    const res = await fetch(config.urls.fetch);
    const json = await res.json();
    return json;
  }


  // API: Update song list of a playlist
  const apiUpdatePlaylist = async (updatedPlaylistData) => {
    let playlistPayload = {
      key: authKey,
      playlistID: activePlaylist,
      playlistSongs: updatedPlaylistData
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playlistPayload)
    };

    await fetch(config.urls.api_update, requestOptions);
  }


  // API: Add a new playlist
  const apiAddPlaylist = async (newPlaylist) => {
    let playlistPayload = {
      key: authKey,
      playlistID: newPlaylist,
      playlistSongs: songRows
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playlistPayload)
    };

    await fetch(config.urls.api_add, requestOptions);
  }


  // API: Delete a playlist
  const apiDeletePlaylist = async (targetPlaylist) => {
    let playlistPayload = {
      key: authKey,
      playlistID: targetPlaylist
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playlistPayload)
    };

    await fetch(config.urls.api_delete, requestOptions);
  }


  // Initiate effect for parsing playlist data from backend
  useEffect(() => {
    const browserAuthKey = window.localStorage.getItem("discord-voice-bot-key");
    console.log(browserAuthKey);

    browserAuthKey ?? openAuthDialog();
    setAuthKey(browserAuthKey);

    fetchPlaylists().then(playlists => {
      setPlaylistRows(playlists)
    });
  }, [])


  const openNewPlaylistDialog = () => {
    setNewPlaylistDialogOpen(true);
  };


  const closeNewPlaylistDialog = () => {
    setNewPlaylistDialogOpen(false);
  };


  const openNewSongDialog = () => {
    setNewSongDialogOpen(true);
  };


  const closeNewSongDialog = () => {
    setNewSongDialogOpen(false);
  };


  const openAuthDialog = () => {
    setAuthDialogOpen(true);
  };


  const closeAuthDialog = () => {
    setAuthDialogOpen(false);
  };


  const deletePlaylist = () => {
    // Filter out playlist element with given id
    const tmp = playlistRows.filter(playlist => { return playlist.id !== activePlaylist });
    setSongRows([]);
    setPlaylistRows(tmp);
    apiDeletePlaylist(activePlaylist);
  }


  const deleteSong = () => {
    // Filter out song element with given url
    const tmp = songRows.filter(song => { return song.title !== activeSong });
    setSongRows(tmp);
    apiUpdatePlaylist(tmp);
  }


  const newPlaylist = () => {
    let newPlaylistName = newPlaylistTitle;

    if (newPlaylistName.length > 2) {
      // Check if a playlist already exists with given name
      if (!playlistRows.some(playlist => playlist.id === newPlaylistName)) {
        const tmp = playlistRows.concat({ id: newPlaylistName, songs: []});
        setPlaylistRows(tmp);
        apiAddPlaylist(newPlaylistName);
      }
    }

    setNewPlaylistDialogOpen(false);
  };


  const newSong = () => {
    let newSongName = newSongURL;

    // Do basic validation and check whether a playlist is selected
    if (newSongName.length > 5 && activePlaylist.length > 2) {
      const tmp = songRows.concat({ title: newSongName, id: songRows.length + 1 });
      setSongRows(tmp);
      apiUpdatePlaylist(tmp);
    }

    setNewSongDialogOpen(false);
  };


  const selectPlaylist = (e) => {
    // Get the latest data from API
    fetchPlaylists().then(playlists => {
      setPlaylistRows(playlists)
    })

    // Read the songs of a playlist and append them to the song list grid
    let songs = playlistRows.find(playlist => playlist.id === e.row.id)?.songs;
    setActivePlaylist(e.row.id);
    setSongRows(songs);
  };


  const selectSong = (e) => {  
    setActiveSong(e.row.title);
  };


  const authUser = () => {
    window.localStorage.setItem("discord-voice-bot-key", authKey);
    closeAuthDialog();
  }


  const deauthUser = () => {
    window.localStorage.removeItem("discord-voice-bot-key");
    window.location.reload();
  }


  return (
    <>
      <Button color="secondary" variant="contained" onClick={deauthUser} style={{ position: "absolute", left: "10px", bottom: "10px" }}>
        Logout
      </Button>


      <Dialog
        open={authDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Give password"}</DialogTitle>
        <DialogContent>
          <TextField
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                closeAuthDialog();
              }
            }}
            autoFocus
            label="Password"
            onInput={e => setAuthKey(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={authUser} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={newPlaylistDialogOpen}
        onClose={closeNewPlaylistDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Create a new playlist"}</DialogTitle>
        <DialogContent>
          <TextField
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                newPlaylist();
              }
            }}
            autoFocus
            label="Title"
            value={newPlaylistTitle}
            onInput={e => setNewPlaylistTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewPlaylistDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={newPlaylist} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={newSongDialogOpen}
        onClose={closeNewSongDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Add a new song to playlist"}</DialogTitle>
        <DialogContent>
          <TextField
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                newSong();
              }
            }}
            autoFocus
            label="YouTube URL"
            onInput={e => setNewSongURL(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewSongDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={newSong} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>


      <Container>
        <Grid container spacing={1} style={{ margin: "60px 0px" }} >
          <Grid item xs={4}>
            <Box>
              <DataGrid autoHeight={true} minHeight={500} onRowClick={selectPlaylist} rows={playlistRows} columns={playlistColumns} pageSize={20} />
              <Button variant="contained" color="primary" onClick={openNewPlaylistDialog} style={{ width: "auto", margin: "20px 20px" }}>
                New playlist 
              </Button>
              <Button variant="contained" onClick={deletePlaylist} style={{ width: "auto", margin: "20px 0px" }}>
                Delete playlist
              </Button>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box>
              <DataGrid autoHeight={true} onRowClick={selectSong} rows={songRows} columns={songColumns} pageSize={20} />
              <Button variant="contained" color="primary" onClick={openNewSongDialog} style={{ width: "auto", margin: "20px 20px" }}>
                Add song
              </Button>
              <Button variant="contained" onClick={deleteSong} style={{ width: "auto", margin: "20px 0px" }}>
                Delete song
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}


export default PlayListTable;
