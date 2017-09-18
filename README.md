# Nativescript Plugin Google Places

[![npm version](https://badge.fury.io/js/nativescript-plugin-google-places.svg)](https://badge.fury.io/js/nativescript-plugin-google-places)

Nativescript plugin for [Google Places API](https://developers.google.com/places/)

<img src="https://developers.google.com/places/images/placepicker.png" alt="Android" height="400"/> <img src="https://developers.google.com/places/images/placepicker-ios.png" alt="Android" height="400"/>


## [Updates](#new-updates)

## Prerequisites

Set up the Google Places API keys before installing this plugin, the setup script will ask 
for them.

For the iOS key, [click here](https://developers.google.com/places/ios-api/start) then click "GET A KEY".

For the Android key:
1. [click here](https://developers.google.com/places/android-api/start) then click "GET A KEY".
2. Go to the [Google developer console](https://console.developers.google.com) and click "Credentials" on the left.
3. Click the first key in the list which is the one you just created and under "Key restriction", select Android apps.
4. Enter in your package name and SHA-1 certificate fingerprint and press save at the bottom. You may want to add your debug and production SHA-1 fingerprints.

If you want to use the getStaticMapUrl function you'll need to create a browser key:
1. [click here](https://developers.google.com/maps/documentation/static-maps/) then click "GET A KEY".
2. Go to the [Google developer console](https://console.developers.google.com) and click "Library" on the left.
3. Find "Google Static Maps API" and click the "URL signing secret" tab.
4. Click the "Allow unsigned usage" button.
5. Click "Credentials" on the left, your browser key will be the first key in the list.


## Installation

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

To get places using ids:

```javascript
GooglePlaces.getPlacesById([
    "ChIJ4zPXqIiAhYAR31X3S64T6Uw",
    "ChIJ6zMe3oWAhYARaZ33Z1BAMRo",
    "ChIJAUWoGIaAhYARQ6zvky_f10Q"
])
    .then((places: GooglePlaces.Place[]) => {
        places.forEach(place => console.log(place.name));
    })
    .catch(error => console.log(error));
```

To get a static map:

```javascript
this.staticMapUrl = GooglePlaces.getStaticMapUrl(
    place, 
    { 
        width: 250,
        height: 250
    }
);
```

```html
<Image *ngIf="staticMapUrl" [src]="staticMapUrl" width="250" height="250"></Image>
```


## Best Practices

* Google recommends always displaying the attributions string, when available, when using the Place data.
* Google requires the "Powered by Google" picture next to Place data whenever the data is used outside of the map.
	The picture is installed by the plugin if you allow it to during the setup script.

You can use the light version:
```html
<Image res="res://powered_by_google_light" stretch="none"></Image>
```
or the dark version:
```html
<Image res="res://powered_by_google_dark" stretch="none"></Image>
```

## API

| Place  |||
| --- | --- | --- |
| name | string | The name of the place |
| address | string | Readable address |
| id | string | Unique ID of the place |
| attributions | string | Attributions of the place |
    
| Location |||
| --- | --- | --- |
| latitude | number | latitude in degrees |
| longitude | number | longitude in degrees |

| ViewPort |||
| --- | --- | --- |
| southWest | Location | Default SouthWest corner of the map |
| northEast | Location | Default NorthEast corner of the map |

# Updates <a id="new-updates"></a>

#### v1.1.2
* Fixed iOS bug where panning the map would destroy the link to resolve the promise, leaving the user stuck in the map view.
* Installer script now adds iOS images manually since the cocoapods version was inaccessible. If updating rather than installing for the first time, run:

```
cd node_modules/nativescript-plugin-google-places && npm run configure
```

#### v1.2.0
* Added ```getPlacesById(id: string[]): Place[]```
* Fixed Android error where place returned by placepicker would not have all of the info

#### v1.2.1
* Fixed setup error where ios keys were not being replaced after reconfiguring
* Fixed getPlacesById error where ios results were being returned in reverse order
* Added error handling to Android for getPlacesById if not all places can be found

Now you can be sure the places array you get from getPlacesById has the same number of elements and is in the same order as the ids you send it.

#### v1.3.0
* Added ```getStaticMapUrl(place: Place, options: { width: number, height: number }): string```
* Updated installer to request browser key for the static maps. Run ```npm run configure``` to update
