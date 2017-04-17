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
      { label: 'Vegan' },
      { label: 'Vegetarian' },
      { label: 'Nut Allergy' },
	  {label: 'Sugar-free'},
	  {label: 'Gluten-free'},
	  {label: 'Lactose intolerance'},
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
                  ...self.state.saved.slice(i + 1)
                ]
              });
              AsyncStorage.setItem('savedSettings', [
                ...self.state.saved.slice(0, i),
                checked,
                ...self.state.saved.slice(i + 1)
              ].toString())
            }}
          /><Text style={styles.bodyfont}>{item.label}</Text>
        </View>
      );
    });
  }

  render() {
    return (
		<View style={styles.container}>
		<Image
		  style = {styles.container}
          source={require('./lemon.jpg')}>
		<View style={{width: 300, height: 500, backgroundColor: '#f5f5f5', alignSelf: 'center', paddingTop:30, marginTop:60}} >	
			<Text style ={styles.heading}>Select your dietary restrictions {'\n'}</Text>
			<Text>{'\n'}</Text>  
			{this._renderCheckboxes()}
			<Text>{'\n'}{'\n'}{'\n'}</Text>
		</View>
		<Text>{'\n'}</Text>
		<Button
          onPress={() => this.props.changePage('SCANNER')}
          title="Return to Scanner"
          accessibilityLabel="press this to return to the camera"
		  color = '#32cd32'
        />
		
		</Image>
      </View>
    );
  }
}


export default Settings;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
       
  },
  heading: {
    color: '#32cd32',
	fontSize: 20,
	fontFamily: 'Chalkduster',
	fontWeight: 'bold',
		
  },
  bodyfont: {
    color: '#32cd32',
	fontSize: 17,
	fontFamily: 'Chalkduster',
	fontWeight: 'bold',
	
  }, 
  newimg:{
	  width:300,
	  height:650,
	  resizeMode: 'center',
	  alignItems: 'center',
	  justifyContent: 'center',
	  alignSelf: 'center',
  },
  buttonstyle: {
	color: 'white',
    textAlign: 'center',
    fontSize: 16,
	width: 50,
  },
  stretch: {
    width: 400,
    height: 100,
	resizeMode: 'contain',
	alignItems: 'center',
	justifyContent: 'center',
	alignSelf: 'center',    
  },
});