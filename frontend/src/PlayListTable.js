import { React, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DataGrid } from '@material-ui/data-grid';

let playlistRows = [];
let playlists = [
  { id: 1, name: "Anime", songs: [
    "youtube.com/fiids",
    "youtube.com/fiidsdd"
  ]},
  { id: 2, name: "Jeejee", songs: [
    "youtube.com/8f278j9",
    "youtube.com/01mv12m"
  ]},
  { id: 3, name: "Sss", songs: [
    "youtube.com/gjiqq38",
    "youtube.com/1t9i509"
  ]},
];

const playlistColumns = [
  { field: 'name', headerName: 'Playlist name', width: 200 },
  { field: 'song_count', headerName: 'Songs', width: 100 },
];

const songColumns = [
  { field: 'title', headerName: 'Song title', width: 400 }
];

playlists.forEach(playlist => {
  playlistRows.push({ id: playlist.id, name: playlist.name, song_count: playlist.songs.length });
});


function PlayListTable() {
  const [open, setOpen] = useState(false);
  const [songRows, setSongRows] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const newPlaylist = () => {
    // Create new playlist
    setOpen(false);
  };

  const selectPlaylist = (e) => {  
    let tmp = []
    let i = 0
    playlists.forEach(playlist => {
      if (playlist.name == e.row.name) {
        playlist.songs.forEach(song => {
          tmp.push({id: i, title: song})
          i++;
        })
        setSongRows(tmp);
      }
    });
  };

  return (
    <>
      <div style={{ width: '340px', height: '100%', background: '#f4f4f4', float: 'left' }}>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Create a new playlist"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <TextField id="newTitle" label="Title" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={newPlaylist} color="primary" autoFocus>
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <div style={{ maxWidth: '340px', height: '90%', margin: '0px' }}>
          <DataGrid onRowClick={selectPlaylist} rows={playlistRows} columns={playlistColumns} pageSize={5} />
        </div>    
        <div style={{ maxWidth: '340px', height: '10%', textAlign: 'center' }}>
          <br/>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Create 
          </Button>  
        </div> 
      </div>
      <div style={{ width: '500px', height: '100%', background: '#f4f4f4', float: 'left' }}>
        <DataGrid rows={songRows} columns={songColumns} pageSize={30} />
      </div>
    </>
  );
}

export default PlayListTable;