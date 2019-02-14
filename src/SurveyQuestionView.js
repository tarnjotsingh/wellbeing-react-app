import React, {Component} from 'react'
import {Button, ButtonGroup, Table} from 'reactstrap';
import SurveyQuestionEdit from "./SurveyQuestionEdit";

class SurveyQuestionView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            surveyId: '',
            questionId: '',
            question: {},
            modal: false
        };

        //this.toggle = this.toggle.bind(this);
    }

    async componentWillMount() {
        // Fetch the question!
        const fetchedQuestion =  await (await fetch(`/api/surveys/${this.props.surveyId}/questions/${this.props.questionId}`)).json();
        this.setState({question: fetchedQuestion});
        console.log("Fetched question: ");
        console.log(this.state.question);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // Need the surveyId and the questionId to build the correct url to fetch the correct question.
        this.setState({
            surveyId: nextProps.surveyId,
            questionId: nextProps.questionId
        });
    }

    updateQuestion(questionId, question) {
        this.props.updateQuestionInList(questionId, question);
        let tmp = {
            id: questionId,
            question: question
        };
        this.setState({question: tmp});
    }

    render() {
        const {surveyId, questionId, question} = this.state;
        // Return rows for each of the questions
        // const choices = questionChoices.map(c => {
        //     return (
        //         <tr>
        //             <th>{c.id}</th>
        //             <td>{c.choice}</td>
        //             <td>{c.weight}</td>
        //         </tr>
        //     )
        // });
        //console.log("Question Id: " + questionId);
        return (
            <div key={question.id}>
                <h5>{question.question}</h5>
                <ButtonGroup>
                    {/*Hitting edit can bring up a modal thing that will let the user edit the question without navigating to another screen*/}
                    {/*<Button size="sm" color="primary" tag={Link} to={'/surveys/'}>Edit</Button>*/}
                    {/*<Button size="sm" color="primary" onClick={this.hmm}>Edit</Button>*/}
                    {/*<SurveyQuestionEdit surveyId={surveyId} questionId={questionId} buttonLabel="Edit"/>*/}
                    <SurveyQuestionEdit buttonLabel="Edit"
                                        surveyId={this.props.surveyId}
                                        questionId={this.props.questionId}
                                        question={question.question}
                                        updateQuestion={this.updateQuestion.bind(this)}/>
                    {' '}
                    <Button size="sm" color="danger" onClick={() => this.props.removeHandler(1, question.id)}>Delete</Button>
                </ButtonGroup>
                <Table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Choice</th>
                        <th>Weight</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>First choice</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Second choice</td>
                        <td>2</td>
                    </tr>
                    </tbody>
                </Table>
                <br/>
            </div>
        );
    }
}

export default SurveyQuestionView;