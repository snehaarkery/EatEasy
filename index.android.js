import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import axios from 'axios';
import Camera from 'react-native-camera';

class BarcodeScanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCamera: true,
      cameraType: Camera.constants.Type.back,
      barcodeData: {
        data: '',
        type: ''
      },
      ingredients: {}
    }

    this._onBarCodeRead = this._onBarCodeRead.bind(this);
  }

  renderCamera() {
    if (this.state.showCamera) {
      return (
        <Camera
          ref="cam"
          style={styles.container}
          onBarCodeRead={this._onBarCodeRead}
          type={this.state.cameraType}
        />
      );
    } else {
      return (
        <View>
          <Button
            onPress={() => this.setState({ showCamera: true })}
            title="Return to Scanner"
            color="#841584"
            accessibilityLabel="press this to return to the camera"
          />
          <Text>Type: {this.state.barcodeData.type}</Text>
          <Text>Data: {this.state.barcodeData.data}</Text>
          <Text>{JSON.stringify(this.state.ingredients)}</Text>
        </View>
      );
    }
  }

  render() {
    return (
      this.renderCamera()
    );
  }

  _onBarCodeRead(d) {
    const api = 'http://eandata.com/feed/?v=3&keycode=DF7419BC58E1ED96&mode=json&find='

    axios.get(api + d.data).then((res) => {
      console.log(res);
      this.setState({
        ingredients: res
      });
    });

    this.setState({
      showCamera: false,
      barcodeData: d,
    });
    console.log(d);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  }
});

AppRegistry.registerComponent('EatEasy', () => BarcodeScanner);