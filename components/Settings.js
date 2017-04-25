import React, { Component } from 'react';
import {
  AsyncStorage,
  Button,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { CheckboxGroup } from 'react-native-material-design';
import { MKCheckbox } from 'react-native-material-kit';
import { Col, Row, Grid } from "react-native-easy-grid";

class Settings extends Component {
  constructor(props) {
    super(props);

    this._renderCheckboxes = this._renderCheckboxes.bind(this);
  }

  _renderCheckboxes() {
    const options = [
      { label: 'Vegan' },
      { label: 'Vegetarian' },
      { label: 'Peanut Allergy' },
  	  { label: 'Sugar-free' },
  	  { label: 'Gluten-free' },
  	  { label: 'Lactose Intolerance' },
    ];

    let self = this;
    return options.map((item, i) => {
      return (
        <Row key={i}>
          <Col size={1}>
            <MKCheckbox
              checked={self.props.saved[i]}
              onCheckedChange={({checked}) => self.props.changeSettings(checked, i)}
            />
          </Col>
          <Col size={7}><Text style={styles.bodyfont}>{item.label}</Text></Col>
        </Row>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
          <Text style ={styles.heading}>Select your dietary restrictions:</Text>
          <Grid>
            {this._renderCheckboxes()}
          </Grid>
        <Button
          onPress={() => this.props.changePage('SCANNER')}
          title="Return to Scanner"
          accessibilityLabel="press this to return to the camera"
          color = '#32cd32'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor: '#f5f5f5',
    padding: 30
  },
  heading: {
    color: '#32cd32',
    fontSize: 20,
    fontFamily: 'Chalkduster',
    fontWeight: 'bold'
  },
  bodyfont: {
    color: '#32cd32',
    fontSize: 17,
    fontFamily: 'Chalkduster',
    fontWeight: 'bold'
  }
});

export default Settings;