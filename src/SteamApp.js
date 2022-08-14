import React from "react";
import Button from 'react-bootstrap/Button';
import axios from "axios";
import DisplayProfile from './components/DisplayProfile.js';
import DisplayGame from './components/DisplayGame.js';
import FrontPage from './components/FrontPage.js';
import './SteamApp.css';

/**
 * The main page that holds all the other components, such as FrontPage, DisplayProfile, and Display Game
 * Holds the API calls to the postgres database for previously searched games and users
 * 
 */
export class SteamApp extends React.Component{
    constructor(props){
        super(props);
        this.state= { 
            //What searchbar was used
            searched: "none",
            //Whether or not something was returned
            found: "home",
            //Profile info returned by API
            userData: undefined,
            userGames: undefined,
            steamID:"",
            //Game info returned by the api
            gameData:"",
            gameID: "",
            //Carousel stuff
            recentGames: "",
            recentUsers: "",
        }
        //Binding all the functions (this keyword)
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleUserSubmit = this.handleUserSubmit.bind(this);
        this.handleGameSubmit = this.handleGameSubmit.bind(this);
        this.handleHome = this.handleHome.bind(this);
    }

    /**
    * Gets the past searched games and users from the database
    * runs whenever the page is refreshed
    */
  async componentDidMount(){
    let recentGameResults; let recentUserResults; 
    
    //Run two get calls for the past games and users 
    const [recentGames, recentUsers] = await Promise.all([
        axios.get("https://steam-searcher.herokuapp.com/getRecentGames"),
        axios.get("https://steam-searcher.herokuapp.com/getRecentUsers")
    ])

        /*
        console.log("RECENT GAMES:")
        console.log(recentGames.data)
        
        console.log("RECENT USERS")
        console.log(recentUsers.data)
        

        //In case nothing is found in the database
        if (recentGames.length == 0){
            console.log("No recent game data found!")
        } else if (recentUsers.length==0){
            console.log("NO recent user data found!")
        } else {
        */

        //The past games and users data that was returned by the get call
        recentGameResults = recentGames.data;
        recentUserResults = recentUsers.data;

        //}
        this.setState({
            recentGames: recentGameResults,
            recentUsers: recentUserResults,
        })
}

    /**
     *  runs every time text is changed in a textbox
     * sets the state of whatever textbox was changed to the value of the textbox
     * @param e event argument of the onChange handler
     */
    handleTextChange(e){
        /* depending on what "id" is passed through the text box, set the 
            corresponding id's state to whatever was in the text*/
        this.setState({[e.target.id]:e.target.value})
    }

    /**
    *  handler for when the Steam Searcher top right logo is pressed
    *  resets the home and searched state back to default
    */
    handleHome(){
        this.setState({found: "home", searched: "none"})
        window.location.reload(true);

    }

    /** 
    * runs whenever the "Search User" button is pressed
    * makes api calls to the steam api and postgres
    * @param e event argument of the onClick handler
    */
    async handleUserSubmit(e){
        let searchedResult; let foundResult; let userDataResult; let userGamesResult;
        //prevents browser refresh (reloading the page)
        e.preventDefault();

        //all the data that will be sent to the express app
        let toSend = {steamID: this.state.steamID}

        //Run two post calls for the steam user data
        const [userSummary, userOwnedGames] = await Promise.all([
            axios.post("https://steam-searcher.herokuapp.com/getUserSummary", toSend),
            axios.post("https://steam-searcher.herokuapp.com/getOwnedGames", toSend) 
        ])
            
            //Check for errors or no users found
            if (userSummary.data.response.players.length == 0){
               // console.log("No users found!")
                foundResult = "userError";
                searchedResult = "none";
            } else {
            /*
            console.log("User Summary Below:")
            console.log(userSummary.data.response.players[0])
            console.log("User Owend Games Below:")
            console.log(userOwnedGames.data.response.games)
            */
            
            //A player was found and the search was completed successfully
            searchedResult = "user";

            //The user data that was returned by the api
            userDataResult = userSummary.data.response.players[0];

            //The data about what games they owned
            userGamesResult = userOwnedGames.data.response.games

            }
            //saving all the data in state
            this.setState({
                found: foundResult,
                searched: searchedResult,
                userData: userDataResult,
                userGames: userGamesResult
            })
            
            //Saving the user data into the local database after recieving it from the steam api
            let toStore = {steam_id: this.state.steamID, user_name : userDataResult.personaname,
                avatar_link: userDataResult.avatarfull}
            
            /*
            console.log("Information to be stored below")
            console.log(toStore)
            */

            //Post call to save data
            const [saveUser] = await Promise.all([
            axios.post("https://steam-searcher.herokuapp.com/saveUser", toStore),  
            ])
            
            //Checking for errors
            if (saveUser == "Error"){
                console.log("Error with storing the user data!")
            }

            /*
            console.log("Saved user info below:")
            console.log(saveUser)
            */

    }

