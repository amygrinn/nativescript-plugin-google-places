import { Component } from "@angular/core";

import * as GooglePlaces from 'nativescript-plugin-google-places';

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent {

    place: GooglePlaces.Place;

    constructor() {
        GooglePlaces.init();

        setTimeout(() => {
            GooglePlaces.getPlacesById([
                "ChIJ4zPXqIiAhYAR31X3S64T6Uw",
                "ChIJ6zMe3oWAhYARaZ33Z1BAMRo",
                "ChIJAUWoGIaAhYARQ6zvky_f10Q"
            ])
                .then((places: GooglePlaces.Place[]) => {
                    places.forEach(place => console.log(place.name));
                })
                .catch(error => console.log(error));
        }, 1000)
    }

    pickPlace(): void {
        console.log("picking place");
        GooglePlaces.pickPlace()
            .then(place => this.place = place)
            .catch(error => console.log(error));
    }
}
