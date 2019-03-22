import React, {Component} from 'react';
//import {Button, Container} from 'reactstrap'
//import {Link} from "react-router-dom";
import SurveyQuestionView from './SurveyQuestionView'
import SurveyQuestionEdit from "./SurveyQuestionEdit";
import {defaultAuthHeaders} from "../../service/AuthService";


class SurveyQuestionList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questions: [ ],
            surveyId: '',
            show: false
        };
    }

    /** To fetch the surveyId prop passed into this component so that a get request
     *  for the given surveyId can be done.
     *  i.e. /api/surveys/{surveyId}/questions
     *
     * @param nextProps
     * @param nextContext
     */
    async componentWillReceiveProps(nextProps, nextContext) {
        this.setState({surveyId: nextProps.surveyId});
        console.log("Detected survey id: " + this.state.surveyId);
        let request = {
            method: 'GET',
            headers: {'Authorization': localStorage.getItem("bearer")}
        };
        // FETCH THE DATA!
        fetch(`/api/surveys/${nextProps.surveyId}/questions`, request)
            .then(request => request.json())
            .then(data => this.setState({questions: data}));

         console.log("Fetched Questions");
         console.log(this.state.questions);
    }

    /**
     * Send a REST request to remove the specified question.
     */
    async removeQuestion(surveyId, id) {
        console.log("Remove question: " + id);
        console.log(...this.state.questions);
        // Get the survey id in question
        // => thing is basically like doing lambdas
        await fetch(
            `/api/surveys/${surveyId}/questions/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(() => {
            let updatedQuestions = [...this.state.questions].filter(i => i.id !== id);
            this.setState({questions: updatedQuestions})
        });
    }

    addToList(question) {
        // Concat to add the new question to the end of the list
        console.log("Adding new question to the question list");
        this.setState({questions: this.state.questions.concat(question)});
    }

    updateQuestionInList(question) {
        console.log("Updating question in list...");
        //question should be json object being passed through
        // Figure out the index of the object that needs to be updated
        let updatedQuestions = this.state.questions;
        console.log(question);
        const index = updatedQuestions.findIndex(q => q.id === question.id);

        console.debug("Question with id: " + question.id + " found at index:" + index);
        console.debug(updatedQuestions[index]);

        // Update the local question with the new json value
        //updatedQuestions[index] = question;
        updatedQuestions[index] = question;

        console.debug("Updated Question to be saved to list locally: ");
        console.debug(updatedQuestions[index]);

        // Apply the updated list to the local state
        this.setState({questions: updatedQuestions});
    }

    render() {
        const {surveyId, questions} = this.state;

        let questionList = questions.map(q => {
           return <SurveyQuestionView key={q.id + surveyId} surveyId={surveyId}
                                      questionId={q.id} removeHandler={this.removeQuestion.bind(this)}
                                      updateQuestionInList={this.updateQuestionInList.bind(this)}/>
        });

        return (
            <div>
                <div>
                    <h3>Questions</h3>
                    {/*<Button size="sm" color="success" onClick={() => this.questionEdit.toggle}>New</Button>*/}
                    <SurveyQuestionEdit surveyId={surveyId} buttonLabel="New" addToList={this.addToList.bind(this)}/>
                </div>
                <br/>
                {questionList}
            </div>
        )
    }
}

export default SurveyQuestionList;