import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Button, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from '../../AppNavbar';
import SurveyQuestionList from './SurveyQuestionList';
import {defaultAuthHeaders} from "../../service/AuthService";


class SurveyEdit extends Component {

    emptySurvey =  {
        id: '',
        name: '',
        description: ''
    };

    constructor(props) {
        super(props);
        // Just init this object's state with the empty survey.
        this.state = {
            survey: this.emptySurvey,
            questions: this.emptySurvey.questions,
            showPopup: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Ensure that the component mounted correctly. Data from REST api has been retrieved.
    async componentDidMount() {
        if(this.props.match.params.id !== 'new') {
            let request = {
                method: 'GET',
                headers: {'Authorization': localStorage.getItem("bearer")}
            };
            const fetchedSurvey = await (await fetch(`/api/surveys/${this.props.match.params.id}`, request)).json();

            this.setState({survey: fetchedSurvey});
        }
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;       // Name of the field that was updated
        const value = target.value;     // Value of that field that was updated
        let updatedSurvey = {...this.state.survey}; // Prep the value to update the values
        //updatedSurvey["questions"][0][name] = value;                // Update target field with new value
        updatedSurvey[name] = value;
        this.setState({survey: updatedSurvey}) // Set state with updated values
    }

    async handleSubmit(event) {
        /* Apparently this event.preventDefault() is a jQuery thing
        event.preventDefault will prevent navigation to another page
        even if it links to another page */
        event.preventDefault();

        const {survey} = this.state;

        console.log("Body to send:");
        console.log(JSON.stringify(survey));
        console.log("Method: " + (survey.id) ? 'PUT' : 'POST');

        let request = {
            method: (survey.id) ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem("bearer")
            },
            body: JSON.stringify(survey)
        };

        console.log("Request JSON");
        console.log(request);

        /* Do the update, which means doing the PUT request against
           url:port/api/surveys
           This method will create a new survey if the detected id
           does not already exist, meaning a POST request will be done
           instead against the same endpoint */
        await fetch('/api/surveys', request);

        /* History API lets us manipulate the URL In the browser without
        reloading the page. Once done, I guess this will allow us to
        navigate back to the surveyManager page.*/
        this.props.history.push('/survey_manager');
    }

    getQuestionChoices(question) {
        // Store the questionChoices for a given question
        const data = question["questionChoices"];
        return data.map(questionChoice => {
            return (
                <ul key={questionChoice.id}>
                    <li>ID: {questionChoice.id}</li>
                    <li>Choice: {questionChoice.choice}</li>
                    <li>Weight: {questionChoice.weight}</li>
                    <br/>
                </ul>
            )
        });
    }

    getQuestions() {
        const data = this.state.survey["questions"];
        return data.map((question) => {
             return <div key={question.id} className="questionItem">
                 <ul>
                     Question:
                     <li>ID: {question.id}</li>
                     <li>Question: {question.question}</li>
                     Choices:
                     {this.getQuestionChoices(question)}
                 </ul>

                 <FormGroup>
                     <Label for="question">Question</Label>
                     <Input type="text" name="question" id="question"
                            value={question.question || ''} onChange={this.handleChange}
                            autoComplete="question"/>
                 </FormGroup>
             </div>
        });
    }



    render() {
        const {survey} = this.state;
        console.log(survey);
        // If the id exists, show 'Edit Group' instead of 'Add Group'
        const title = <h2 className="mt-4">{survey.id ? 'Edit Survey' : 'Add Survey'}</h2>;
        //const questionsList2 = survey.questions.map(question)

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
                               value={survey.name || ''} onChange={this.handleChange}
                               autoComplete="name"/>
                    </FormGroup>

                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="text" name="description" id="description"
                               value={survey.description || ''} onChange={this.handleChange}
                               autoComplete="description"/>
                    </FormGroup>

                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button> {' '}
                        <Button color="secondary" tag={Link} to="/survey_manager">Cancel</Button>
                    </FormGroup>
                </Form>

            </Container>

            <Container>


                <SurveyQuestionList surveyId={survey.id}/>

            </Container>

        </div>
    }
}

export default SurveyEdit;