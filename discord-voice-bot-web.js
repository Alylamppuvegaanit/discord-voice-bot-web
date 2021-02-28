const express = require('express');
const app = express();


// Fake data from a "database"
const PLAYLISTS =
[
    { id: "Anime", songs: [
        "https://www.youtube.com/watch?v=fvSRM1zFQ_0",
        "https://www.youtube.com/watch?v=Db1fj2pRFu8",
        "https://www.youtube.com/watch?v=WAoPeG1LU1g",
        "https://www.youtube.com/watch?v=nU21rCWkuJw",
    ]},
    { id: "Raikku", songs: [
        "https://www.youtube.com/watch?v=Y1HIDtGZlXI",
    ]},
    { id: "STP", songs: [
        "https://www.youtube.com/watch?v=iQ6iNkqmk6M",
        "https://www.youtube.com/watch?v=lg1_OYFLgHU",
        "https://www.youtube.com/watch?v=Bl-ouDbqy-g",
        "https://www.youtube.com/watch?v=s8LsZNITPqk",
        "https://www.youtube.com/watch?v=ab2lUr3hNIk",
        "https://www.youtube.com/watch?v=sS4JY2JOwZs",
    ]},
];


app.get("/", (req, res) => {
    return res.send("Hello");
});


app.get("/fetch_data", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    return res.send(PLAYLISTS);
});


app.listen(20202, () =>
    console.log("Server listening"),
);
