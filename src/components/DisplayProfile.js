import React from 'react';
import './DisplayProfile.css';

/**A function to change unix time ( milliseconds since January 1st, 1970) to a timestamp
 * @param UNIX the unix time that is to be formatted
 * @return fullTime, the timestamp formatted as month, day, year, hour-minute-second
 */
function timeConvert(UNIX) {
    {/* if the time is out of format (ie. undefined) assume the date is never*/}
    if (UNIX == undefined){
        return "Never";
    }
    var a = new Date(UNIX * 1000);
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
/**
 * Displays the profile page given the api data
 * Shows user info as well as info on the games they own
 * @param props contains two values, profileData and ownedGames which are used to generate the rest of the page
 * 
 */
class DisplayProfile extends React.Component{
    constructor(props){
        super(props)   
        this.handleImgError = this.handleImgError.bind(this);
      }

    /**
     * Runs if the avatar image is not accessable 
     * Passes in the default steam no/unknown avatar image
     * @props event argument of the onError handler
     * 
     */
    handleImgError(ev){
        ev.target.src = 'https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';
    }

    render() {

        {/* Iterating through ownedGames and displaying the games 
            Groups the games in triplets and displays the triples on one line*/}

        let displayOwnedGames = [];

        {/* Grouping 3 games together so they are side by side*/}
        for (let subGroupNum = 0; subGroupNum < Math.floor(this.props.ownedGames.length / 3); subGroupNum++){
            let group = []
            {/* Getting invidual game */}
            for(let gameNum = 0; gameNum < 3; gameNum++){
                let gameInfo = this.props.ownedGames[subGroupNum*3+gameNum]

                {/* Appending the individual game to the group
                    The "thirtythree" css is applied for each individual game element */}
                group.push( <div className="thirtythree"> 
                    {/* displaying the game data */}
                        <div className="bold">{gameInfo.name}</div>
                            <div> Playtime: {Math.floor(gameInfo.playtime_forever/60)} hour(s) and {gameInfo.playtime_forever%60} minutes</div>
                            
                        <img className="profileIcon" src={"https://media.steampowered.com/steamcommunity/public/images/apps/" + gameInfo.appid + "/" + gameInfo.img_icon_url + ".jpg"} alt="new"/>
                    </div>);
            }
            {/* The css "flex" is given to the entire group of 3 games*/}
            displayOwnedGames.push(<div className = "flex">{group}</div>);
        }
        {/* Checking for remaining games (if total is not a multiple of 3
            This is the same thing as above, just for the remainder*/}
        let group = []
        for (let i = this.props.ownedGames.length%3; i > 0 ; i--){
            let info = this.props.ownedGames[this.props.ownedGames.length-i]
            group.push( <div className="thirtythree" >   
            <div className="bold">{info.name}</div>
                            <div> Playtime: {Math.floor(info.playtime_forever/60)} hour(s) and {info.playtime_forever%60} minutes</div>
                            
                        <img className="profileIcon" src={"https://media.steampowered.com/steamcommunity/public/images/apps/" + info.appid + "/" + info.img_icon_url + ".jpg"} alt="new"/>
                </div>);
        }
        displayOwnedGames.push(<div className="flex">{group}</div>)

        return(
            <div className="pageDisplayProfile">
                <div className="userInfo">

                    {/* Rendering the user data as a table */}
                    <table>
                        <thead>

                            <tr><td><a href={this.props.profileData.profileurl}>{this.props.profileData.personaname}</a></td></tr>
                            <tr><td>{"SteamID: " +  this.props.profileData.steamid}</td></tr>
                            <tr><td>{"Creation date: " + timeConvert(this.props.profileData.timecreated)}</td></tr>
                            <tr><td>{"Last logged off: " + timeConvert(this.props.profileData.lastlogoff)}</td></tr>
                        </thead>
                    </table>
                    <img className="profileIcon" src={this.props.profileData.avatarfull} alt="new" onError={this.handleImgError}/>
                </div>

                <div className="ownedGamesHeader"> OWNED GAMES</div>
                {/* Rendering the 3 by x grid generated above  */}
                {displayOwnedGames}
            </div>
        )
    }
} 

export default DisplayProfile;