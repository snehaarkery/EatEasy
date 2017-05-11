import React, { Component } from 'react';
import {
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import axios from 'axios';
import Camera from 'react-native-camera';
import { SPOONACULAR_MASHAPE_KEY } from '../private-api-keys';

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
      productInfo: null,
      isWithinDiet: null
    }

    this._onBarCodeRead = this._onBarCodeRead.bind(this);
    this._renderAddToCartButton = this._renderAddToCartButton.bind(this);
    this._renderProductInfo = this._renderProductInfo.bind(this);
    this._renderWithinDiet = this._renderWithinDiet.bind(this);
    this._checkDiet = this._checkDiet.bind(this);
  }

  _renderProductInfo() {
    if (this.state.productInfo === 404) {
      return <Text>Product not found!</Text>
    }

    if (!this.state.productInfo) {
      return (<Text>Getting ingredients...</Text>);
    }

    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>{this.state.productInfo.title}</Text>
        {this.state.productInfo.images[0]
          && <Image
            style={{width: 250, height: 250}}
            source={{uri: this.state.productInfo.images[0]}}
          />}
        <Text>{this.state.productInfo.generated_text}</Text>
        <Text>Ingredients:</Text>
        {this.state.productInfo.ingredients.map((ing, i) => {
          return (
            <Text key={i}>{ing.name}</Text>
          );
        })}
      </View>
    );
  }

  _renderWithinDiet() {
    if (this.state.isWithinDiet === null) {
      return (<Text>Checking if this item is within your diet...</Text>);
    }

    if (this.state.isWithinDiet) {
      return (<Text style={{ backgroundColor: '#00ff00', fontSize: 28 }}>This item is within your diet!</Text>);
    } else {
      return (<Text style={{ backgroundColor: '#ff0000', fontSize: 28 }}>This item is NOT within your diet.</Text>);
    }
  }

  _renderAddToCartButton() {
    if (this.state.productInfo) {
      return (
        <Button
          onPress={() => this.props.addToCart(this.state.productInfo)}
          title="Add to Cart"
          color="#aaaaaa"
          accessibilityLabel="press this to add the scanned item to your cart"
        />
      );
    } else {
      return null;
    }
  }

  render() {
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
          <Button
            onPress={() => this.props.changePage('CART')}
            title="Go to Cart"
            color="#219fa7"
            accessibilityLabel="press this to go to your shopping cart"
          />
        </Camera>
      );
    } else {
      return (
        <ScrollView>
          <Button
            onPress={() => this.setState({ showCamera: true })}
            title="Return to Scanner"
            color="#aaaaaa"
            accessibilityLabel="press this to return to the camera"
          />
          <Text>Type: {this.state.barcodeData.type}</Text>
          <Text>Data: {this.state.barcodeData.data}</Text>
          {this._renderWithinDiet()}
          {this._renderProductInfo()}
          {this._renderAddToCartButton()}
        </ScrollView>
      );
    }
  }

  _onBarCodeRead(d) {
    if (d.type === 'EAN_13')
      d.data = d.data.slice(1);

    const EANDATA_API = 'http://eandata.com/feed/?v=3&keycode=DF7419BC58E1ED96&mode=json&find='  + d.data;
    const NUTRITIONIX_API = 'https://api.nutritionix.com/v1_1/item?upc=' + d.data + '&appId=391cc446&appKey=1dec9dff56a3b80c029a1a6f896e092a';
    const EDAMAM_API = 'https://api.edamam.com/api/nutrition-details?app_id=bec6d7ed&app_key=d80bb1a04afa8a2fdc743a70595b3069';
    const FOOD_FACTS_API = 'https://api.foodfacts.com/ci/api/foodfacts/food_find_product_by_upc';
    const SPOONACULAR_API = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/upc/' + d.data;

    axios.get(SPOONACULAR_API, {
      headers: {
        'X-Mashape-Key': SPOONACULAR_MASHAPE_KEY,
        'Accept': 'application/json'
      }
    }).then((res) => {
      console.log(res);

      let ingredients = res.data.ingredients;

      if (+res.status === 404) {
        this.setState({
          productInfo: 404
        });
      } else {
        this.setState({
          productInfo: res.data
        });

        this._checkDiet(res.data);
      }
    });

    this.setState({
      showCamera: false,
      barcodeData: d,
      productInfo: null,
      isWithinDiet: null
    });
    console.log(d);
  }

  _checkDiet(data) {
    const badges = [
      'vegan',
      'vegetarian',
      'peanut_free',
      'sugar_free',
      'gluten_free',
      'dairy_free'
    ];

    for (let i = 0; i < 6; i++) {
      if (this.props.saved[i]) {
        if (!data.badges.includes(badges[i])) {
          this.setState({
            productInfo: {
              ...data,
              isWithinDiet: false
            },
            isWithinDiet: false
          });
          return;
        }
      }
    }

    this.setState({
      productInfo: {
        ...data,
        isWithinDiet: true
      },
      isWithinDiet: true
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  }
});

export default BarcodeScanner;