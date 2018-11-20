import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actualField: 0,
      answers: [],
      error: "",
      login: "",
      password: [],
      stage: 0,
      time: 0
    };
  }
  _countToZero = () => {
    const myTimer = setInterval(() => {
      if (this.state.time === 0) {
        clearInterval(myTimer);
        this.setState({
          error: ""
        });
        return;
      }
      this.setState(
        prevState => ({
          time: prevState.time - 1
        }),
        () => {
          if (this.state.time === 0) {
            clearInterval(myTimer);
            this.setState({
              error: ""
            });
          }
        }
      );
    }, 1000);
  };
  onChange = event => {
    this.setState({
      login: event.target.value
    });
  };
  onClick = () => {
    const { onLogin } = this.props;
    const { login, stage, password } = this.state;
    switch (stage) {
      case 0:
        axios({
          baseURL: "http://localhost:5000/Ps12.php",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "*"
          },
          auth: {
            username: login
          }
        })
          .then(response => {
            console.log(response);
            if (response.status === 200) {
              console.log("Response 200", response);
              if (response.data.maska !== undefined) {
                // onLogin(usernameValue, passwordValue, response.data);
                this.setState({
                  answers: response.data.maska.split(","),
                  stage: 1
                });
              } else {
                console.log(response.data.info);
                this.setState(
                  {
                    error: response.data.info || "Something wrong",
                    time: Math.floor(response.data.time) || 0
                  },
                  this._countToZero()
                );
              }
            } else {
              this.setState({
                error: "Something wrong"
              });
            }
          })
          .catch(error => {
            console.log(error.response.status);
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
        break;
      case 1:
        const canEditOnlyNamesNewLabels = password.map(value => value && value);
        const canEditObjectFinal = Object.assign({}, canEditOnlyNamesNewLabels);
        axios({
          baseURL: "http://localhost:5000/Ps13.php",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "*"
          },
          auth: {
            username: login
            // password: password.join("")
          },
          params: canEditObjectFinal
        })
          .then(response => {
            console.log(response);
            if (response.status === 200) {
              console.log("Response 200", response);
              if (response.data.token !== undefined) {
                onLogin(login, response.data);
                this.setState({
                  password: [],
                  stage: 0
                });
              } else {
                console.log(response.data.info);
                this.setState(
                  {
                    error: response.data.info || "Something wrong",
                    time: Math.floor(response.data.time) || 0,
                    password: [],
                    stage: 0
                  },
                  this._countToZero()
                );
              }
            } else {
              this.setState({
                error: "Something wrong",
                password: [],
                stage: 0
              });
            }
          })
          .catch(error => {
            console.log(error.response.status);
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
        break;
      default:
        break;
    }
  };
  onChangeOne = (event, index) => {
    const { password } = this.state;
    password[index] = event.target.value;
    this.setState({
      password
    });
  };
  renderAnswer = (item, index) => {
    const { answers } = this.state;
    const chosenFields = answers.includes(`${index}`);
    const StyledTextField = withStyles({
      root: {
        background: "linear-gradient(45deg, silver 30%, grey 90%)"
      }
    })(TextField);

    if (chosenFields) {
      return (
        <TextField
          label={`${index + 1}`}
          inputProps={{
            maxLength: 1,
            size: 1
          }}
          variant="outlined"
          onChange={event => this.onChangeOne(event, index)}
          type="password"
        />
      );
    } else {
      return (
        <StyledTextField
          disabled
          inputProps={{
            maxLength: 1,
            size: 1
          }}
          variant="outlined"
          type="password"
        />
      );
    }
  };
  render() {
    const { error, stage, time } = this.state;
    const fields = [...Array(16).keys()];
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
          {stage === 0 ? (
            <Grid item>
              <TextField
                autoFocus
                placeholder="login"
                onChange={event => this.onChange(event)}
              />
            </Grid>
          ) : (
            <Grid item>{fields.map(this.renderAnswer)}</Grid>
          )}
          <Grid item>{error && <Chip color="secondary" label={error} />}</Grid>
          <Grid item>
            {time !== 0 && <Chip color="secondary" label={`${time} s`} />}
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={this.onClick}>
              Login
            </Button>
          </Grid>
        </Grid>
      </Card>
    );
  }
}

export default LoginPage;
