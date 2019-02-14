import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './Home';
import SurveyList from './SurveyList';
import SurveyEdit from './SurveyEdit';
import QuestionsList from "./SurveyQuestionList";

class App extends Component {
  render() {
    return(
        <Router>
          <Switch>
            <Route path="/" exact={true} component={Home}/>
            <Route path="/survey_manager" exact={true} component={SurveyList}/>
            <Route path="/surveys/:id" component={SurveyEdit}/>
            <Route path="/questions_test" component={QuestionsList}/>
          </Switch>
        </Router>
    )
  }
}

export default App;
