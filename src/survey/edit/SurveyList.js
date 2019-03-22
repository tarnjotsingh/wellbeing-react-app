/*
 React is all about components.
 We do not want to render everything under the main App.js, keeping things clean.
 */

import React, {Component} from "react";
import { Button, ButtonGroup, Container, Table} from 'reactstrap';
import AppNavbar from '../../AppNavbar';
import { Link } from 'react-router-dom'

class SurveyList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            surveys: this.props.surveys,
            isLoading: true
        };
        this.remove = this.remove.bind(this);
    }

    //Load the surveys into this component
    async componentDidMount() {
        console.log("Getting survey list...");
        this.setState({isLoading: true});
        // Fetch the surveys from the REST endpoint and store locally
        // Set the isLoading flag to false.
        let request = {
            method: 'GET',
            headers: {'Authorization': localStorage.getItem('bearer')},
        };
        console.log(request);
        let response = await fetch('api/surveys', request)
            .then(response => {
                return response.json();
            })
            .then(data => this.setState({surveys: data, isLoading: false}));
        console.log(response);

        //console.log(this.state.surveys);
    }


    // Remove a survey
    async remove(id) {
        // Get the survey id in question
        // => thing is basically like doing lambdas
        await fetch(
            `api/surveys/${id}`,
            {
                method: 'DELETE',
                headers: {'Authorization': localStorage.getItem('bearer')}
            }).then(() => {
                let updatedSurveys = [...this.state.surveys].filter(i => i.id !== id);
                this.setState({surveys: updatedSurveys})
        });
    }

    render() {
        const {surveys, isLoading} = this.state;

        if(isLoading) {
            return <p>Loading...</p>
        }

        // List out all of the survey entries from the returned surveys JSON
        const surveyList = surveys.map(survey => {

            //const surveyDetails = `${survey.name || '' } ${survey.description || ''}`;

            return <tr key={survey.id}>
                <td style={{whiteSpace: 'nowrap'}}>{survey.name}</td>
                <td>{survey.description}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/surveys/" + survey.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(survey.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>

        });

        /* Main stuff to return.
           Will return bootstrap container with formatted table to nicely display the
           data retrieved from REST endpoint. */
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/surveys/new">Add Survey</Button>
                    </div>

                    <h3 className="mt-4">Surveys view test</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="20%">Name</th>
                                <th width="50%">Description</th>
                                <th width="10%">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {surveyList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        )
    }
}

// Export the class so that it can be used elsewhere when it's imported.
export default SurveyList;

SurveyList.defaultProps = {
    surveys: [{id:0, name:"Nothing loaded yet"}, {id:1, name:"Nothing loaded yet"}],
    isLoading: true
};