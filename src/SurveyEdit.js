import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from './AppNavbar';


class SurveyEdit extends Component {

    emptyItem = {
        name: '',
        description: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if(this.props.match.params.id !== 'new') {
            const survey = await (await fetch(`/api/surveys/${this.props.match.params.id}`)).json();
            this.setState({item: survey});
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};

        item[name] = value;
        this.setState({item: item})
    }

    async handleSubmit(event) {
        /* Apparently this event.preventDefault() is a jQuery thing
        event.preventDefault will prevent navigation to another page
        even if it links to another page */
        event.preventDefault();

        const {item} = this.state;

        /* Do the update, which means doing the PUT request against
           url:port/api/surveys
           This method will create a new survey if the detected id
           does not already exist, meaning a POST request will be done
           instead against the same endpoint */
        await fetch('/api/surveys', {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        console.log(JSON.stringify(item));
        /* History API lets us manipulate the URL In the browser without
        reloading the page. Once done, I guess this will allow us to
        navigate back to the surveyManager page.*/
        this.props.history.push('/surveyManager');
    }

    render() {
        const {item} = this.state;
        // If the id exists, show 'Edit Group' instead of 'Add Group'
        const title = <h2>{item.id ? 'Edit Group' : 'Add Group'}</h2>;

        /* Will just display a form thing that gives you the ability to give
        new values for the name and description of the survey */
        return <div>
            <AppNavbar/>

            <Container>
                {title}

                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name"
                               value={item.name || ''} onChange={this.handleChange}
                               autoComplete="name"/>
                    </FormGroup>

                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="text" name="description" id="description"
                               value={item.description || ''} onChange={this.handleChange}
                               autoComplete="description"/>
                    </FormGroup>

                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button> {' '}
                        <Button color="secondary" tag={Link} to="/surveyManager">Cancel</Button>
                    </FormGroup>
                </Form>

            </Container>
        </div>
    }
}

export default SurveyEdit;