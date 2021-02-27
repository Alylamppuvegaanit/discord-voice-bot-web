import { React, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DataGrid } from '@material-ui/data-grid';


const playlistColumns = [
  { field: 'name', headerName: 'Playlist name', width: 200 },
  { field: 'song_count', headerName: 'Songs', width: 100 },
];

const songColumns = [
  { field: 'title', headerName: 'Song title', width: 400 }
];

function PlayListTable() {
  const [open, setOpen] = useState(false);
  const [songRows, setSongRows] = useState([]);
  const [playlistRows, setPlaylistRows] = useState([]);

  let playlists = [
    { id: 1, name: "Anime", songs: [
      "youtube.com/fiids",
      "youtube.com/fiidsdd"
    ]},
    { id: 2, name: "Jeejee", songs: [
      "youtube.com/8f278j9",
      "youtube.com/01mv12m",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
    ]},
    { id: 3, name: "Sss", songs: [
      "youtube.com/gjiqq38",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
      "youtube.com/1t9i509",
    ]},
  ];



  useEffect(() => {
    const tmp = playlists.map(playlist => {
      return { id: playlist.id, name: playlist.name, song_count: playlist.songs.length };
    })
    setPlaylistRows( tmp );
  }, [])


  const createWindow = () => {
    setOpen(true);
  };

  const closeWindow = () => {
    setOpen(false);
  };

  const newPlaylist = () => {
    console.log(playlistRows);

    // Create new playlist
    const tmp = playlistRows.concat({ id: 4, name: "Papopa", songs: [
      "youtube.com/frewgw",
    ]});

    console.log(tmp);
    setPlaylistRows(tmp);
    setOpen(false);
  };

  const selectPlaylist = (e) => {  
    let tmp = [];
    let i = 0;
    playlists.forEach(playlist => {
      if (playlist.name === e.row.name) {
        playlist.songs.forEach(song => {
          tmp.push({ id: i, title: song });
          i++;
        })
        setSongRows(tmp);
      }
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={closeWindow}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Create a new playlist"}</DialogTitle>
        <DialogContent>
          <form>
            <TextField label="Title" />
          </form>
        </DialogContent>
        <DialogActions>
        <Button onClick={closeWindow} color="primary">
          Cancel
        </Button>
        <Button onClick={newPlaylist} color="primary" autoFocus>
          Create
        </Button>
        </DialogActions>
      </Dialog>
      <Container>
        <br/>
        <Grid container spacing={1}>
          <Grid item xs>
            <Box>
              <Paper>
                <DataGrid autoHeight={true} onRowClick={selectPlaylist} rows={playlistRows} columns={playlistColumns} pageSize={20} />
                <Button variant="contained" color="primary" onClick={createWindow} style={{ width: "auto", margin: "30px 30px" }}>
                  Create 
                </Button>
                <Button variant="contained" onClick={createWindow} style={{ width: "auto", margin: "30px 0px" }}>
                  Delete 
                </Button>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs>
            <Box>
              <Paper>
                <DataGrid autoHeight={true} rows={songRows} columns={songColumns} pageSize={20} />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default PlayListTable;
