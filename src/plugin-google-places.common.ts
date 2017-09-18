import { Place } from './index';

export function getStaticMapUrl( place: Place, options: { width: number, height: number }): string {
    return `https://maps.googleapis.com/maps/api/staticmap?markers=${encodeURIComponent(place.address)}&size=${options.width + 'x' + options.height}&scale=2&key=__API_KEY__`
}