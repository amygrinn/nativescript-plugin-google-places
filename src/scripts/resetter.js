var fs = require('fs');
var path = require('path');

var pluginConfigFile = "google-places.config.json"
var pluginConfigPath = path.join("../../", pluginConfigFile);

var config = {};

if(fs.existsSync(pluginConfigPath)) {
    try {
        config = JSON.parse(fs.readFileSync(pluginConfigPath));
        resetiOS();
        resetBrowser();
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
    if(config.ios) {
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

function resetBrowser() {
    if(config.browser) {
        let commonSource = './plugin-google-places.common.js';

        var regEx = new RegExp(config.browser.key, "g");
        var newCommonFile = fs.readFileSync(commonSource).toString().replace(regEx, "__API_KEY__");
        try {
            fs.writeFileSync(commonSource, newCommonFile);
        } catch(err) {
            console.log("Failed to write " + commonSource);
            console.log(err);
        }
    }
}