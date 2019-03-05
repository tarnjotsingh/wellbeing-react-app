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

    handleQuestionChoiceChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        let tempQuestion = {...this.state.q};
        tempQuestion["questionChoices"][name] = value;

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

        const response = await(await fetch(`/api/surveys/${this.props.surveyId}/questions`, request)).json();

        console.log("Submitted new question to Survey Id: " + this.props.surveyId);
        console.log("Response: ");
        console.log(response);

        // Update the list of questions accordingly.
        if(request.method === 'PUT')
            this.props.updateQuestion(response);
        else
            this.props.addToList(response.id, response);
    }

    //Snippet from: https://medium.freecodecamp.org/how-to-build-a-real-time-editable-datagrid-in-react-c13a37b646ec
    renderEditable = cellInfo => {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.q.questionChoices];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({question:{questionChoices: data}});
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
            Header: 'ID',
            accessor: 'id',
            Cell: this.renderEditable
        }, {
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
                    <Form onSubmit={this.handleSubmitQuestion}>
                        <ModalHeader toggle={this.toggle}>{modalTitle}</ModalHeader>

                        <ModalBody>
                            <Input type="text" name="question" id="question"  value={q.question || ''}
                                   onChange={this.handleQuestionChange} autoComplete="Type in your question here"/>

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

