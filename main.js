import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import MapView from 'react-native-maps';
import NavigationBar from 'react-native-navbar';
import Spinner from 'react-native-loading-spinner-overlay';
var foursquare = require('react-native-foursquare-api')({
    clientID: 'DNNC2ISLHXBADT4TCDATD12NLIJ3GMRKSMDDZFAJOVUZC24W',
    clientSecret: '1L4FPH1D1WCNSEGLENSDBWSOUCB4LUHW34XFX52FBZEEHBYR',
    style: 'foursquare'
});




class App extends React.Component {   

  constructor(props) {
    super(props);
  
    this.state = {location: '', markers: [],};
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
      this.setState({location:location});
      });


    console.log(this.state);
    setTimeout(function() {


    }, 3000);

    if(!this.state.location) {
      console.log("location unknown");
    } else {
      getToilets();
    }

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

    var getToilets = function() {
      if(this.state.location) {


      }
    }

    if(!this.state.location) {
      return(
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>FindMyToilet</Text>
          <Spinner visible={true} size="large" overlayColor='rgba(255,255,255,0.5)' color="black" />
        </View>
      );
    } else {
      var params = {
        "ll": this.state.location.coords.latitude + "," + this.state.location.coords.longitude,
        "query": "coffee"
      };


      foursquare.venues.getVenues(params)
        .then(function(venues) {
              console.log(venues);
          })
        .catch(function(err){
          console.log(err);
        }); 
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
            provider="google">
            {this.state.markers.map(marker => (
              <MapView.Marker
                key={marker.key}
                coordinate={marker.coordinate}
                pinColor={marker.color}
              />
            ))}
          </MapView>
            <NavigationBar style={styles.navBar} title={titleConfig} rightButton={rightButtonConfig} />
        </View>
      );
      
    }
  }
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     alignItems: 'stretch',
     flexDirection: 'column',
     justifyContent: 'space-between',

   },
   loadingContainer: {
    flex: 1,
    alignItems: 'center' 
   },
   loadingText: {
    fontSize: 20,
    marginTop: 100,
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
