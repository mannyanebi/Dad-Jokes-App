import React, {Component} from 'react';
import axios from 'axios';

class JokeList extends Component{
    static defaultProps = {
        numOfDadJokes: 10
    }

    constructor(props){
        super(props);
        
        this.state = {
            jokes: []
        }
    }

    async componentDidMount(){
        let newJokes = []

        while(newJokes.length < this.props.numOfDadJokes){
            let res = await axios.get('https://icanhazdadjoke.com/', 
            {headers: {Accept: 'application/json'}})

            newJokes.push(res.data.joke)
        }
        this.setState({
            jokes: newJokes
        })
    }

    render(){
        return(
            <div className="JokeList">
                <h1>Dad Jokes</h1>
                <div className="JokeList-jokes">
                    {this.state.jokes.map(joke => (
                        <div>{joke}</div>
                    ))}
                </div>
            </div>
        )
    }
}

export default JokeList;