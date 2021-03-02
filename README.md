# discord-voice-bot-web
Web interface for discord-voice-bot

![](https://i.imgur.com/vQKq8qb.png)

### Development
Initiate the frontend by running the following in the `frontend` dir:
```
npm install
npm start
```
The front-end will be accessible from `http://localhost:3000`.

Initiate the backend and API by running in the project root:
```
npm install
node discord-voice-bot-web.js
```

You may want to switch to development backend entrypoints by updating `frontend/src/config.json`:
```
{
    "fetch": "http://localhost:20202//fetch_data",
    "api_update": "http://localhost:20202//playlist_update",
    "api_add": "http://localhost:20202//playlist_add",
    "api_delete": "http://localhost:20202//playlist_delete"
}
```
To test the application with actual production backend and database, use the remote values already set in the file.
