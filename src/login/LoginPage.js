import React, {Component} from 'react'
import {Alert, Button, ButtonGroup, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from '../AppNavbar'
import AuthService from '../service/AuthService';


class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            password: this.props.password,
            status: this.props.status
        };
        this.onChange.bind(this);
        this.onSubmit.bind(this);
    }

    onChange(event) {
        this.setState({[event.target.name] : event.target.value})
    }

    /**
     * Need to take the username and password properties and use them to obtain a token.
     * Method will retrieve a token then ensure that the token is valid.
     */
    async onSubmit(event) {
        event.preventDefault();
        const {username, password} = this.state;
        //Get the token
        const token = await AuthService.getToken(username, password);
        //Then validate that it's correct by using the /check_token endpoint...
        const isValid = await AuthService.validateToken(token);

        // Redirect user to the home page is the token is valid...
        if(isValid) {
            console.log("Redirecting to home...");
            this.props.history.push("/");
        }
        else {
            this.setState({
                username: this.props.username,
                password: this.props.password,
                status: true
            }, () => {
                window.setTimeout(() => {
                    this.setState({status: false})
                }, 3000)
            });
            console.error("Failed to validate user token...");
        }
    }

    render() {
        return (
            <div>
                <AppNavbar/>

                <Container>
                    <br/>
                    <Form onSubmit={e => this.onSubmit(e)}>
                        <FormGroup>
                            <h5>Login</h5>
                            <Input
                                name='username'
                                placeholder='Username'
                                onChange={e => this.onChange(e)}
                                value={this.state.username}/>
                            <Input
                                name='password'
                                placeholder='Password'
                                type='password'
                                onChange={e => this.onChange(e)}
                                value={this.state.password}/>
                        </FormGroup>

                        <FormGroup>
                            <ButtonGroup>
                                <Button size="md" color="primary" type="submit">Login</Button>
                            </ButtonGroup>
                        </FormGroup>

                        <Alert color="danger" isOpen={this.state.status}>Bad Credentials</Alert>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default LoginPage;

LoginPage.defaultProps = {
    username: "",
    password: "",
    status: null
};