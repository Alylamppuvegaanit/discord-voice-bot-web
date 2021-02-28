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
  const [ songRows, setSongRows ] = useState([]);
  const [ playlistRows, setPlaylistRows ] = useState([]);
  const [ newPlaylistTitle, setNewPlaylistTitle ] = useState('');
  const [ newSongURL, setNewSongURL ] = useState('');


  // Fetch playlists from backend entrypoint
  const fetchPlaylists = async () => {
    const res = await fetch('http://localhost:20202/fetch_data')
    const json = await res.json()
    return json
  }
  useEffect(() => {
    fetchPlaylists().then(playlists => {
      setPlaylistRows(playlists)
    })
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


  const deletePlaylist = () => {
    // Filter out playlist element with given id
    const tmp = playlistRows.filter(playlist => { return playlist.id !== activePlaylist });
    setPlaylistRows(tmp);
    setSongRows([]);
  }


  const deleteSong = () => {
    // Filter out song element with given url
    const tmp = songRows.filter(song => { return song.title !== activeSong });
    setSongRows(tmp);
  }


  const newPlaylist = (e) => {
    e.preventDefault();
    let newPlaylistName = newPlaylistTitle;

    if (newPlaylistName.length > 2) {
      // Check if a playlist already exists with given name
      if (!playlistRows.some(playlist => playlist.id === newPlaylistName)) {
        const tmp = playlistRows.concat({ id: newPlaylistName, songs: []});
        setPlaylistRows(tmp);
      }
    }

    setNewPlaylistDialogOpen(false);
  };


  const newSong = (e) => {
    e.preventDefault();
    let newSongName = newSongURL;

    // Do basic validation and check whether a playlist is selected
    if (newSongName.length > 5 && activePlaylist.length > 2) {
      const tmp = songRows.concat({ title: newSongName, id: songRows + 1 });
      setSongRows(tmp);
    }

    setNewSongDialogOpen(false);
  };


  const selectPlaylist = (e) => {  
    let selectedPlaylistSongs = [];
    let songID = 0;

    // Read the songs of a playlist and append them to the song list grid
    playlistRows.find(playlist => playlist.id === e.row.id)?.songs.forEach(song => {
      selectedPlaylistSongs.push({ id: songID++, title: song });
    });

    setActivePlaylist(e.row.id);
    setSongRows(selectedPlaylistSongs);
  };


  const selectSong = (e) => {  
    setActiveSong(e.row.title);
  };


  return (
    <>
      <Dialog
        open={newPlaylistDialogOpen}
        onClose={closeNewPlaylistDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Create a new playlist"}</DialogTitle>
        <DialogContent>
          <TextField label="Title" value={newPlaylistTitle} onInput={e => setNewPlaylistTitle(e.target.value)} />
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
          <TextField label="YouTube URL" onInput={e => setNewSongURL(e.target.value)} />
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
              <Button variant="contained" style={{ width: "auto", margin: "20px 20px" }}>
                Save changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}


export default PlayListTable;
