import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import { Link } from 'react-router-dom';

class AppNavbar extends Component {

    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        // Need to figure out what binding does in jsx
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        // I mean, will just toggle the value of this.isOpen :)
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {
        return (
            <Navbar color="dark" dark expand="md">
                <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
                <NavbarToggler onClick={this.toggle}/>
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink href="https://csgitlab.reading.ac.uk/gv009864">CS-GitLab</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        )
    }


}

export default AppNavbar;