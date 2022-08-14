require('dotenv').config()
const express = require('express')
const ApiHelper = require('./ApiHelper')
const db = require('./queries')
const bodyParser = require('body-parser')
const app = express()
const port = 3001


//requrements in order to get around the CORS policy (allows the front-end to make calls with the back end)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "url, Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin");
  next();
});

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )


//Call for User Summary (Name, Date created, Last log in, Icon, SteamID)
app.post('/getUserSummary', (req, res) => {
    console.log(process.env)
    ApiHelper.make_API_call(("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?appid=1145360&key=" +  process.env.KEY + "&steamids=" + req.body.steamID))
    //What to do after the api has been called
    .then(response => {
       // console.log("RAN user summary")
        res.json(response)
    })
    //In case of errors with the api call
    .catch(error => {
        res.send(error)
        //console.log("BAD user summary")
    })
})

//Call for the user's owned games
app.post('/getOwnedGames', (req, res) => {
  ApiHelper.make_API_call(("http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=" + process.env.KEY + "&steamid=" + req.body.steamID + "&include_appinfo=true&include_played_free_games=true"))
  .then(response => {
     // console.log("RAN owned games")
      res.json(response)
  })
  .catch(error => {
      res.send(error)
     // console.log("BAD owned games")
  })
}),

//Call for the game's data
app.post('/getGameData', (req, res) => {

  ApiHelper.make_API_call(("https://store.steampowered.com/api/appdetails?appids=" + req.body.gameID + "&format=json"))
  .then(response => {
      //console.log("RAN game data")
      res.json(response)
  })
  .catch(error => {
      res.send(error)
      //console.log("BAD game data")
  })
}),

//The calls that have to do with the local postgres database
app.post('/saveGame', db.saveGame)
app.get('/getRecentGames', db.getRecentGames)
app.post('/saveUser', db.saveUser)
app.get('/getRecentUsers', db.getRecentUsers)

//Print statement to confirm that the express app is running
app.listen(port, () => {  
    console.log(`Example app listening on port ${port}`)
})