    /** 
    * runs whenever the "Search Game" button is pressed
    * makes api calls to the steam api and postgres
    * @param e event argument of the onClick handler
    */
   async handleGameSubmit(e){
        let searchedResult; let foundResult; let gameDataResult; 
        //prevents browser refresh
        e.preventDefault();

        //the data that is sent to the express app (gameID)
        let toSend = {gameID: this.state.gameID}
       

        //Run post calls for the steam game api results
        const [gameSummary] = await Promise.all([
            axios.post("https://steam-searcher.herokuapp.com/getGameData", toSend),
        ])

            //console.log(gameSummary.data)

            // if either the id is invalid, or the id is referring to something that is not a game
            if (gameSummary.data[this.state.gameID] == null || gameSummary.data[this.state.gameID].success === false){
                //console.log("No game found!")

                foundResult = "gameError";
                searchedResult = "none";

                this.setState({
                    found: foundResult,
                    searched: searchedResult,
                })
                return

            } else {
        
            //A game was found and the search was completed successfully
            searchedResult = "game";

            //The game data that was returned by the api
            gameDataResult = gameSummary.data[this.state.gameID].data;

            /*
            console.log("Game Summary Below:")
            console.log(gameDataResult)
            */

            }
            //saving all the data in state
            this.setState({
                found: foundResult,
                searched: searchedResult,
                gameData: gameDataResult,
            })
            
            //After getting the game info, storing it into the local database
            let toStore = {game_id: this.state.gameID, game_name: gameDataResult.name,
                            header_link: gameDataResult.header_image}
            
            /*
            console.log("Information to be stored below")
            console.log(toStore)
            */

            //Post call to save the data
            const [saveGame] = await Promise.all([
            axios.post("https://steam-searcher.herokuapp.com/saveGame", toStore),  
            ])

            /*
            //Checking for errors
            if (saveGame == "Error"){
                console.log("Error with storing the game data!")
            }

            console.log("Saved info below:")
            console.log(saveGame)
            */
    }

    render()   {
        const searched = this.state.searched;
        let display;

        //deciding what page to display
        if (searched == "user"){
            display = <DisplayProfile profileData={this.state.userData} ownedGames={this.state.userGames}/>
        } else if (searched == "game") {
            display = <DisplayGame gameData={this.state.gameData}/>
        } else if (searched == "none") {
            display = <FrontPage found={this.state.found} recentGames={this.state.recentGames} recentUsers={this.state.recentUsers}/>
        }
        return(
            <div>
                <div className="topIndent">
                    {display}
                </div>

                <div className="navbar">

                     {/* Rendering the textbox and button to search for a user */}
                    <div className="searchUser">
                        <form  className="searchUser" onSubmit={this.handleUserSubmit}>
                            <label  className="searchUser">
                                <input id="steamID" type="text" placeholder="Steam ID" onChange={this.handleTextChange} />
                            </label>
                        </form>
                        <Button className="searchButton" onClick={this.handleUserSubmit} >
                            Search User
                        </Button>

                     {/* Rendering the textbox and button to search for a game */}
                    <div className="searchGame">
                        <form  className="searchUser" onSubmit={this.handleGameSubmit}>
                            <label  className="searchUser" >
                                <input id="gameID" type="text" placeholder="Game ID" onChange={this.handleTextChange} />
                            </label>
                        </form>
                        <Button className="searchButton" onClick={this.handleGameSubmit} >
                            Search Game
                        </Button>
                    </div>
                </div>
                    {/* Rendering the "Steam Searcher" logo at the top right */}
                    <div className="half">
                    <Button className="logoButton" onClick={this.handleHome}>
                        Steam Searcher
                    </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SteamApp;