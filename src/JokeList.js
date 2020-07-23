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
            loading: false,
            jokes: JSON.parse(window.localStorage.getItem('jokes') || "[]")
        }
        this.seenJokes = new Set(this.state.jokes.map(joke => (joke.text)));
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
        this.setState({loading: true}, this.getJokes)
    }

    async getJokes(){
        try {
            let newJokes = []

            while(newJokes.length < this.props.numOfDadJokes){
                let res = await axios.get('https://icanhazdadjoke.com/', 
                {headers: {Accept: 'application/json'}})
                
                let newJoke = res.data.joke
    
                if(!this.seenJokes.has(newJoke)){
                    newJokes.push({id: uuidv4(), text: newJoke, votes: 0})
                }
            }
            this.setState(state => ({
                loading: false,
                jokes: [...state.jokes, ...newJokes]
            }),
            () => (
                window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
                )
            )
            
        } catch (error) {
            alert(error)
            this.setState({loading: false})
        }

    }

    componentDidMount(){
        if(this.state.jokes.length === 0){
            this.getJokes()
        }
    }

    render(){
        let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
        if(this.state.loading){
            return(
                <div className="JokeList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin"/>
                    <h1 className="JokeList-title">Loading...</h1>
                </div>
            )
        }
        
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
                    {jokes.map(joke => (
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