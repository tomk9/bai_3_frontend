import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      newPassword: "",
      repPassword: "",
      password: "",
      value: props.data.block_after
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
                error: "",
                newPassword: "",
                repPassword: "",
                password: ""
              });
            } else {
              // console.log(response.data.info);
              this.setState({
                error: response.data.info || "Something wrong",
                newPassword: "",
                repPassword: "",
                password: ""
              });
            }
          } else {
            this.setState({
              error: "Something wrong",
              newPassword: "",
              repPassword: "",
              password: ""
            });
          }
        })
        .catch(error => {
          // console.log(error.response.status);
          if (error.response.status === 401) {
            this.setState({
              error: error.response.statusText,
              newPassword: "",
              repPassword: "",
              password: ""
            });
          } else {
            this.setState({
              error:
                error.response !== undefined
                  ? error.response.data.error
                  : error.toString(),
              newPassword: "",
              repPassword: "",
              password: ""
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

  _onSelect = event => {
    const { user, token } = this.props;
    const value = event.target.value;

    axios({
      baseURL: "http://localhost:5000/Ps15.php",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
        Authentication: token
      },
      auth: {
        username: user
      },
      params: {
        par: value
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
  };

  render() {
    const { data } = this.props;
    const { error, newPassword, repPassword, password, value } = this.state;
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
            <Typography variant="h3" color="inherit">
              {data.name}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" color="inherit">
              Last login: {data.last_login}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" color="inherit">
              Last failed login: {data.last_failed_login}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" color="inherit">
              Failed attemps login: {data.failed_attemps_login}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" color="inherit">
              Block after:
              <Select value={value} onChange={this._onSelect}>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
              </Select>
              failed attemps
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              autoFocus
              placeholder="old password"
              onChange={event => this.onChangePass(event)}
              value={password}
              type="password"
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder="new password"
              onChange={event => this.onChangeNew(event)}
              value={newPassword}
              type="password"
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder="repeat new password"
              onChange={event => this.onChangeRep(event)}
              value={repPassword}
              type="password"
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
