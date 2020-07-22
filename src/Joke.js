import React, {Component} from 'react';
import "./Joke.css"

class Joke extends Component {

    "#4CAF50"
    "#8BC34A"
    "#CDDC39"
    "#FFE"

    render(){
        return(
            <div className="Joke">
                <div className="Joke-buttons">
                    <i className="fas fa-arrow-up" onClick={this.props.upvote} />
                        <span className="Joke-votes">{this.props.votes}</span>
                    <i className="fas fa-arrow-down" onClick={this.props.downvote}/>
                </div>
                <div className="Joke-text">{this.props.text}</div>
                <div className="Joke-smiley">
                    <i className="em em-rolling_on_the_floor_laughing" />
                </div>
            </div>
        )
    }
}

export default Joke;