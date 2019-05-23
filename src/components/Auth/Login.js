import React from "react";
import firebase from "../../firebase/Auth";

import { Form, Grid, Message, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

class Login extends React.Component {
    state = {
        email: "",
        password: "",
        error: "",
        loading: false
    };

    // Handle form submit
    handleSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch(error => {
                this.setState({ error: error.message });
            });
        this.setState({ loading: false });
    };

    // Set the state value from user input
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    displayError = error => <p>{error}</p>;

    render() {
        const { email, password, error, loading } = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="base">
                <Grid.Column className="login-form">
                    <Form onSubmit={this.handleSubmit} className="segment">
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

                        <Button fluid className={loading ? "loading" : ""}>
                            Login
                        </Button>
                    </Form>
                    <Message info>
                        <Icon name="help" />
                        Don't have an account?
                        <Link to="/register"> Register</Link>
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

export default Login;
