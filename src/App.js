import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Home from './Home';
import SurveyList from './survey/edit/SurveyList';
import SurveyEdit from './survey/edit/SurveyEdit';
import QuestionsList from './survey/edit/SurveyQuestionList';
import LoginPage from './login/LoginPage'
import AuthService from './service/AuthService';

/**
 * Wrapper method to check the authentication status of the user and redirect
 * them to the correct page/component based on that.
 * Users will be redirected to the login page when a basic validation of the
 * stored token has failed. Otherwise users will be directed to the desired
 * component.
 * @param Component
 * @param rest
 * @returns {*}
 * @constructor
 */
const AuthRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        AuthService.checkTokenExpired() ? (
            <Component {...props} />
        ) : (
            <Redirect to={{ pathname: '/login' }} />
        )
    )} />
);

class App extends Component {
    componentDidMount() {
        // Just save the client auth here to make our lives easier.
        localStorage.setItem("clientAuth","Zmlyc3QtY2xpZW50OmNsaWVudC1zZWNyZXQ=");
    }

    render() {
        return(
            <Router>
                <Switch>
                    <Route path="/login" exact={true} component={LoginPage}/>
                    <AuthRoute path="/" exact={true} component={Home}/>
                    <AuthRoute path="/survey_manager" exact={true} component={SurveyList}/>
                    <AuthRoute path="/surveys/:id" component={SurveyEdit}/>
                    <AuthRoute path="/questions_test" component={QuestionsList}/>
                </Switch>
            </Router>
        )
    }
}

export default App;
