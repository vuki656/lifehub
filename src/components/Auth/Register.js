// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";
import moment from "moment";

// Destructured Imports
import { Link } from "react-router-dom";
import { Form, Grid, Message, Button, Icon } from "semantic-ui-react";

// File Imports
import { ReactComponent as Logo } from "../../files/logo.svg";

class Register extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        error: "",
        loading: false,
        userRef: firebase.database().ref("users")
    };

    // Create a user and save the register date
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
                .then(createdUser => {
                    createdUser.user.updateProfile({
                        displayName: this.state.username
                    });
                    this.saveRegDate(createdUser.user);
                })
                .catch(error => {
                    console.error(error);
                    this.setState({ error: error.message });
                });
            this.setState({ loading: false });
        }
    };

    // Save users register date in firebase
    saveRegDate = user => {
        const { userRef } = this.state;
        let regDate = moment().valueOf();

        userRef
            .child(user.uid)
            .set({ regDate: regDate })
            .catch(err => {
                console.error(err);
            });
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Check if passwords match and longer than 6 chars
    isPasswordValid = ({ password, passwordConfirmation }) => {
        let currentError;

        if (password !== passwordConfirmation) {
            currentError = "Passwords don't match.";
            this.setState({ error: currentError });
            return false;
        } else if (password.length <= 6 || passwordConfirmation <= 6) {
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
            <Grid
                style={{ height: "100vh" }}
                textAlign="center"
                verticalAlign="middle"
                className="base"
            >
                <Grid.Column className="max-w-30-p">
                    <div className="logo-section">
                        <Logo className="logo" />
                    </div>
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
                            name="passwordConfirmation"
                            icon="repeat"
                            iconPosition="left"
                            fluid
                            placeholder="Retype Password"
                            required
                            type="password"
                            onChange={this.handleChange}
                            value={passwordConfirmation}
                        />
                        <Button
                            fluid
                            className={
                                loading
                                    ? "loading button-primary"
                                    : "button-primary"
                            }
                        >
                            Register
                        </Button>
                    </Form>
                    <div className="login-bottom-section">
                        <Icon name="help" />
                        Already have an account?
                        <Link to="/login"> Login</Link>
                    </div>
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
