import React from 'react';
import './DisplayGame.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from 'react-responsive-carousel'; 

/**
 * Displays the game page given the api data
 * @param props contains gameData, which contains data used in making the page
 */
class DisplayGame extends React.Component{
    constructor(props){
        super(props)   

      }

    render() {

        return(

            /* Display the game information using the data passed into this component from SteamApp.js */
            <div className="displayGame">
                <div>
                    <div>
                        <div className="header">
                            {this.props.gameData.name}
                        </div>

                        <img className="gameBanner" src={this.props.gameData.header_image} alt="new"/>

                    {/* convert the string "detailed_description" into renderable html
                        dangerouslySetInnerHTML: allows react to render the html in a string */}
                    <div className="description">
                        <div className="miniHeader" > DESCRIPTION</div>
                            <div dangerouslySetInnerHTML={{ __html: this.props.gameData.detailed_description}} /></div>
                        </div>
                    </div>

                    {/* Rendering the fixed image gallery on the right side of the page using the images
                        obtained by the api call for game data in SteamApp.js*/}
                    <div className="fixedRight"> 
                        <div className="miniHeader">Release Date: {this.props.gameData.release_date.date}</div>

                        <Carousel thumbWidth={40} showThumbs={false} showIndicators={false} infiniteLoop showStatus={false} autoPlay={true} width="600px">
                            {/* Mapping through the json to get all the image links */}
                            {this.props.gameData.screenshots.map(({path_full}, key)=> (
                                <div  key = {key}> 
                                    {/* displaying the images */}    
                                    <img src={path_full} alt="new"/>
                                </div>
                            ))}
                        </Carousel>
                    </div>
            </div>
        )
    }
} 

export default DisplayGame;