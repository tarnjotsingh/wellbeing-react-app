import React, {Component} from 'react'
import {Button, ButtonGroup, Table} from 'reactstrap';
import SurveyQuestionEdit from "./SurveyQuestionEdit";

class SurveyQuestionView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: {
                id: '',
                question: '',
                questionChoices: []
            },
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

    /**
     * Called from child component to update the values displayed in this component.
     * Calls updateQuestionInList in parent component SurveyQuestionList
     *
     * @param question - Question object to use to update this components values with.
     */
    updateQuestion(question) {
        this.props.updateQuestionInList(question);
        this.setState({question: question});
    }

    render() {
        const {question} = this.state;
        // Return rows for each of the questions
        const choices = question.questionChoices.map(c => {
            return (
                <tr key={c.id}>
                    <th>{c.id}</th>
                    <td>{c.choice}</td>
                    <td>{c.weight}</td>
                </tr>
            )
        });

        return (
            <div key={question.id}>
                <h5>{question.question}</h5>
                <ButtonGroup>
                    <SurveyQuestionEdit buttonLabel="Edit"
                                        surveyId={this.props.surveyId}
                                        questionId={this.props.questionId}
                                        question={question}
                                        updateQuestion={this.updateQuestion.bind(this)}/>
                    {' '}
                    <Button size="sm" color="danger" onClick={() => this.props.removeHandler(1, question.id)}>Delete</Button>
                </ButtonGroup>
                {/*Basically want to make this table show all of the choices for each of the questions and make them editable.*/}
                <Table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Choice</th>
                        <th>Weight</th>
                    </tr>
                    </thead>

                    {/*Use the mapped result from the choices function as the body.*/}
                    <tbody>
                    {choices}
                    </tbody>
                </Table>
                <br/>
            </div>
        );
    }
}

export default SurveyQuestionView;