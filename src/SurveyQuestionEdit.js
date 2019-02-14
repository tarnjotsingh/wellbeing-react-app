import React, {Component} from 'react';
import {Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalFooter, ModalBody} from "reactstrap";

class SurveyQuestionEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            q: {
                id: this.props.questionId,
                question: this.props.question
            },
            surveyId: this.props.surveyId,
            modal: false
            // unmountOnClose: true
        };
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleSubmitQuestion = this.handleSubmitQuestion.bind(this);
        this.toggle = this.toggle.bind(this);
        // this.changeUnmountOnClose = this.changeUnmountOnClose.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    handleQuestionChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        let tempQuestion = {...this.state.q};
        tempQuestion[name] = value;

        this.setState({q: tempQuestion});
    }

    // Send PUT/POST request to create new question or updated existing one.
    async handleSubmitQuestion(event) {
        event.preventDefault();     // Stops the page from reloading.

        const {q} = this.state;
        const surveyId = this.state.surveyId;

        if(typeof surveyId === 'undefined')
            throw {
                name: "Survey ID",
                message: "Survey ID has not been defined.\nPlease specify a survey to add the question to."
        };

        if(!q.question) {
            throw {
                name: "Empty question string",
                message: "The question string provided was empty.\nEmpty strings are not allowed."
            };
        }

        let request = {
            method: (q.id) ? 'PUT' : 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(q)
        };

        console.log("Request body to send: ");
        console.log(request);

        const response = await(await fetch(`/api/surveys/${surveyId}/questions`, request)).json();

        console.log("Submitted new question to Survey Id: " + surveyId);
        console.log(response);

        // Update the list of questions accordingly.
        if(request.method === 'PUT')
            this.props.updateQuestion(response.id, response.question);
        else
            this.props.addNewQuestionToList(response.id, response.question);
    }

    render() {
        const {q} = this.state;
        const modalTitle = this.props.questionId ? "Edit Question" : "New Question";
        const buttonColor = this.props.questionId ? "primary" : "success";
        //console.log(`q.id: ${this.props.questionId}\nq.question: ${this.props.question}\nsurveyId: ${this.props.surveyId}`);

        return (
            <>
                <Button color={buttonColor} size="sm" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <Form onSubmit={this.handleSubmitQuestion}>
                        <ModalHeader toggle={this.toggle}>{modalTitle}</ModalHeader>

                        <ModalBody>
                            <Input type="text" name="question" id="question"  value={q.question || ''}
                                   onChange={this.handleQuestionChange} autoComplete="Type in your question here"/>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onClick={this.toggle} type="submit">Save</Button>
                            {' '}
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </>
        );
    }

}

export default SurveyQuestionEdit;

