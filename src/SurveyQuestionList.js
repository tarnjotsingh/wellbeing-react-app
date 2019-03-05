import React, {Component} from 'react';
//import {Button, Container} from 'reactstrap'
//import {Link} from "react-router-dom";
import SurveyQuestionView from './SurveyQuestionView'
import SurveyQuestionEdit from "./SurveyQuestionEdit";


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

        // FETCH THE DATA!
        fetch(`/api/surveys/${nextProps.surveyId}/questions`)
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

    addToList(questionId, question) {
        let newQuestion = {id: questionId, question: question};
        // Concat to add the new question to the end of the list
        this.setState({questions: this.state.questions.concat(newQuestion)});
    }

    updateQuestionInList(question) {
        //question should be json object being passed through
        // Figure out the index of the object that needs to be updated
        let updatedQuestions = this.state.questions;
        console.log(question);
        const index = updatedQuestions.findIndex(q => q.id === question.id);

        console.log("Question with id: " + question.id + " found at index:" + index);
        console.log(updatedQuestions[index]);

        // Update the local question with the new json value
        updatedQuestions[index] = question;

        console.log("Updated Question to be saved to list locally: ");
        console.log(updatedQuestions[index]);

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
                    <p>
                        Will show all of the questions for a given survey here.
                        I think it will be a good idea to be able to click on each of the questions, have them
                        expand and show all of the potential choices and add choices to those questions.
                        Expansion may just be where you click on the question and there is
                        menu that expands underneath the question
                        that was clicked and have everything there or it will be to navigate to another page thing that, akin to how
                        it is currently being done for basic survey stuff, and edit everything there.
                    </p>
                </div>
                <br/>
                {questionList}
            </div>
        )
    }
}

export default SurveyQuestionList;