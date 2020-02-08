import React, {Component} from "react";
import "./Header.css";
import { Typography } from '@material-ui/core';


class Header extends Component{
    render(){
        return(
            <div>
              <header className='app-header'>
                <div className='header-text-logo'>
                <Typography variant="subtitle1" gutterBottom>
                    Image Viewer
                </Typography>
                </div>
              </header>
          </div>
        )
    }
}

export default Header;