import React, {Component} from "react";
import "./Login.css";
import Header from '../../common/Header/Header'
import {
    Card,
    CardActions,
    Typography,
    Button,
    CardContent,
    InputLabel, FormControl, Input, FormHelperText
} from '@material-ui/core';


class Login extends Component{
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
                            <Input id="username" type="text" />
                        </FormControl>
                        <br/><br/>
                        <FormControl required>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input id="password" type="password" />
                        </FormControl>
                        <br/><br/>
                        <Button id='loginButton' variant="contained" color="primary">LOGIN</Button>
                    </CardContent>

                </Card>
            </div>
        )
    }
}

export default Login;