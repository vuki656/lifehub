// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";

// Destructured Imports
import {
    Form,
    Grid,
    Message,
    Button,
    Icon,
    Header,
    Image,
    Segment
} from "semantic-ui-react";
import { Link } from "react-router-dom";

// File Imports
import { ReactComponent as Logo } from "../../files/logo.svg";

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

                        <Button
                            fluid
                            className={
                                loading
                                    ? "loading button-primary"
                                    : "button-primary"
                            }
                        >
                            Login
                        </Button>
                    </Form>
                    <div className="login-bottom-section">
                        <Icon name="help" />
                        Don't have an account?
                        <Link to="/register"> Register</Link>
                    </div>
                    {error !== "" && (
                        <Message negative>
                            <Message.Header>Error:</Message.Header>
                            {this.displayError(error)}
                        </Message>
                    )}
                </Grid.Column>
            </Grid>

            // <Grid
            //     textAlign="center"
            //     style={{ height: "100vh" }}
            //     verticalAlign="middle"
            // >
            //     <Grid.Column style={{ maxWidth: 450 }}>
            //         <div className="logo-section">
            //             <Logo className="logo" />
            //         </div>
            //         <Form onSubmit={this.handleSubmit}>
            //             <Form.Input
            //                 name="email"
            //                 icon="mail"
            //                 iconPosition="left"
            //                 fluid
            //                 placeholder="E-Mail"
            //                 required
            //                 type="email"
            //                 onChange={this.handleChange}
            //                 value={email}
            //             />
            //             <Form.Input
            //                 name="password"
            //                 icon="lock"
            //                 iconPosition="left"
            //                 fluid
            //                 placeholder="Password"
            //                 required
            //                 type="password"
            //                 onChange={this.handleChange}
            //                 value={password}
            //             />

            //             <Button fluid className={loading ? "loading" : ""}>
            //                 Login
            //             </Button>
            //         </Form>
            //         <Message info>
            //             <Icon name="help" />
            //             Don't have an account?
            //             <Link to="/register"> Register</Link>
            //         </Message>
            //         {error !== "" && (
            //             <Message negative>
            //                 <Message.Header>Error:</Message.Header>
            //                 {this.displayError(error)}
            //             </Message>
            //         )}
            //     </Grid.Column>
            // </Grid>
        );
    }
}

export default Login;
