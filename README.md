# Nativescript Plugin Google Places

<!--Add your plugin badges here. See [nativescript-urlhandler](https://github.com/hypery2k/nativescript-urlhandler) for example.-->

Nativescript plugin for [Google Places API](https://developers.google.com/places/)


## Prerequisites

Set up Google Places before installing, the setup script will ask for an API key for iOS and Android. 

It won't run on a platform without that platform's key being added.

For the iOS key, [click here](https://developers.google.com/places/ios-api/start) then click "GET A KEY".

For the Android key, [click here](https://developers.google.com/places/android-api/start) then click "GET A KEY".


## Installation

Describe your plugin installation steps. Ideally it would be something like:

```javascript
tns plugin add nativescript-plugin-google-places
```

## Usage 

To import:
```javascript
import * as GooglePlaces from 'nativescript-plugin-google-places';
```

Run the init function in the App.Module constructor if you're using angular or the app.ts file otherwise
	
```javascript
GooglePlaces.init();
```

To have the user pick a place:

```javascript
GooglePlaces.pickPlace()
    .then(place => console.log(JSON.stringify(place)))
    .catch(error => console.log(error));
```

To set a default location for the map to start on: 

```javascript
let center: Location = {
    latitude: -33.865143,
    longitude: 151.2099
}

let viewport = {
    northEast: {
        latitude: center.latitude + 0.001,
        longitude: center.longitude + 0.001
    },
    southWest: {
        latitude: center.latitude - 0.001,
        longitude: center.longitude - 0.001
    }
}

GooglePlaces.pickPlace(viewport)
    .then(place => console.log(JSON.stringify(place)))
    .catch(error => console.log(error));
```

## API

| Place  |||
| --- | --- | --- |
| name | string | The name of the place |
| address | string | Readable address |
| id | string | Unique ID of the place |
    
| Location |||
| --- | --- | --- |
| latitude | number | latitude in degrees |
| longitude | number | longitude in degrees |

| ViewPort |||
| --- | --- | --- |
| southWest | Location | Default SouthWest corner of the map |
| northEast | Location | Default NorthEast corner of the map |