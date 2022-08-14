require('dotenv').config()
const Pool = require('pg').Pool
console.log(process.env.PORT)
//Hidden database variables from .env file
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
})

//A function to convert unix time into a timestamp
function timeConvert(UNIX) {
  {/* if the time is out of format (ie. undefined) assume never*/}
  if (UNIX == undefined){
      return "Never";
  }
  var a = new Date(UNIX);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();

  {/* single digit formatting */}
  if (hour < 10){
      hour = "0" + hour;
  }
  var min = a.getMinutes();
  if (min < 10){
  min = "0" + min;
  }   
  var sec = a.getSeconds();
  if (sec < 10){
  sec = "0" + sec;
  }
  
var fullTime = month + ' ' + date + ', ' + year + ' at ' + hour + ':' + min + ':' + sec ;
return fullTime;
}

//All the calls in this file are to communicate with the local postgres database

//Takes in the searched game info as a request and stores it into the postgres database
const saveGame = (request, response) => {
    const {game_id, game_name, header_link} = request.body
    let saved_date = timeConvert(Date.now())


    pool.query("INSERT INTO searched_games (game_id, game_name, header_link, saved_date) VALUES ($1, $2, $3, $4)", [game_id, game_name, header_link, saved_date], (error, results) =>{

        if (error) {
          response.status(404).send("error");
          return
        }
        //console.log("Success game data saved")
          response.status(201).send(results.rows);
    })
}

//Returns the 5 most recently searched game's info 
const getRecentGames = (request, response) => {
  console.log("HERE")
  pool.query("SELECT * FROM ( SELECT DISTINCT ON (game_id) * FROM searched_games ORDER BY game_id, saved_date DESC) sub ORDER BY saved_date DESC LIMIT 5", (error, results) =>{
      
      if (error) {
        console.log(error)
        response.status(499).send("Error with getting recent games!");
        return
      }
      /*
      console.log(results.rows)
      console.log("Success game data retrieved")
      */
        response.status(201).send(results.rows);
  })
}

//Takes in the searched user info as a request and stores it into the postgres database
const saveUser = (request, response) => {
  const {steam_id, user_name, avatar_link} = request.body
  let saved_date = timeConvert(Date.now())

  pool.query("INSERT INTO searched_users (steam_id, user_name, avatar_link, saved_date) VALUES ($1, $2, $3, $4)", [steam_id, user_name, avatar_link, saved_date], (error, results) =>{

      if (error) {
        response.status(404).send("error");
        return
      }
      /*
      console.log(results.rows)
      console.log("Success user data saved")
      */
        response.status(201).send(results.rows);
  })
}
//Returns the 5 most recently searched user's info 
const getRecentUsers = (request, response) => {
  pool.query("SELECT * FROM ( SELECT DISTINCT ON (steam_id) * FROM searched_users ORDER BY steam_id, saved_date DESC) sub ORDER BY saved_date DESC LIMIT 5", (error, results) =>{
      
      if (error) {
        //console.log(error)
        response.status(499).send("Error with getting recent users!");
        return
      }
      /*
      console.log(results.rows)
      console.log("Success user data retrieved")
      */
        response.status(201).send(results.rows);
  })
}

//Exporting the created modules so that they can be called elsewhere (index.js)
  module.exports = {
    saveGame,
    getRecentGames,
    saveUser,
    getRecentUsers,
  }