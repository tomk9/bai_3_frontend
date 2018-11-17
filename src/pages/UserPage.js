import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      newPassword: "",
      repPassword: "",
      password: ""
    };
  }

  onClickLogout = () => {
    const { onLogout } = this.props;
    // this.setState({
    //   user: ""
    // });
    onLogout();
  };
  onClick = event => {
    const { user, token } = this.props;
    const { newPassword, repPassword, password } = this.state;
    const value = event.target.value;
    if (newPassword === repPassword) {
      axios({
        method: "post",
        baseURL: "http://localhost:5000/Ps14.php",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authentication: token
        },
        auth: {
          username: user,
          password: password
        },
        data: {
          new_password: newPassword
        }
      })
        .then(response => {
          // console.log(response);
          if (response.status === 200) {
            // console.log("Response 200");
            if (response.data.name !== undefined) {
              this.setState({
                value: value,
                error: ""
              });
            } else {
              // console.log(response.data.info);
              this.setState({
                error: response.data.info || "Something wrong"
              });
            }
          } else {
            this.setState({
              error: "Something wrong"
            });
          }
        })
        .catch(error => {
          // console.log(error.response.status);
          if (error.response.status === 401) {
            this.setState({
              error: error.response.statusText
            });
          } else {
            this.setState({
              error:
                error.response !== undefined
                  ? error.response.data.error
                  : error.toString()
            });
          }
        });
    } else {
      this.setState({
        error: "Enter the same password twice",
        open: true
      });
    }
  };
  onChangePass = event => {
    this.setState({
      password: event.target.value
    });
  };
  onChangeNew = event => {
    this.setState({
      newPassword: event.target.value
    });
  };
  onChangeRep = event => {
    this.setState({
      repPassword: event.target.value
    });
  };

  render() {
    const { user } = this.props;
    const { error } = this.state;
    return (
      <Card>
        <Grid
          direction="column"
          container
          justify="center"
          alignItems="center"
          spacing={16}
          style={{ padding: 40 }}
        >
          <Grid item>
            <Typography variant="title" color="inherit">
              {user}
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              autoFocus
              placeholder="old password"
              onChange={event => this.onChangePass(event)}
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder="new password"
              onChange={event => this.onChangeNew(event)}
            />
          </Grid>
          <Grid item>
              <TextField
                placeholder="repeat new password"
                onChange={event => this.onChangeRep(event)}
              />
          </Grid>
          <Grid item>{error && <Chip color="secondary" label={error} />}</Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={this.onClick}>
              Change password
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={this.onClickLogout}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Card>
    );
  }
}

export default UserPage;
