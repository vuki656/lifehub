// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";

// Destructured Imports
import { Grid, TextField, Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

// File Imports
import { ReactComponent as Logo } from "../../files/logo.svg";

class Login extends React.Component {
    state = {
        // Base
        email: "",
        password: "",
        error: ""
    };

    // Handle form submit
    handleSubmit = event => {
        event.preventDefault();
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch(error => {
                this.setState({ error: error.message });
            });
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Display error to the UI
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
                            label="Email"
                            name="email"
                            fullWidth
                            onChange={this.handleChange}
                            className="mar-bot-1-rem"
                        />
                        <TextField
                            required
                            name="password"
                            label="Password"
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
                                Login
                            </Button>
                        </Grid>
                        <Typography
                            variant="subtitle1"
                            align="center"
                            className="mar-bot-1-rem"
                        >
                            Don't have an account?{" "}
                            <Link to="/register">Register</Link>
                        </Typography>
                        {error !== "" && (
                            <Typography
                                color="error"
                                align="center"
                                className="mar-bot-1-rem"
                            >
                                Error
                                {this.displayError(error)}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Login;
