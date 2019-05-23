import React from "react";
import firebase from "../../firebase/Auth";

import { Link } from "react-router-dom";
import { Form, Grid, Message, Button, Icon } from "semantic-ui-react";

class Register extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmaton: "",
        error: "",
        loading: false
    };

    // Handle form submit
    handleSubmit = event => {
        event.preventDefault();
        if (this.isPasswordValid(this.state)) {
            this.setState({ loading: true });
            firebase
                .auth()
                .createUserWithEmailAndPassword(
                    this.state.email,
                    this.state.password
                )
                .catch(error => {
                    this.setState({ error: error.message });
                });
            this.setState({ loading: false });
        }
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Check if passwords match and longer than 6 chars
    isPasswordValid = ({ password, passwordConfirmaton }) => {
        let currentError;

        if (password !== passwordConfirmaton) {
            currentError = "Passwords dont match.";
            this.setState({ error: currentError });
            return false;
        } else if (password.length <= 6 || passwordConfirmaton <= 6) {
            currentError =
                "Password is too short. It must be 7 or more characters.";
            this.setState({ error: currentError });
            return false;
        } else {
            return true;
        }
    };

    displayError = error => <p>{error}</p>;

    render() {
        const {
            username,
            email,
            password,
            passwordConfirmation,
            error,
            loading
        } = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="base">
                <Grid.Column className="register-form">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Input
                            name="username"
                            icon="user"
                            iconPosition="left"
                            fluid
                            placeholder="Username"
                            required
                            type="text"
                            onChange={this.handleChange}
                            value={username}
                        />
                        <Form.Input
                            name="email"
                            icon="mail"
                            iconPosition="left"
                            fluid
                            placeholder="E-Mail"
                            required
                            type="email"
                            onChange={this.handleChange}
                            value={email}
                        />
                        <Form.Input
                            name="password"
                            icon="lock"
                            iconPosition="left"
                            fluid
                            placeholder="Password"
                            required
                            type="password"
                            onChange={this.handleChange}
                            value={password}
                        />
                        <Form.Input
                            name="passwordConfirmaton"
                            icon="repeat"
                            iconPosition="left"
                            fluid
                            placeholder="Retype Password"
                            required
                            type="password"
                            onChange={this.handleChange}
                            value={passwordConfirmation}
                        />
                        <Button fluid className={loading ? "loading" : ""}>
                            Register
                        </Button>
                    </Form>
                    <Message info>
                        <Icon name="help" />
                        Already have an account?
                        <Link to="/login"> Login</Link>
                    </Message>
                    {error !== "" && (
                        <Message negative>
                            <Message.Header>Error:</Message.Header>
                            {this.displayError(error)}
                        </Message>
                    )}
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register;
