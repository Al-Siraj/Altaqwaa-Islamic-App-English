module.exports = async (path, fs, App_Path) => {

    fs.existsSync(App_Path) ? true : fs.mkdirsSync(App_Path, { recursive: true });

    fs.existsSync(path.join(App_Path, "./data")) ? true :
        fs.mkdirsSync(path.join(App_Path, "./data"), { recursive: true });

    fs.existsSync(path.join(App_Path, "./data/settings.json")) ? true :
        fs.writeJsonSync(path.join(App_Path, './data/settings.json'), {
            "Calculation": "UmmAlQura",
            "notifications_adhan": true,
            "notifications_adhkar": true,
            "autostart": true,
            "startHidden": false,
            "minimizeToPanel": false,
            "morning_adhkar_time": "",
            "evening_adhkar_time": "",
            "dark_mode": true,
            "font_size_quran": 45,
            "font_size_adhkar": 30,
            "volume": 1,
            "adhanVolume": 1,
            "onlineQuran": true,
            "onlineAdhkar": true,
        });

    if (!fs.existsSync(path.join(App_Path, './data/location.json'))) {
        // HTTP REQUEST NO (SSL) USING (http://ip-api.com/json)
        try {
            let fetch = require('node-fetch');
            let response = await fetch('http://ip-api.com/json');
            let status = await response?.status;
            if (status !== 200) return
            let body = await response?.json();

            fs.writeJsonSync(path.join(App_Path, './data/location.json'), {
                country: body?.country,
                countryCode: body?.countryCode,
                regionName: body?.regionName,
                city: body?.city,
                lat: body?.lat,
                lon: body?.lon,
                timezone: body?.timezone,
                ip: body?.query
            }, { spaces: '\t' });

        } catch (error) {
            /* MAYBE THERE IS NO INTERNET CONNECTION SO AVOIDING CRASH */
        }

    }

    fs.existsSync(path.join(App_Path, "./data/Now.json")) ? true :
        fs.writeJsonSync(path.join(App_Path, './data/Now.json'), { "id": 0 });

    fs.writeJsonSync(path.join(App_Path, './data/audio_window.json'), { "start": false });

    fs.writeJsonSync(path.join(App_Path, './data/sound.json'), { "sound": true });

    if (!fs.existsSync(path.join(App_Path, "./data/tempSettings.json"))) {
        fs.writeJsonSync(path.join(App_Path, './data/tempSettings.json'), {
            "quranTranslation": true,
            "quranTransliteration": false,
            "enableAutoScroll": true,
            "adhkarTranslation": true,
            "adhkarTransliteration": false,
            "tajweed": false
        }, { spaces: '\t' });
    }
}