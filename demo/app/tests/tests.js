var PluginGooglePlaces = require("nativescript-plugin-google-places").PluginGooglePlaces;
var pluginGooglePlaces = new PluginGooglePlaces();

describe("greet function", function() {
    it("exists", function() {
        expect(pluginGooglePlaces.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(pluginGooglePlaces.greet()).toEqual("Hello, NS");
    });
});