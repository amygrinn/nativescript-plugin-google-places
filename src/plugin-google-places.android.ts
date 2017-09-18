import * as app from "tns-core-modules/application";

import { Place, Location, Viewport } from './index';

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

                    resolve({
                        name: place.getName ? place.getName() : '',
                        address: place.getAddress ? place.getAddress() : '',
                        id: place.getId(),
                        attributions: place.getAttributions()
                    })
                }
            });
            
            app.android.foregroundActivity.startActivityForResult(builder.build(app.android.foregroundActivity), PLACE_PICKER_REQUEST);
        } catch(error) {
            reject(error);
        }
    })
}