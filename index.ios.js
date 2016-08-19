/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';

class LeButton extends Component {
  constructor(props) {
    super(props);

    this.runningPing = false;
    this.state = {
      isLoading: false,
      serverAlive: false,
    };
  }

  ping(retry) {
    this.setState({isLoading: true, serverAlive: false});
    fetch("http://411.fooo.fr:4242/con-nas", {method: 'get'})
    .then((response) => response.json())
    .then((json) => {
      this.setState(
        {
          isLoading: false,
          serverAlive: json.isAlive,
        });
        if (retry && !json.isAlive) {
          setTimeout(this.ping.bind(this, --retry), 1000);
        }
    }).catch((error) => {
      console.log(error);
    }).done()

  }

  start() {
    this.setState({isLoading: false});
    fetch("http://411.fooo.fr:4242/con-nas", {method: "POST"})
    .then((response) => response.json())
    .then(json => {
      this.ping(300);
    })
    .catch(error => {
      console.log(error);
    }).done();
  }

  refresh() {
    this.ping(0);
    Vibration.vibrate();
  }

  startServer() {
    this.start()
  }

  render() {
    let color = (this.state.serverAlive) ? styles.ok : ((this.state.isLoading) ? styles.loading : styles.ko);
    return (
      <TouchableOpacity onPress={this.refresh.bind(this)} style={styles.container}>
        <TouchableOpacity onPress={this.startServer.bind(this)}>
          <View style={[styles.button, color]}></View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  componentDidMount () {
    if (this.runningPing)
      return;

    this.ping(0);
    this.runningPing = setTimeout(this.ping.bind(this, 0), 1000 * 60 * 5);
  }
}

const colors = {
    OK: "#73DE3F",
    LOADING: "#FF8B49",
    KO: '#e46',
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    borderWidth: 12,
    borderRadius: 300,
    borderColor: "#e46",
    width: 300,
    height: 300,
  },
  ok : {
    borderColor: "#73DE3F",
  },
  ko : {
    borderColor: "#e46",
  },
  loading: {
    borderColor: "#FF8B49",
  }
});

AppRegistry.registerComponent('LeButton', () => LeButton);
