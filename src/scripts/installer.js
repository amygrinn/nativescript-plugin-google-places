var fs = require('fs');
var path = require('path');
var prompt = require('prompt-lite');

var pluginConfigFile = "google-places.config.json"
var pluginConfigPath = path.join("../../", pluginConfigFile);

var config = {};

function saveConfig() {
    fs.writeFileSync(pluginConfigPath, JSON.stringify(config, null, 4));
}

function readConfig() {
    try {
        config = JSON.parse(fs.readFileSync(pluginConfigPath));
    } catch(e) {
        console.log("Failed reading " + pluginConfigFile);
        console.log(e);
        config = {}
    }
}

if(fs.existsSync(pluginConfigPath)) {
    readConfig();
    if(Object.keys(config).length === 0) {
        console.log("Running configuration...");
        getPrompts();
    } else {
        configure();
    }
} else {
    console.log("Running configuration...");
    getPrompts();
}

function getPrompts() {
    prompt.start();

    prompt.get(
        [{
            name: 'ios_key',
            description: 'Enter the google places API key for iOS (leave blank if not using iOS)'
        },
        {
            name: 'android_key',
            description: 'Enter the Google Places API key for Android (leave blank if not using Android)'
        },
        {
            name: 'location',
            description: 'Would you like to add the location permission to your app? (y/n)',
            default: 'y'
        },
        {
            name: 'save_config',
            description: 'Do you want to save the config file? Reinstalling will reuse setup from: ' + pluginConfigFile + '. (y/n)',
            default: 'y'
        }],
        function(err, result) {
            if(err) {
                return console.log(err);
            }

            if(result.ios_key) {
                config.ios = {
                    key: result.ios_key
                };
            }
        
            if(result.android_key) {
                config.android = {
                    key: result.android_key
                };
            }

            if(isSelected(result.location)) {
                config.location = true;
            }
        
            if(isSelected(result.save_config)) {
                saveConfig();
            }

            configure();
        }
    );
}

function configure() {
    
    if(config.android) {
        addAndroidKey(config.android.key, config.location);
    }

    if(config.ios) {
        addIosKey(config.ios.key, config.location);
    }

    console.log("You're all set!");
    console.log("*******************************************************************************************");
    console.log("***************              To change API keys, run:                  ********************");
    console.log("***************   cd node_modules/nativescript-plugin-google-places    ********************");
    console.log("***************                 npm run configure                      ********************");
    console.log("*******************************************************************************************");
}

function isSelected(value) {
    return value === true || (typeof value === "string" && value.toLowerCase() === 'y');
}

function addAndroidKey(key, location) {

    try {
        fs.writeFileSync('./platforms/android/AndroidManifest.xml',

`
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="${key}"/>

</manifest>
`
        );
    } catch(err) {
        console.log("Failed to create AndroidManifest.xml");
        console.log(err);
    }
}

function addIosKey(key, location) {

    var newIosFile = fs.readFileSync('./plugin-google-places.ios.js').toString().replace(/__API_KEY__/g, key);
    try {
        fs.writeFileSync('./plugin-google-places.ios.js', newIosFile);
    } catch(err) {
        console.log("Failed to write ios plugin-google-places.ios.js");
        console.log(err);
    }

    if(location) {
        try {
            fs.writeFileSync('./platforms/ios/Info.plist',

`
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSLocationWhenInUseUsageDescription</key>
    <true/>
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>Show your location on the map</string>
</dict>
</plist>
`
            );
        } catch(err) {
            console.log("Failed to create Info.plist");
        }
    } else if(fs.existsSync('./platforms/ios/Info.plist')) {
        try {
            fs.unlinkSync('./platforms/ios/Info.plist');
        } catch(err) {
            console.log("Failed to delete Info.plist");
            console.log(err);
        }
    }
}