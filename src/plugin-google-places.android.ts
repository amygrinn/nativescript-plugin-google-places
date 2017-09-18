import * as app from "tns-core-modules/application";

import { Place, Location, Viewport } from './index';
import * as Common from './plugin-google-places.common';

declare var com: any;

export function init(): void {}

export function pickPlace(viewport: Viewport): Promise<Place> {
    return new Promise<Place>((resolve, reject) => {
        try {
            let geoClient = com.google.android.gms.location.places.Places.getGeoDataClient(app.android.context, null);
            let placeDetectionClient =  com.google.android.gms.location.places.Places.getPlaceDetectionClient(app.android.context, null);
            
            let PLACE_PICKER_REQUEST = 1;

            let builder = new com.google.android.gms.location.places.ui.PlacePicker.IntentBuilder();

            if(viewport) {
                let southWest = new com.google.android.gms.maps.model.LatLong(viewport.southWest.latitude, viewport.southWest.longitude);
                let northEast = new com.google.android.gms.maps.model.LatLong(viewport.northEast.latitude, viewport.northEast.longitude);

                let latLngBounds = new com.google.android.gms.maps.model.LatLngBounds(southWest, northEast);

                builder.setLatLngBounds(latLngBounds);
            }

            app.android.on("activityResult", (args) => {
                if (args.requestCode === PLACE_PICKER_REQUEST && args.resultCode === android.app.Activity.RESULT_OK) {
                    let place = com.google.android.gms.location.places.ui.PlacePicker.getPlace(args.intent, app.android.context);

                    getPlacesById([place.getId()]).then(places => {
                        if(places.length != 1) {
                            reject("Error");
                        } else {
                            resolve(places[0]);
                        }
                    }).catch(error => reject(error));
                    
                }
            });
            
            app.android.foregroundActivity.startActivityForResult(builder.build(app.android.foregroundActivity), PLACE_PICKER_REQUEST);
        } catch(error) {
            reject(error);
        }
    })
}

export function getPlacesById(ids: string[]): Promise<Place[]> {
    return new Promise((resolve, reject) => {
        try {
            let geoClient = com.google.android.gms.location.places.Places.getGeoDataClient(app.android.context, null);
        
            geoClient.getPlaceById(ids).addOnCompleteListener(new com.google.android.gms.tasks.OnCompleteListener({
                onComplete: (placesBufferTask): void => {
                    
                    if(!placesBufferTask.isSuccessful()) {
                        reject(placesBufferTask.getException());
                    } else {
                        
                        let placesBuffer = placesBufferTask.getResult()
                        
                        let places: Place[] = [];

                        for(let i = 0; i < placesBuffer.getCount(); i++) {

                            let place = placesBuffer.get(i);
                            places.push({
                                name: place.getName ? place.getName() : '',
                                id: place.getId ? place.getId() : '',
                                attributions: place.getAttributions ? place.getAttributions() : '',
                                address: place.getAddress ? place.getAddress() : ''
                            });
                        }

                        if(places.length !== ids.length) {
                            reject("Some places could not be found");
                        } else {
                            resolve(places);
                        }
                    }
                }
            }));

            
        } catch(error) {
            reject(error);
        }
    });
}

export function getStaticMapUrl(place: Place, options: { width: number, height: number}): string {
    return Common.getStaticMapUrl(place, options);
}