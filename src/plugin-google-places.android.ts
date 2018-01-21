import * as app from "tns-core-modules/application";
import * as utils from "tns-core-modules/utils/utils";

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
                let southWest = new com.google.android.gms.maps.model.LatLng(viewport.southWest.latitude, viewport.southWest.longitude);
                let northEast = new com.google.android.gms.maps.model.LatLng(viewport.northEast.latitude, viewport.northEast.longitude);

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
                                address: place.getAddress ? place.getAddress() : '',
                                types: place.getPlaceTypes ? utils.ad.collections.stringSetToStringArray(place.getPlaceTypes()).map(type => placesStrings[type]) : [],
                                coordinates: place.getLatLng ? {
                                    latitude: place.getLatLng().latitude,
                                    longitude: place.getLatLng().longitude
                                } : null,
                                viewport: place.getViewport ? {
                                    northEast: {
                                        latitude: place.getViewport().northeast.latitude,
                                        longitude: place.getViewport().northeast.longitude
                                    },
                                    southWest: {
                                        latitude: place.getViewport().southwest.latitude,
                                        longitude: place.getViewport().southwest.longitude
                                    }
                                } : null
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

let placesStrings = {
    "0": "other",
    "1": "accounting",
    "2": "airport",
    "3": "amusement_park",
    "4": "aquarium",
    "5": "art_gallery",
    "6": "atm",
    "7": "bakery",
    "8": "bank",
    "9": "bar",
    "10": "beauty_salon",
    "11": "bicycle_store",
    "12": "book_store",
    "13": "bowling_alley",
    "14": "bus_station",
    "15": "cafe",
    "16": "campground",
    "17": "car_dealer",
    "18": "car_rental",
    "19": "car_repair",
    "20": "car_wash",
    "21": "casino",
    "22": "cemetery",
    "23": "church",
    "24": "city_hall",
    "25": "clothing_store",
    "26": "convenience_store",
    "27": "courthouse",
    "28": "dentist",
    "29": "department_store",
    "30": "doctor",
    "31": "electrician",
    "32": "electronics_store",
    "33": "embassy",
    "34": "establishment",
    "35": "finance",
    "36": "fire_station",
    "37": "florist",
    "38": "food",
    "39": "funeral_home",
    "40": "furniture_store",
    "41": "gas_station",
    "42": "general_contractor",
    "43": "grocery_or_supermarket",
    "44": "gym",
    "45": "hair_care",
    "46": "hardware_store",
    "47": "health",
    "48": "hindu_temple",
    "49": "home_goods_store",
    "50": "hospital",
    "51": "insurance_agency",
    "52": "jewelry_store",
    "53": "laundry",
    "54": "lawyer",
    "55": "library",
    "56": "liquor_store",
    "57": "local_government_office",
    "58": "locksmith",
    "59": "lodging",
    "60": "meal_delivery",
    "61": "meal_takeaway",
    "62": "mosque",
    "63": "movie_rental",
    "64": "movie_theater",
    "65": "moving_company",
    "66": "museum",
    "67": "night_club",
    "68": "painter",
    "69": "park",
    "70": "parking",
    "71": "pet_store",
    "72": "pharmacy",
    "73": "physiotherapist",
    "74": "place_of_worship",
    "75": "plumber",
    "76": "police",
    "77": "post_office",
    "78": "real_estate_agency",
    "79": "restaurant",
    "80": "roofing_contractor",
    "81": "rv_park",
    "82": "school",
    "83": "shoe_store",
    "84": "shopping_mall",
    "85": "spa",
    "86": "stadium",
    "87": "storage",
    "88": "store",
    "89": "subway_station",
    "90": "synagogue",
    "91": "taxi_stand",
    "92": "train_station",
    "93": "travel_agency",
    "94": "university",
    "95": "veterinary_care",
    "96": "zoo",
    "1001": "administrative_area_level_1",
    "1002": "administrative_area_level_2",
    "1003": "administrative_area_level_3",
    "1004": "colloquial_area",
    "1005": "country",
    "1006": "floor",
    "1007": "geocode",
    "1008": "intersection",
    "1009": "locality",
    "1010": "natural_feature",
    "1011": "neighborhood",
    "1012": "political",
    "1013": "point_of_interest",
    "1014": "post_box",
    "1015": "postal_code",
    "1016": "postal_code_prefix",
    "1017": "postal_town",
    "1018": "premise",
    "1019": "room",
    "1020": "route",
    "1021": "street_address",
    "1022": "sublocality",
    "1023": "sublocality_level_1",
    "1024": "sublocality_level_2",
    "1025": "sublocality_level_3",
    "1026": "sublocality_level_4",
    "1027": "sublocality_level_5",
    "1028": "subpremise",
    "1029": "synthetic_geocode",
    "1030": "transit_station"
}
  
