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
import { Col, Row, Grid } from "react-native-easy-grid";

class ShoppingCart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let cart = this.props.cart;
    let mapped = cart.map((item, index) => {
      console.log(item, index);
      return (
        <Row key={index}>
          <Col size={8}>
            <Text>{item.title}</Text>
          </Col>
          <Col size={4}>
            <Button
              onPress={() => this.props.removeFromCart(index)}
              title="Remove"
              color="#aaaaaa"
              accessibilityLabel="press this to remove the item from your cart"
            />
          </Col>
        </Row>
      );
    });

    if (mapped.length === 0)
      mapped = (
        <Row>
          <Text>Your cart is empty. Scan some items to add them here.</Text>
        </Row>
      );

    return (
      <Grid>
        <Button
          onPress={() => this.props.changePage('SCANNER')}
          title="Return to Scanner"
          accessibilityLabel="press this to return to the camera"
          color = '#32cd32'
        />
        {mapped}
      </Grid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  }
});

export default ShoppingCart;