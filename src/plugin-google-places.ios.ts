import { ContentView } from 'tns-core-modules/ui/content-view';
import * as utils from "tns-core-modules/utils/utils";

import { Place, Location, Viewport } from './index';

declare var GMSPlacesClient: any, GMSServices: any;

declare class GMSPlacePickerViewControllerDelegate extends NSObject {};

declare class GMSPlace extends NSObject {
    public name: any;
    public placeID: any;
    public formattedAddress: any
};

declare class GMSPlacePickerViewController extends UIViewController {
    public static alloc(): GMSPlacePickerViewController;
    public initWithConfig(config: GMSPlacePickerConfig): GMSPlacePickerViewController;
    public delegate: GMSPlacePickerViewControllerDelegate;
};


declare class GMSCoordinateBounds extends NSObject {
    public static alloc(): GMSCoordinateBounds;
    public initWithCoordinateCoordinate(...params: any[]): GMSCoordinateBounds;
    public initWithRegion(...params: any[]): GMSCoordinateBounds;
    public northEast: CLLocationCoordinate2D;
    public southWest: CLLocationCoordinate2D;
    public valid: boolean;
};

declare class GMSPlacePickerConfig extends NSObject {
    public static alloc(): GMSPlacePickerConfig;
    public initWithViewport(viewport: GMSCoordinateBounds): GMSPlacePickerConfig;
    public viewport: GMSCoordinateBounds;
}

declare interface PlacePickerViewDelegateResponder {
    placePicked: (place: Place) => void,
    error: (error: NSError) => void,
    canceled: () => void
}

class PlacePickerViewDelegateImpl extends NSObject implements GMSPlacePickerViewControllerDelegate{
    public static ObjCProtocols = [GMSPlacePickerViewControllerDelegate];

    private _owner: WeakRef<PlacePickerViewDelegateResponder>;

    public static initWithOwner(owner: WeakRef<any>): PlacePickerViewDelegateImpl {
        let handler = <PlacePickerViewDelegateImpl>PlacePickerViewDelegateImpl.new();
        handler._owner = owner;
        return handler;
    }

    public placePickerDidPickPlace(placePicker: GMSPlacePickerViewController, place: GMSPlace): void {
        var owner = this._owner.get();
        owner.placePicked({
            name: place.name,
            id: place.placeID,
            address: place.formattedAddress
        });
    }

    public placePickerDidFailWithError(placePicker: GMSPlacePickerViewController, error: NSError): void {
        var owner = this._owner.get();
        owner.error(error);
    }

    public placePickerDidCancel(placePicker: GMSPlacePickerViewController): void {
        var owner = this._owner.get();
        console.dir(owner);
        owner.canceled();
    }
}


export function init(): void {
    console.log("Initializing google places");
    GMSPlacesClient.provideAPIKey("__API_KEY__");
    GMSServices.provideAPIKey("__API_KEY__");
}

export function pickPlace(viewport?: Viewport): Promise<{name: string, address: string}> {

    return new Promise<Place>((resolve, reject) => {
        let rootViewController = utils.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.rootViewController;

        let bounds: GMSCoordinateBounds = null;

        if(viewport) {
            let northEast = new CLLocationCoordinate2D();
            northEast.latitude = viewport.northEast.latitude
            northEast.longitude = viewport.northEast.longitude

            let southWest = new CLLocationCoordinate2D();
            southWest.latitude = viewport.southWest.latitude
            southWest.longitude = viewport.southWest.longitude

            bounds = GMSCoordinateBounds.alloc().initWithCoordinateCoordinate(southWest, northEast)
        }

        let config: GMSPlacePickerConfig = GMSPlacePickerConfig.alloc().initWithViewport(bounds);

        let ppvc = GMSPlacePickerViewController.alloc().initWithConfig(config);

        let responder: PlacePickerViewDelegateResponder = {
            placePicked: (place: Place) => {
                rootViewController.dismissViewControllerAnimatedCompletion(true, null);
                resolve(place);                
            },
            canceled: () => {
                rootViewController.dismissViewControllerAnimatedCompletion(true, null);
                resolve(null);
            },
            error: (error: NSError) => {
                console.log(JSON.stringify(error));
                rootViewController.dismissViewControllerAnimatedCompletion(true, null);
                reject(error);                
            }
        }

        ppvc.delegate = PlacePickerViewDelegateImpl.initWithOwner(new WeakRef(responder));

        rootViewController.presentViewControllerAnimatedCompletion(ppvc, true, null);
    });
}