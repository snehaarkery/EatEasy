import React, { Component } from 'react';
import {
  AsyncStorage,
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { CheckboxGroup } from 'react-native-material-design';
import { MKCheckbox } from 'react-native-material-kit';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saved: [ false, false, false ]
    };

    this._renderCheckboxes = this._renderCheckboxes.bind(this);
  }

  componentWillMount() {
    AsyncStorage.getItem('savedSettings').then((value) => {
      this.setState({ saved: (value || '').split(',').map((val) => (val === 'true')) });
    }).done();
  }

  _renderCheckboxes() {
    const options = [
      { label: 'Vegetarian' },
      { label: 'Vegan' },
      { label: 'Nut Allergy' },
    ];

    let self = this;
    return options.map((item, i) => {
      return (
        <View key={i}>
          <MKCheckbox
            checked={self.state.saved[i]}
            onCheckedChange={({checked}) => {
              self.setState({
                saved: [
                  ...self.state.saved.slice(0, i),
                  checked,
                  ...self.state.saved.slice(i+1)
                ]
              });
              AsyncStorage.setItem('savedSettings', [
                ...self.state.saved.slice(0, i),
                checked,
                ...self.state.saved.slice(i)
              ].toString())
            }}
          />
          <Text>{item.label}</Text>
        </View>
      );
    });
  }

  render() {
    return (
      <View>
        <Button
          onPress={() => this.props.changePage('SCANNER')}
          title="Return to Scanner"
          color="#21a73b"
          accessibilityLabel="press this to return to the camera"
        />
        {this._renderCheckboxes()}
      </View>
    );
  }
}

export default Settings;