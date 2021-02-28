const express = require('express');
const cors = require('cors')
const fs = require('fs');
const bodyParser = require('body-parser')


var jsonParser = bodyParser.json()
const app = express();
app.use(cors());


// Read data file
fetchPersistent = () => {
    try {
        // Read data synchronously
        return fs.readFileSync("data/playlists.json", "utf8");
    } catch {
        return [];
    }
}


// Write changes to data file
writePersistent = (data) => {
    try {
        // Read data synchronously
        fs.writeFileSync("data/playlists.json", data)
        return true;
    } catch {
        return false;
    }
}


// Entrypoint for getting saved playlists
app.get("/fetch_data", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.send(fetchPersistent());
});


// Entrypoint for updating playlist data
app.post("/update_data", jsonParser, (req, res) => {
    // Combine the incoming playlists and already saved playlists
    let updatedPlaylists = req.body;

    /*
    Currently this part relies on the front-end to have a copy of all
    the desired information. TODO: do not replace all data with one
    coming from the front-end but process the diff of playlists here
    and combine the new data with old data. Below some experimental stuff.

    let savedPlaylists = JSON.parse(fetchPersistent());
    let combinedNewData = savedPlaylists.concat(updatedPlaylists)
                            .filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    */

    if (writePersistent(JSON.stringify(updatedPlaylists))) {
        return res.send({ updated: true });
    } else {
        return res.send({ updated: false });
    }
});


// Serve front-end
app.get("/", (req, res) => {
    return res.send("Hello");
});


// Start server
app.listen(20202, () =>
    console.log("Server listening"),
);
