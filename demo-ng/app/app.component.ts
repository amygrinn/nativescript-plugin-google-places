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
    }

    pickPlace(): void {
        console.log("picking place");
        GooglePlaces.pickPlace()
            .then(place => this.place = place)
            .catch(error => console.log(error));
    }
}
