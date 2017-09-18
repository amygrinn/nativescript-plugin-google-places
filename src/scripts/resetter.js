var fs = require('fs');
var path = require('path');

var pluginConfigFile = "google-places.config.json"
var pluginConfigPath = path.join("../../", pluginConfigFile);

var config = {};

if(fs.existsSync(pluginConfigPath)) {
    try {
        config = JSON.parse(fs.readFileSync(pluginConfigPath));
        resetiOS();
        try {
            fs.unlinkSync(pluginConfigPath);
        } catch(error) {
            console.log("Failed to delete " + pluginConfigFile);
        }
    } catch(e) {
        console.log("Failed reading " + pluginConfigFile);
        console.log(e);
    }
}

function resetiOS() {
    if(config.ios.key) {
        let iosSource = './plugin-google-places.ios.js';

        var regEx = new RegExp(config.ios.key, "g");
        var newIosFile = fs.readFileSync(iosSource).toString().replace(regEx, "__API_KEY__");
        try {
            fs.writeFileSync(iosSource, newIosFile);
        } catch(err) {
            console.log("Failed to write " + iosSource);
            console.log(err);
        }
    }
}