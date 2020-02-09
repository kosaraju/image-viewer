import React, {Component} from 'react';
import Header from '../../common/Header/Header';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import {withStyles} from '@material-ui/core';
import Modal from 'react-modal';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import './Profile.css';

const styles = () => ({
  editIcon: {
    marginLeft: '2%',
    width: '45px',
    height: '45px'
  },
  boldFont: {
    "font-weight": 600
  },
  fav: {
    padding: 0
  },
  cardHeader: {
    padding: '0 0 10px 10px'
  },
  addComment: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline"
  }
});

const TabContainer = function (props) {
  return (
      <Typography component="div" style={{padding: 0, textAlign: 'center'}}>
        {props.children}
      </Typography>
  );
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const imageModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    height: '60vh'
  }
};

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      isUserLoggedIn: sessionStorage.getItem('access-token') != null,
      accessToken: sessionStorage.getItem('access-token'),
      profilePicture: "",
      username: "",
      noOfPosts: 0,
      usersFollowed: 0,
      followedBy: 0,
      fullName: '',
      images: [],
      nameUpdateModalIsOpen: false,
      modifiedFullName: '',
      modifiedFullNameRequired: 'dispNone',
      imageModalIsOpen: false,
      selectedImage: {}
    }
  }

  componentDidMount() {
    if (this.state.isUserLoggedIn) {
      let thisComponent = this;
      let xhrProfile = new XMLHttpRequest();
      xhrProfile.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          let responseData = JSON.parse(this.response).data;
          thisComponent.setState({
            profilePicture: responseData.profile_picture,
            username: responseData.username,
            noOfPosts: responseData.counts.media,
            usersFollowed: responseData.counts.follows,
            followedBy: responseData.counts.followed_by,
            fullName: responseData.full_name
          })
        }
      });
      xhrProfile.open('GET',
          this.props.baseUrl + "?access_token=" + this.state.accessToken);
      xhrProfile.send();

      let xhrMedia = new XMLHttpRequest();
      xhrMedia.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          let responseData = JSON.parse(this.response).data;
          responseData.forEach(image => {
            image.caption.text = image.caption.text.split('\n');
            image.userComments = [];
            image.commentText = '';
          });
          thisComponent.setState({
            images: responseData
          });
        }
      });
      xhrMedia.open('GET', this.props.baseUrl + '/media/recent?access_token='
          + this.state.accessToken);
      xhrMedia.send();
    }
  }

  userNameEditHandler = () => {
    this.setState({
      modifiedFullName: '',
      modifiedFullNameRequired: 'dispNone',
      nameUpdateModalIsOpen: true
    });
  };

  gridImageClickHandler = (image) => {
    this.setState({selectedImage: image, imageModalIsOpen: true});
  };

  closeModalHandler = () => {
    this.setState({nameUpdateModalIsOpen: false, imageModalIsOpen: false});
  };

  fullNameChangeHandler = (event) => {
    this.setState({modifiedFullName: event.target.value})
  };

  updateFullNameClickHandler = () => {
    if (this.state.modifiedFullName === '') {
      this.setState({modifiedFullNameRequired: 'dispBlock'});
    } else {
      this.setState({
        fullName: this.state.modifiedFullName,
        nameUpdateModalIsOpen: false
      });
    }
  };

  likeButtonClickHandler = (image) => {
    if (image.user_has_liked) {
      if (image.likes.count > 0) {
        image.likes.count--;
      } else {
        image.likes.count = 0;
      }
    } else {
      image.likes.count++;
    }
    image.user_has_liked = !image.user_has_liked;
    this.setState({...this.state});
  };

  commentsChangeHandler = (event, image) => {
    this.setState({
      commentedImageId: image.id
    });
    image.commentText = event.target.value;
  };

  addCommentsClickHandler = (event, image) => {
    if (image.commentText !== '') {
      image.comments.count++;
      image.userComments.push({
        id: image.comments.count,
        text: image.commentText,
        username: this.state.username
      });
      image.commentText = '';
      // Set the state to update the content on page
      this.setState({...this.state});
    }
  };

  render() {
    const {classes} = this.props;
    let selectedImage = this.state.selectedImage;
    return (
        <div>
          <Header pageId="profile"
                  profilePicture={this.state.profilePicture} {...this.props} />
          <div className="profile-container">
            <div className="flex-container">
              <div className="profile-picture-section">
                <img src={this.state.profilePicture} className="profile-picture"
                     alt="Profile Pic"/>
              </div>
              <div className="details-section">
                <Typography variant="h5"
                            component="h5">{this.state.username}</Typography>
                <Typography component="p" className="stats-section">
                  <span>Posts: {this.state.noOfPosts}</span>
                  <span>Follows: {this.state.usersFollowed}</span>
                  <span>Followed By: {this.state.followedBy}</span>
                </Typography>
                <Typography variant="h6" component="h6">
                  {this.state.fullName}
                  <Fab color="secondary" className={classes.editIcon}
                       onClick={this.userNameEditHandler}><EditIcon/></Fab>
                </Typography>
                <Modal ariaHideApp={false}
                       isOpen={this.state.nameUpdateModalIsOpen}
                       contentLabel="Edit"
                       onRequestClose={this.closeModalHandler}
                       style={customStyles}>
                  <Typography variant="h5" component="h5">
                    Edit
                  </Typography><br/>
                  <TabContainer>
                    <FormControl required>
                      <InputLabel htmlFor="fullName">Full Name</InputLabel>
                      <Input id="fullName" type="text"
                             onChange={this.fullNameChangeHandler}/>
                      <FormHelperText
                          className={this.state.modifiedFullNameRequired}>
                        <span className="red">required</span>
                      </FormHelperText>
                    </FormControl><br/><br/>
                  </TabContainer><br/>
                  <Button variant="contained" color="primary"
                          onClick={this.updateFullNameClickHandler}>Update</Button>
                </Modal>
              </div>
            </div>
            <div className="images-grid-list">
              <GridList cellHeight={300} cols={3} className="grid-list-main">
                {this.state.images.map(image => (
                    <GridListTile key={image.id}
                                  onClick={() => this.gridImageClickHandler(
                                      image)}>
                      <img src={image.images.standard_resolution.url}
                           alt={image.id}/>
                    </GridListTile>
                ))}
              </GridList>
              <Modal ariaHideApp={false} isOpen={this.state.imageModalIsOpen}
                     contentLabel="view" onRequestClose={this.closeModalHandler}
                     style={imageModalStyles}>
                {selectedImage.images &&
                <div>
                  <div className="image-section">
                    <img src={selectedImage.images.standard_resolution.url}
                         className="image-post" alt={selectedImage.id}/>
                  </div>
                  <div className="right-section">
                    <CardHeader className={classes.cardHeader}
                                classes={{title: classes.boldFont}}
                                avatar={
                                  <Avatar
                                      src={selectedImage.user.profile_picture}>
                                  </Avatar>
                                }
                                title={selectedImage.user.username}>
                    </CardHeader>
                    <hr/>
                    <div className="content">
                      <Typography className={classes.boldFont}>
                        {selectedImage.caption.text[0]}
                      </Typography>
                      <Typography className="image-hash-tag">
                        {selectedImage.tags.map(tag => '#' + tag + ' ')}
                      </Typography>
                      <div className="comments-section">
                        {selectedImage.userComments !== null
                        && selectedImage.userComments.map(comment => (
                            <div
                                key={selectedImage.id + "comment" + comment.id}>
                              <Typography>
                                <span
                                    className="comment-username">{comment.username}:&nbsp;</span>
                                <span
                                    className="comment-text">{comment.text}</span>
                              </Typography>
                            </div>
                        ))}
                      </div>
                      <div className="likes-add-comment-section">
                        <IconButton onClick={() => this.likeButtonClickHandler(
                            selectedImage)} className={classes.fav}>
                          {selectedImage.user_has_liked
                              ? <FavoriteIcon fontSize="large" color='error'/>
                              : <FavoriteBorderIcon fontSize="large"
                                                    className="favorite-icon"/>
                          }
                        </IconButton>
                        <Typography className="likes-count">
                          {selectedImage.likes.count === 1
                              ? <span>{selectedImage.likes.count} like</span>
                              : <span>{selectedImage.likes.count} likes</span>
                          }
                        </Typography>
                        <div className="add-comments-section">
                          <FormControl className={classes.addComment}>
                            <InputLabel htmlFor="comments">Add a
                              comment</InputLabel>
                            <Input id={"comments" + selectedImage.id}
                                   className="comments-input"
                                   onChange={(event) => this.commentsChangeHandler(
                                       event, selectedImage)}
                                   value={selectedImage.commentText}/>
                            <Button variant="contained" color="primary"
                                    onClick={(event) => this.addCommentsClickHandler(
                                        event, selectedImage)}>ADD</Button>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                }
              </Modal>
            </div>
          </div>
        </div>
    );
  }
}

export default withStyles(styles)(Profile);