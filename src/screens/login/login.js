import React, {Component} from "react";
import "./login.css";
import Header from '../../common/Header/Header'
import {
    Button,
    Card,
    CardContent,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    Typography
} from '@material-ui/core';

class Login extends Component{
    /**Constructor to set state variables*/
    constructor() {
        super();
        this.state = {
            username: "",
            usernameRequired: "dispNone",
            password: "",
            passwordRequired: "dispNone",
            incorrectUsernamePassword: "dispNone"
        }
    }

    /**read username and password fields*/
    usernameChangeHandler = (e) => {
        this.setState({ username: e.target.value });
    };

    passwordChangeHandler = (e) => {
        this.setState({ password: e.target.value });
    };

    /**
     * Login click Handler
     * If valid username and password is provided,
     * then user access token is added to session Storage
     */
    loginClickHandler = () => {
        // Default username and password
        const validUser = "gopuk";
        const validPassword = "gopuk";
        // Upgrad user access token
        const accessToken = "8661035776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784";

        // Validate for empty field input data, show required red message
        // under the input fields
        this.state.username === "" ?
            this.setState({usernameRequired: "dispBlock"}) :
            this.setState({
                usernameRequired: "dispNone",
                incorrectUsernamePassword: "dispNone"
            });
        this.state.password === "" ?
            this.setState({passwordRequired: "dispBlock"}) :
            this.setState({
                passwordRequired: "dispNone",
                incorrectUsernamePassword: "dispNone"
            });

        // If any of the field is not empty and not valid,
        // then incorrect message should be thrown
        if ((this.state.username !== '' && this.state.password !== '')
            && (this.state.username !== validUser
                || this.state.password !== validPassword)) {
            this.setState({ incorrectUsernamePassword: "dispBlock" });
        } else if (this.state.username==='' || this.state.password===''){
            sessionStorage.removeItem("access-token");
        } else if (this.state.username === validUser
            && this.state.password === validPassword) {
            // Set access token in session storage and route to Home page
            this.setState({ incorrectUsernamePassword: "dispNone" });
            sessionStorage.setItem("access-token", accessToken);
            this.props.history.push("/home");
        }
    };

    render(){
        return(
            <div>
                <Header/>
                <Card className='loginCard' variant="outlined">
                    <CardContent className='loginCardContent'>
                        <Typography variant="h5" gutterBottom>
                            LOGIN
                        </Typography>
                        <br/>
                        <FormControl required>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input id="username" type="text" onChange={this.usernameChangeHandler}/>
                            <FormHelperText className={this.state.usernameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br/><br/>
                        <FormControl required>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input id="password" type="password" onChange={this.passwordChangeHandler}  />
                            <FormHelperText className={this.state.passwordRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <FormHelperText className={this.state.incorrectUsernamePassword}>
                            <span className="red">Incorrect username and/or password</span>
                        </FormHelperText>
                        <br/><br/>
                        <Button id='loginButton' variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
                    </CardContent>

                </Card>
            </div>
        )
    }
}

export default Login;