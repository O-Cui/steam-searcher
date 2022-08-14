import React from 'react';
import {Carousel} from 'react-responsive-carousel';
import './FrontPage.css';

/**
 * Displays the bulk of the default landing page, including the two carousels that show what was recently searched
 * If a call returns an error, an error page will be rendered
 * @param props contains three values, found, recentGames and recentUsers which is used to generate the page
 * 
 */
class FrontPage extends React.Component{
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
    handleImgError(event){
        event.target.src = 'https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';
      }
      
    render(){
        const found = this.props.found;
        let pageDisplay;

        {/* Figuring out what to display on the page */}
        if (found == "userError"){
            pageDisplay = <div> <h1 className="header">Player not found!</h1></div>
        } else if (found == "gameError"){
            pageDisplay = <div><h1 className="header">Game not found!</h1></div>
        } else if (found == "home" && this.props.recentGames != ""){
            pageDisplay = <div className="pageDisplay">

                <div className="flex100"> 

                    {/* Rendering the carousel for the recently searched users
                        which were obtained from the API call when the page loads */}
                    <div className="half"> <h1> Recently Searched Users: </h1>
                        
                        {/* Making the carousel by mapping through each element in the json file */}
                        <Carousel className="carousel" infiniteLoop showStatus={false} autoPlay={true} width="40%" showThumbs={false}>
                            {this.props.recentUsers.map(({ user_name, avatar_link, saved_date}, key)=> (
                                //index of the current element
                                <div key = {key}>   
                                {/* displaying the past searched users*/}
                                <h2>{user_name}</h2> <p> Searched on {saved_date}</p>
                                        <img src={avatar_link} alt="new" onError={this.handleImgError}/>

                                </div>
                            ))}
                        </Carousel>
                    </div>

                    {/* Rendering the carousel for the recently searched games
                        which were obtained from the API call when the page loads */}
                    <div className="half"> <h1> Recently Searched Games: </h1>
                        
                        {/* Making the carousel */}
                        <Carousel className="carousel"infiniteLoop showStatus={false} autoPlay={true}width='80%' showThumbs={false} >
                            {this.props.recentGames.map(({game_name, header_link, saved_date}, key)=> (
                                <div key = {key}> 
                                {/* displaying the past searched games*/}
                                    <h2>{game_name}</h2> <p> Searched on {saved_date} </p>
                                    <img src={header_link} alt="new" />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                
                </div>
            </div>
                        
        }
        return(
            <div className="pageDisplay">
                {pageDisplay}
            </div>
        )
    }
}
export default FrontPage;