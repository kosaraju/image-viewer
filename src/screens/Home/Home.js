import React, {Component} from 'react';
import Header from '../../common/Header/Header';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import {CardContent} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import './Home.css';

const styles = () => ({
  gridContainer: {
    width: "90%",
    margin: "0px auto 0px auto"
  },
  cardContentImg: {
    width: "100%"
  },
  boldFont: {
    "font-weight": 600
  },
  fav: {
    padding: 0
  },
  addComment: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline"
  }
});

class Home extends Component {
  constructor() {
    super();
    this.state = {
      isUserLoggedIn: sessionStorage.getItem('access-token') != null,
      accessToken: sessionStorage.getItem('access-token'),
      profilePicture: '',
      username: '',
      postedImages: [],
      displayImages: [],
      commentedImageId: ''
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
            username: responseData.username
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
            image.created_time = thisComponent.parseTimestamp(
                image.created_time);

            image.caption.text = image.caption.text.split('\n');
            image.userComments = [];
            image.commentText = '';
          });
          thisComponent.setState({
            postedImages: responseData,
            displayImages: responseData,
            commentText: ''
          });
        }
      });
      xhrMedia.open('GET', this.props.baseUrl + '/media/recent?access_token='
          + this.state.accessToken);
      xhrMedia.send();
    } else {
      console.log(
          'user is not logged in, taken care by isUserLoggedin State change in header');
    }
  }

  parseTimestamp = (time) => {
    let dateTime = new Date(time * 1000);
    return this.formatNums(dateTime.getDate()) + '/' +
        this.formatNums(dateTime.getMonth() + 1) + '/' +
        dateTime.getFullYear() + ' ' + dateTime.getHours() + ':'
        + dateTime.getMinutes() + ':' +
        dateTime.getSeconds();
  };

  formatNums = (num) => {
    if (num <= 9) {
      return '0' + num;
    }
    return num;
  };

  searchBoxChangeHandler = (searchText) => {
    let displayImages = (searchText === "")
        ? this.state.postedImages
        : this.state.postedImages.filter(
            image => image.caption.text[0].toLowerCase().includes(
                searchText.toLowerCase())
                || image.caption.text[1].toLowerCase().includes(
                    searchText.toLowerCase()));
    // Set the state to update the content on page
    this.setState({displayImages: displayImages});
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
    return (
        <div>
          <Header pageId="home"
                  profilePicture={this.state.profilePicture} {...this.props}
                  searchBoxChangeHandler={this.searchBoxChangeHandler}/>
          <Grid container spacing={3} className={classes.gridContainer}>
            {this.state.displayImages.map(image => (
                <Grid key={"post" + image.id} item xs={12} sm={6}>
                  <Card>
                    <CardHeader
                        classes={{title: classes.boldFont}}
                        avatar={
                          <Avatar
                              src={image.caption.from.profile_picture}
                              className="">
                          </Avatar>
                        }
                        title={image.caption.from.username}
                        subheader={image.created_time}>
                    </CardHeader>
                    <CardContent>
                      <img src={image.images.standard_resolution.url} alt="post"
                           className={classes.cardContentImg}/>
                      <hr className="line-separator"/>
                      <Typography className={classes.boldFont}>
                        {image.caption.text[0]}
                      </Typography>
                      <Typography className="image-hash-tag">
                        {image.caption.text[1]}
                      </Typography>
                      <IconButton
                          onClick={() => this.likeButtonClickHandler(image)}
                          className={classes.fav}>
                        {image.user_has_liked
                            ? <FavoriteIcon fontSize="large" color='error'/>
                            : <FavoriteBorderIcon fontSize="large"
                                                  className="favorite-icon"/>
                        }
                      </IconButton>
                      <Typography className="likes-count">
                        {image.likes.count === 1
                            ? <span>{image.likes.count} like</span>
                            : <span>{image.likes.count} likes</span>
                        }
                      </Typography>
                      <div className="comments-section">
                        {image.userComments !== null && image.userComments.map(
                            comment => (
                                <div key={image.id + "comment" + comment.id}>
                                  <Typography>
                                    <span
                                        className="comment-username">{comment.username}:&nbsp;</span>
                                    <span
                                        className="comment-text">{comment.text}</span>
                                  </Typography>
                                </div>
                            ))}
                      </div>
                      <div className="add-comments-section">
                        <FormControl className={classes.addComment} fullWidth>
                          <InputLabel htmlFor="comments">Add a
                            comment</InputLabel>
                          <Input id={"comments" + image.id}
                                 className="comments-input"
                                 onChange={(event) => this.commentsChangeHandler(
                                     event, image)}
                                 value={image.id === this.state.commentedImageId
                                     ? image.commentText : ''}>
                          </Input>
                          <Button variant="contained" color="primary"
                                  onClick={(event) => this.addCommentsClickHandler(
                                      event, image)}>ADD</Button>
                        </FormControl>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
            ))}
          </Grid>
        </div>
    );
  }
}

export default withStyles(styles)(Home);