import React, { Component } from 'react';
import {
  Button,
  Dimensions,
  ScrollView,
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
      productInfo: null
    }

    this._onBarCodeRead = this._onBarCodeRead.bind(this);
    this.renderCamera = this.renderCamera.bind(this);
    this._renderProductInfo = this._renderProductInfo.bind(this);
  }

  _renderProductInfo() {
    return Object.keys(this.state.productInfo.product.attributes)
      .map((key) => {
        return (
          <Text key={key}>{key}: {this.state.productInfo.product.attributes[key]}</Text>
        );
      });
  }

  renderCamera() {
    if (this.state.showCamera) {
      return (
        <Camera
          ref="cam"
          onBarCodeRead={this._onBarCodeRead}
          style={styles.container}
          type={this.state.cameraType}
        >
          <Button
            onPress={() => this.props.changePage('SETTINGS')}
            title="Return to Settings"
            color="#21a73b"
            accessibilityLabel="press this to set your dietary restrictions"
          />
        </Camera>
      );
    } else if (this.state.productInfo) {
      return (
        <ScrollView>
          <Button
            onPress={() => this.setState({ showCamera: true })}
            title="Return to Scanner"
            color="#21a73b"
            accessibilityLabel="press this to return to the camera"
          />
          <Text>Type: {this.state.barcodeData.type}</Text>
          <Text>Data: {this.state.barcodeData.data}</Text>
          {this._renderProductInfo()}
        </ScrollView>
      );
    } else {
      return (
        <ScrollView>
          <Button
            onPress={() => this.setState({ showCamera: true })}
            title="Return to Scanner"
            color="#21a73b"
            accessibilityLabel="press this to return to the camera"
          />
          <Text>Type: {this.state.barcodeData.type}</Text>
          <Text>Data: {this.state.barcodeData.data}</Text>
          <Text>Getting ingredients...</Text>
        </ScrollView>
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
        productInfo: res.data
      });
    });

    this.setState({
      showCamera: false,
      barcodeData: d,
      productInfo: null
    });
    console.log(d);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  }
});

export default BarcodeScanner;