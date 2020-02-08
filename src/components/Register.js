// Object Imports
import React from "react";
import firebase from "../firebase/Auth";
import moment from "moment";
// Destructured Imports
import { Link } from "react-router-dom";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
// File Imports
import { ReactComponent as Logo } from "../images/textLogo.svg";

class Register extends React.Component {
    state = {
        // Firebase
        userRef: firebase.database().ref("users"),

        // Base
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        error: "",
        loading: false
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
        const { error } = this.state;

        return (
            <Grid
                container
                alignItems="center"
                justify="center"
                style={{ minHeight: "100vh" }}
            >
                <Grid xs={4}>
                    <Grid xs={12} className="mar-bot-1-rem">
                        <Logo className="logo" />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            required
                            label="Username"
                            name="username"
                            fullWidth
                            onChange={this.handleChange}
                            className="mar-bot-1-rem"
                        />

                        <TextField
                            required
                            label="Email"
                            name="email"
                            fullWidth
                            onChange={this.handleChange}
                            className="mar-bot-1-rem"
                        />

                        <TextField
                            required
                            name="passwordConfirmation"
                            label="Password"
                            type="password"
                            fullWidth
                            onChange={this.handleChange}
                            className="mar-bot-1-rem"
                        />
                        <TextField
                            required
                            name="passwordConfirmation"
                            label="Repeat Password"
                            type="password"
                            fullWidth
                            onChange={this.handleChange}
                            className="mar-bot-1-rem"
                        />

                        <Grid container justify="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleSubmit}
                                className="mar-bot-1-rem"
                            >
                                Register
                            </Button>
                        </Grid>
                        <Typography
                            variant="subtitle1"
                            align="center"
                            className="mar-bot-1-rem"
                        >
                            Already have an account?
                            <Link to="/login"> Login</Link>
                        </Typography>
                        {error !== "" && (
                            <Typography
                                color="error"
                                align="center"
                                className="mar-bot-1-rem"
                            >
                                Error:
                                {this.displayError(error)}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Register;
