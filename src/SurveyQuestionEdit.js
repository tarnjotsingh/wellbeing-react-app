import React, {Component} from 'react';
import {Form, Input, Button, Modal, ModalHeader, ModalFooter, ModalBody} from "reactstrap";
import ReactTable from "react-table";
import 'react-table/react-table.css'

class SurveyQuestionEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            q: this.props.question,
            surveyId: this.props.surveyId,
            newChoice: {
                choice: '',
                weight: ''
            },
            modal: false
            // unmountOnClose: true
        };
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleSubmitQuestion = this.handleSubmitQuestion.bind(this);
        this.handleQuestionChoiceChange = this.handleQuestionChoiceChange.bind(this);
        this.handleSubmitFullQuestion = this.handleSubmitFullQuestion.bind(this);
        this.addEmptyChoice = this.addEmptyChoice.bind(this);
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

    /**
     * Method for handling event change for a new question choice.
     *
     * @param event
     */
    handleQuestionChoiceChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        let updatedNewChoice = {...this.state.newChoice};
        updatedNewChoice[name] = value;

        this.setState({newChoice: updatedNewChoice});
    }

    handleAddChoice(event) {
        this.q.questionChoices.add({
            choice: this.state.choice,
            weight: this.state.weight
        });
        this.setState({ choice: "", weight: "" });
        event.preventDefault();
    }

    processResponse(response) {
        alert(response);
    }

    /**
     * Perform a PUT or POST request against the REST endpoint to update or create a question choice.
     *
     * @param choice JSON for a single question choice
     * @returns {Promise<q.questionChoices>}
     */
    async submitQuestionChoice(choice) {
        // Need to properly understand how to do these async requests.
        //https://dev.to/johnpaulada/synchronous-fetch-with-asyncawait
        console.log("Attempting to submit choice with body: ");
        console.log(choice);

        const qId = this.state.q.id;

        if(qId === null) {
            throw {
                name: "Question ID",
                message: "Found null value for question Id.\nAborting choice submit."
            };
        }

        let request = {
            method: (choice.id) ? 'PUT' : 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(choice)
        };

        console.log("Request to send for question choice: ");
        console.log(request);

        let response = await(await fetch(`/api/surveys/${this.props.surveyId}/questions/${qId}/choices`, request)).json();

        console.log("Submitted choice");
        console.log(response);
    }

    // Method to handle the submitting of question choices to the backend server
    //Helper method for handleSubmitQuestion method
    async handleSubmitQuestionChoices(choices) {
        console.log("Attempting to process choices...");
        // Will need to do request sequentially to figure what method needs to be done
        // i.e check if there is an ID available and determine if a PUT or POST request
        // needs to be done.
        choices.map(choice => this.submitQuestionChoice(choice));
    }

    /**
     * Send PUT/POST request to create new question or updated existing one.
     *
     * @param question
     * @returns {Promise<question>}
     */
    async handleSubmitQuestion(question) {
        console.log("Attempting to submit question...");

        // Check that the question value provided actually valid (not null or empty).
        if(!question.question) {
            throw {
                name: "Empty question string",
                message: "The question string provided was empty.\nEmpty strings are not allowed."
            };
        }

        let request = {
            method: (question.id) ? 'PUT' : 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(question)
        };

        console.log("Request body to send: ");
        console.log(request);

        const response = await(await fetch(`/api/surveys/${this.props.surveyId}/questions`, request)).json();

        console.log("Submitted new question to Survey Id: " + this.props.surveyId);
        console.log(response);

         this.setState({q: response});
    }

    async handleSubmitFullQuestion(event) {
        const {q, surveyId} = this.state;
        console.log("Attempting to submit question with question choices...");
        event.preventDefault();     // Stops the page from reloading.

        // Just check that survey id has been defined
        if(typeof surveyId === 'undefined')
            throw {
                name: "Survey ID",
                message: "Survey ID has not been defined.\nPlease specify a survey to add the question to."
            };

        // PUT/POST question, await to ensure that this method has finished executing before the next step.
        let questionPromise = await this.handleSubmitQuestion(q);


        // Now that the question has been created (if it hasn't already), PUT/POST the choices for the question
        let choicesPromise = await this.handleSubmitQuestionChoices(q.questionChoices);

        let request = {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            }
        };

        //Then do get request for the question now that both REST requests have finished
        let response = await(await fetch(`/api/surveys/${this.props.surveyId}/questions/${this.state.q.id}`, request)).json();

        console.log("Get request result: ");
        console.log(response);

        // Check if the ID exists and use that to check if which method to poke
        if(q.id === null) {
            // If the id was initially set to null, means we're dealing with a new question.
            // Reset this component with a blank question after adding to list.
            this.setState({q : {id: null, question: null, questionChoices: []}});
            this.props.addToList(response);
        }
        else {
            // Will also need to update the local state from the get to signify that any new choices have been accepted and have IDs set.
            this.setState({q: response});
            this.props.updateQuestion(this.state.q);
        }

    }

    /**
     * Basic method to just add an empty question choice to the state for editing purposes.
     */
    addEmptyChoice() {
        const {q} = this.state;
        q.questionChoices.push({
            id: null,
            choice: "new",
            weight: 0
        });

        this.setState({q:q})
    }

    //Snippet from: https://medium.freecodecamp.org/how-to-build-a-real-time-editable-datagrid-in-react-c13a37b646ec
    // https://dev.to/pmbanugo/real-time-editable-datagrid-in-react-56ad
    renderEditable = cellInfo => {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.q.questionChoices];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerText; // Just want to get the text value
                    this.setState({question:{questionChoices: data}});        // Set the updated questionChoices value
                    console.log(...this.state.q.questionChoices);
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.q.questionChoices[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    };

    render() {
        const {q} = this.state;
        const modalTitle = this.props.questionId ? "Edit Question" : "New Question";
        const buttonColor = this.props.questionId ? "primary" : "success";

        const columns = [{
            Header: 'Choice',
            accessor: 'choice',
            Cell: this.renderEditable
        }, {
            Header: 'Weight',
            accessor: 'weight',
            Cell: this.renderEditable
        }];

        return (
            <>
                <Button color={buttonColor} size="sm" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <Form onSubmit={this.handleSubmitFullQuestion}>
                        <ModalHeader toggle={this.toggle}>{modalTitle}</ModalHeader>

                        <ModalBody>
                            <Input type="text" name="question" id="question"  value={q.question || ''}
                                   onChange={this.handleQuestionChange} autoComplete="Type in your question here"/>
                            <Button color="success" onClick={this.addEmptyChoice}>Add new choice</Button>

                            {/*Using ReactTable as a method to display all of the items*/}
                            <ReactTable
                                data={q.questionChoices}
                                columns={columns}
                                defaultPageSize={4}
                                pageSizeOptions={[4, 8]}
                                />
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

SurveyQuestionEdit.defaultProps = {
    question: {
        id:null,
        question: null,
        questionChoices: []
    }
};

export default SurveyQuestionEdit;

