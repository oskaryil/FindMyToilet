import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import MapView from 'react-native-maps';
import NavigationBar from 'react-native-navbar';
var foursquare = require('react-native-foursquare-api')({
    clientID: 'DNNC2ISLHXBADT4TCDATD12NLIJ3GMRKSMDDZFAJOVUZC24W',
    clientSecret: '1L4FPH1D1WCNSEGLENSDBWSOUCB4LUHW34XFX52FBZEEHBYR',
    style: 'foursquare'
});




class App extends React.Component {   

  constructor(props) {
    super(props);
  
    this.state = {location: ''};
  };

  watchID: ?number = null;

  componentDidMount() {
    var location = {};
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialCoords: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }})
        console.log("INITIAL", initialPosition);
        this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = position;
      this.setState({lastCoords: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }});
      location = lastPosition;
      });

    this.setState({location:location});

    console.log(this.state);
    setTimeout(function() {
      var params = {
      "ll": location.coords.latitude + "," + location.coords.longitude,
      "query": "coffee"
    };


    foursquare.venues.getVenues(params)
      .then(function(venues) {
            console.log(venues);
        })
      .catch(function(err){
        console.log(err);
      });

    }, 5000);

  };



  render() {

    var rightButtonConfig = {
      title: '+',
      handler: function onNext() {
        alert('hello!');
      },
      style: {
      }
    };

    var leftButtonConfig = {

    };

    var titleConfig = {
      title: 'FindMyToilet',
    };

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showsCompass={false}
          showsUserLocation={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          followsUserLocation={true}
         initialRegion={{
          latitude: this.state.location.coords.latitude,
          longitude: this.state.location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          }} 
          provider="google" />
          <NavigationBar style={styles.navBar} title={titleConfig} rightButton={rightButtonConfig} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     alignItems: 'stretch',
     flexDirection: 'column',
     justifyContent: 'space-between',

   },
   map: {
     ...StyleSheet.absoluteFillObject,
     flex: 1,
     marginTop: 30
   },
   navBar: {    
    flex: 1,
   }
});

Exponent.registerRootComponent(App);
