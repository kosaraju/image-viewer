import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './login/login';
import Home from './Home/Home';
import Profile from './Profile/Profile';


/** Controller Component for routing*/
class Controller extends Component {

  /** set the base url*/
  constructor() {
    super();
    this.baseUrl = "https://api.instagram.com/v1/users/self";
  }

  /** render based on routing mapping*/
  render() {
    return (
        <Router>
          <div className="main-container">
            <Route exact path='/' render={(props) => <Login {...props}
                                                            baseUrl={this.baseUrl}/>}/>
            <Route exact path='/home' render={(props) => <Home {...props}
                                                               baseUrl={this.baseUrl}/>}/>
            <Route exact path='/profile' render={(props) => <Profile {...props}
                                                                     baseUrl={this.baseUrl}/>}/>
          </div>
        </Router>
    )
  }
}

export default Controller;