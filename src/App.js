import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      user: ""
    };
  }
  onLogin = (user, data) => {
    this.setState({
      user,
      data
    });
  };
  onLogout = () => {
    this.setState({
      user: "",
      data: {}
    });
  };
  render() {
    const { data, user } = this.state;
    return (
      <Grid container direction="column" justify="center" alignItems="center" style={{padding: 40}}>
        {user === "" ? (
          <LoginPage onLogin={this.onLogin} />
        ) : (
          <UserPage
            onLogout={this.onLogout}
            user={user}
            token={data.token}
            data={data}
          />
        )}
      </Grid>
    );
  }
}

export default App;
