import React, {Component} from 'react';
import Joke from './Joke'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import "./JokeList.css";



class JokeList extends Component{
    static defaultProps = {
        numOfDadJokes: 10
    }

    constructor(props){
        super(props);
        
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem('jokes') || "[]")
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleVote(id, delta){
        this.setState(state => ({
            jokes: state.jokes.map(joke => joke.id === id ? {...joke, votes: joke.votes + delta} : joke)
        }), 
        () => (
            window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
            )
        )
    }

    handleClick(){
        this.getJokes();
    }

    async getJokes(){
        let newJokes = []

        while(newJokes.length < this.props.numOfDadJokes){
            let res = await axios.get('https://icanhazdadjoke.com/', 
            {headers: {Accept: 'application/json'}})

            newJokes.push({id: uuidv4(), text: res.data.joke, votes: 0})
        }
        this.setState(state => ({
            jokes: [...state.jokes, ...newJokes]
        }),
        () => (
            window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
            )
        )
    }

    componentDidMount(){
        if(this.state.jokes.length === 0){
            this.getJokes()
        }
    }

    render(){
        return(
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Dad</span> Jokes
                    </h1>
                    <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" alt="Laughing Emoji" />
                    <button className="JokeList-getmore" onClick={this.handleClick}>New Jokes</button>
                </div>
                
                <div className="JokeList-jokes">
                    {this.state.jokes.map(joke => (
                        <Joke 
                        key={joke.id} 
                        text={joke.text} 
                        votes={joke.votes} 
                        upvote={() => this.handleVote(joke.id, 1)} 
                        downvote={() => this.handleVote(joke.id, -1)}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default JokeList;