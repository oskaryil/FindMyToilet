import Exponent from 'exponent';
import { Constants, Location, Permissions } from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
} from 'react-native';

import MapView from 'react-native-maps';
import NavigationBar from 'react-native-navbar';
import Spinner from 'react-native-loading-spinner-overlay';
var foursquare = require('react-native-foursquare-api')({
    clientID: 'DNNC2ISLHXBADT4TCDATD12NLIJ3GMRKSMDDZFAJOVUZC24W',
    clientSecret: '1L4FPH1D1WCNSEGLENSDBWSOUCB4LUHW34XFX52FBZEEHBYR',
    style: 'foursquare'
});
var googlePlaces = require('googleplaces');

let id = 0;

class App extends React.Component {   

  constructor(props) {
    super(props);
  
    this.state = {
      markers: [],
    };
  };

  getToilets() {

    var params = {
      "ll": this.state.location.coords.latitude + "," + this.state.location.coords.longitude,
      "categoryId": "4bf58dd8d48988d1e0931735,4bf58dd8d48988d113951735,4bf58dd8d48988d181941735,4d4b7105d754a06374d81259,4bf58dd8d48988d16d941735",
    };


    foursquare.venues.getVenues(params)
      .then((venues) => {
            console.log(venues);
        var response = venues.response.venues;
        var tempMarkers = [
        {
          coordinate: {
            latitude: 59.33732841,
            longitude: 18.07367307,
          },
          key: id++,
          title: 'Offentlig toalett Humlegården',
        },
        {
          coordinate: {
            latitude: 59.34001859,
            longitude: 18.00489452,
          },
          key: id++,
          title: 'Offentlig toalett Hornsbergstrand'
        },
        {
          coordinate: {
            latitude: 59.33494603,
            longitude: 18.0554024,
          },
          key: id++,
          title: 'Offentlig toalett Norra Bantorget'
        },
        {
          coordinate: {
            latitude: 59.33851777,
            longitude: 18.0554032,
          },
          key: id++,
          title: 'Offentlig toalett Tegnerlunden'
        },
        {
          coordinate: {
            latitude: 59.32797983,
            longitude: 18.02593371,
          },
          key: id++,
          title: 'Offentlig toalett Rålambshovsparken'
        },
        {
          coordinate: {
            latitude: 59.32555115,
            longitude: 18.02174491,
          },
          key: id++,
          title: 'Offentlig toalett Smedsuddsbadet'
        },
        {
          coordinate: {
            latitude: 59.31183078,
            longitude: 18.02460641,
          },
          key: id++,
          title: 'Offentlig toalett Liljeholmen - Katrinebergsbacken 4',
        },
        {
          coordinate: {
            latitude: 59.30758385,
            longitude: 18.02847651,
          },
          key: id++,
          title: 'Offentlig toalett Sjövikstorget'
        },
        {
          coordinate: {
            latitude: 59.29793596,
            longitude: 17.99717244,
          },
          key: id++,
          title: 'Offentlig toalett Telefonplan/ Mikrofonvägen'
        },
        {
          coordinate: {
            latitude: 59.28555077,
            longitude: 17.96482994,
          },
          key: id++,
          title: 'Offentlig toalett Fruängsplan'
        },
        {
          coordinate: {
            latitude: 59.29671574,
            longitude: 17.93203232,
          },
          key: id++,
          title: 'Offentlig toalett Bredäng/ Trissan parklek'
        },
        {
          coordinate: {
            latitude: 59.27656147,
            longitude: 18.13131508,
          },
          key: id++,
          title: 'Offentlig toalett Bagarmossen C t-bana'
        },
        {
          coordinate: {
            latitude: 59.31573162,
            longitude: 18.08713373,
          },
          key: id++,
          title: 'Offentlig toalett Stigbergsparken'
        },
        {
          coordinate: {
            latitude: 59.34743486,
            longitude: 17.88401273,
          },
          key: id++,
          title: 'Offentlig toalett Blackeberg Holbergsgatan'
        },
        ];
        response.forEach((toilet) => {

          tempMarkers.push({
            coordinate: {
              latitude: toilet.location.lat,
              longitude: toilet.location.lng,
            },
            title: toilet.name,
            description: toilet.location.address,
            key: id++,
          });

          this.setState({
            markers: tempMarkers
          });
        });
        })  
      .catch(function(err){
        console.log(err);
      }); 

  };

  async getLocationAsync() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
      let currentLocation = await Location.getCurrentPositionAsync({enableHighAccuracy: Platform.OS === 'ios'});
      this.setState({location: currentLocation});
      this.getToilets();
    } else {
      throw new Error('Location permission not granted');
    }
  };

  componentDidMount() {

    this.getLocationAsync();
    this.setState({
      markers: [
      ...this.state.markers,
      ],
    });
  }

  componentWillUnmount() {
  }

  render() {

    var rightButtonConfig = {
      title: '+',
      handler: function onNext() {
      },
      style: {
      }
    };

    var leftButtonConfig = {

    };

    var titleConfig = {
      title: 'Find My Toilet',
    };

    if(!this.state.location) {
      return(
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>FindMyToilet</Text>
          <Image
            style={styles.image}
            source={require('./app/img/littletoilet.png')}
          />
          <Spinner visible={true} size="large" overlayColor='rgba(255,255,255,0)' color="black" />
        </View>
      );
    } else {

      return (
        <View style={styles.container}>

          <MapView
            style={styles.map}
            showsCompass={false}
            showsUserLocation={true}
            showsMyLocationButton={true}
            loadingEnabled={true}
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
                title={marker.title}
                description={marker.description}
                image={require('./app/img/100toilet.png')}
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
     marginTop: Constants.statusBarHeight,

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
   },
   image: {
    width: 100,
    height: 100,
    marginTop: 30,
   }
});

Exponent.registerRootComponent(App);
