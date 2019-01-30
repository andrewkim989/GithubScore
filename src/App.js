import React, { Component } from 'react';
import './App.css';
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nameError: "",
      data: "",
      submit: false,
      found: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event) {
    var name = event.target.value;
    this.setState({name: name});

    if (name.length === 0) {
      this.setState({submit: false});
    }
    else {
      this.setState({nameError: "", submit: true});
    }
  }

  submit(e) {
    axios.get("https://api.github.com/users/" + this.state.name)
    .then(
      (response) => {
        this.setState({nameError: "", data: response.data, found: true});
        this.score();
      })
      .catch(error => {
        this.setState({nameError:
          "User does not exist. Please type in a different name.", found: false});
    });

    this.setState({name: "", submit: false});
    e.preventDefault();
  }

  github() {
    return (
      <div id = "githubform">
        <form onSubmit = {this.submit}>
          <div className = "error">{this.state.nameError}</div>
          <p>Type in the Github username below, then click on the button to see the user's score!
            The score is based on the amount of people following this user plus the amount of public
            repositories the user has.</p>
          <p><b>Note:</b> Try not to send too many requests in a short period of time. 
            Github API will lock you out if you do. </p>
          <input type = "text" name = "name" value = {this.state.name}
          placeholder = "Type in the username here"
          onChange = {this.handleChange} size = "35"></input>

          <input type = "submit" className = "btn btn-info"
          value = "Calculate the Github user's score" disabled = {!this.state.submit}></input>
        </form>
      </div>
    )
  }

  score() {
    var repo = parseInt(this.state.data.public_repos);
    var followers = parseInt(this.state.data.followers);
    var score = repo + followers;
    var message;

    if (score < 20) {
      message = <h3 style = {{color: "red"}}>Your profile needs improvement...</h3>
    }
    else if (score >= 20 && score < 50) {
      message = <h3 style = {{color: "rgb(255, 123, 0)"}}>A decent start! Keep up the good work!</h3>
    }
    else if (score >= 50 && score < 100) {
      message = <h3 style = {{color: "black"}}>You're doing pretty great!</h3>
    }
    else if (score >= 100 && score < 200) {
      message = <h3 style = {{color: "green"}}>You have an outstanding profile! </h3>
    }
    else {
      message = <h3 style = {{color: "blue"}}>You're a Github Elite! Congratulations!!!</h3>
    }

    return (
      <div id = "score">
        <h2>User score: {score}</h2>
        {message}
      </div>
    )
  }

  render() {
    return (
      <div className = "App">
        <h1>Github Score</h1><br></br>
        {this.github()}
        <div id = "blackline"></div>
        {this.state.found ? this.score(): null}
      </div>
    );
  }
}

export default App;
