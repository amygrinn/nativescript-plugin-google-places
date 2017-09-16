import { Observable } from 'tns-core-modules/data/observable';
import { PluginGooglePlaces } from 'nativescript-plugin-google-places';

export class HelloWorldModel extends Observable {
  public message: string;
  private pluginGooglePlaces: PluginGooglePlaces;

  constructor() {
    super();

    this.pluginGooglePlaces = new PluginGooglePlaces();
    this.message = this.pluginGooglePlaces.message;
  }
}
