import React, {Component} from 'react';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {Link, Redirect} from 'react-router-dom';
import './Header.css';

/** Header Component for logo, Search Box and Profile Icon menu when the user
 * logs in and dynamically make searchbox and ProfileIcon invisible when user logsout*/
class Header extends Component {

  constructor() {
    super();
    this.state = {
      isUserLoggedIn: sessionStorage.getItem('access-token') != null,
      showMenu: false
    }
  }

  searchBoxChangeHandler = (event) => {
    this.props.searchBoxChangeHandler(event.target.value);
  };

  profilePictureClickHandler = (event) => {
    this.setState({
      showMenu: !this.state.showMenu,
      anchorEl: this.state.anchorEl != null ? null : event.currentTarget
    });
  };

  myAccountClickHandler = () => {
    this.props.history.push("/profile");
  };

  logoutClickHandler = () => {
    sessionStorage.removeItem('access-token');
    this.setState({
      isUserLoggedIn: false
    });
  };

  render() {
    return (
        <div className='app-header'>
          {
            !this.state.isUserLoggedIn && <Redirect to='/'/>
          }
          <Link to="/home" className="logo">Image Viewer</Link>
          {this.state.isUserLoggedIn &&
          <div className="header-right-content">
            {this.props.pageId === 'home' &&
            <div className="search-box-header">
              <SearchIcon className="search-icon"/>
              <Input placeholder="Search..." disableUnderline={true}
                     className="search-box"
                     onChange={this.searchBoxChangeHandler}/>
            </div>
            }
            <IconButton className="profile-picture-icon"
                        onClick={this.profilePictureClickHandler}>
              <img src={this.props.profilePicture} alt="Profile Pic"
                   className="profile-pic"/>
            </IconButton>
            <Menu
                id="profile-menu"
                anchorEl={this.state.anchorEl}
                keepMounted
                open={this.state.showMenu}
                onClose={this.profilePictureClickHandler}
                className="profile-options-menu">
              {this.props.pageId === 'home' &&
              <div>
                <MenuItem onClick={this.myAccountClickHandler}>
                  <span className="menu-option">My Account</span>
                </MenuItem>
                <hr/>
              </div>
              }
              <MenuItem onClick={this.logoutClickHandler}>
                <span className="menu-option">Logout</span>
              </MenuItem>
            </Menu>
          </div>
          }
        </div>
    );
  }
}

export default Header;