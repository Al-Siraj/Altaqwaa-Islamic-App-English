const fetch = require('node-fetch');

module.exports = async function settings(fs, path, App_Path, settings, ipcRenderer) {

    let location = fs.readJsonSync(path.join(App_Path, './data/location.json'));
    let currentRelease = await ipcRenderer.invoke('currentRelease');

    let latitude = document.getElementById('latitude');
    let longitude = document.getElementById('longitude');
    let timezone = document.getElementById('timezone');
    let Calculation = document.getElementById('Calculation');
    let notifications_adhan = document.getElementById('notifications_adhan');
    let notifications_adhkar = document.getElementById('notifications_adhkar');
    let autostart = document.getElementById('autostart');
    let startHidden = document.getElementById('startHidden');
    let minimizeToPanel = document.getElementById('minimizeToPanel');
    let dark_mode = document.getElementById('dark_mode');
    let selected = document.getElementById(settings?.Calculation);
    let morning_adhkar_time = document.getElementById("morning_adhkar_time");
    let evening_adhkar_time = document.getElementById("evening_adhkar_time");
    let save = document.getElementById('save');
    let alrt = document.getElementById('alrt');
    let errorPopup = document.getElementById('error');
    let settings_font_adhkar = document.getElementById('settings_font_adhkar');
    let settings_font_quran = document.getElementById('settings_font_quran');
    let settings_font_adhkar_output = document.getElementById('settings_font_adhkar_output');
    let settings_font_quran_output = document.getElementById('settings_font_quran_output');
    let refresh_button = document.getElementById("refresh_button");
    const downloadButton = document.getElementById("downloadButton");

    location.timezone ? timezone.value = location.timezone : false
    location.lat ? latitude.value = location.lat : false
    location.lon ? longitude.value = location.lon : false
    notifications_adhan.checked = settings?.notifications_adhan
    notifications_adhkar.checked = settings?.notifications_adhkar
    autostart.checked = settings?.autostart || false
    startHidden.checked = settings?.startHidden || false
    minimizeToPanel.checked = settings?.minimizeToPanel || false
    morning_adhkar_time.value = settings?.morning_adhkar_time || ""
    evening_adhkar_time.value = settings?.evening_adhkar_time || ""
    dark_mode.checked = settings?.dark_mode ? true : false
    selected.selected = "selected"
    settings_font_adhkar_output.innerText = settings?.font_size_adhkar ? settings?.font_size_adhkar : 30
    settings_font_adhkar.value = settings?.font_size_adhkar ? settings?.font_size_adhkar : 30
    settings_font_quran_output.innerText = settings?.font_size_quran ? settings?.font_size_quran : 45
    settings_font_quran.value = settings?.font_size_quran ? settings?.font_size_quran : 45

    if (!settings.onlineQuran && !settings.onlineAdhkar)
        downloadButton.style.backgroundColor = '#6bc077';

    // input font adhkar
    settings_font_adhkar.addEventListener('input', e => {
        settings_font_adhkar_output.innerText = settings_font_adhkar.value
    });

    // input font quran
    settings_font_quran.addEventListener('input', e => {
        settings_font_quran_output.innerText = settings_font_quran.value
    });


    /* VOLUME MANAGER */
    let volumeRange = document.getElementById('volume');
    let volumeValue = document.getElementById('volume_value');
    volumeRange.addEventListener('input', handleVolumeRange)

    if (settings.volume && settings.volume != 100) {
        volumeValue.innerHTML = settings.volume * 100;
        volumeRange.value = settings.volume * 100;
    }

    function handleVolumeRange(volume) {
        volumeValue.innerHTML = volumeRange.value;
    }

    let adhanVolumeRange = document.getElementById('adhan_volume');
    let adhanVolumeValue = document.getElementById('adhan_volume_value');
    adhanVolumeRange.addEventListener('input', adhanHandleVolumeRange)

    if (settings.adhanVolume && settings.adhanVolume != 100) {
        adhanVolumeValue.innerHTML = settings.adhanVolume * 100;
        adhanVolumeRange.value = settings.adhanVolume * 100;
    }

    function adhanHandleVolumeRange(volume) {
        adhanVolumeValue.innerHTML = adhanVolumeRange.value;
    }

    refresh_button.addEventListener('click', async (e) => {
        try {
            let fetch = require('node-fetch');
            let response = await fetch('http://ip-api.com/json');
            let status = await response?.status;
            if (status !== 200) return
            let body = await response?.json();

            await fs.writeJsonSync(path.join(App_Path, './data/location.json'), {
                country: body?.country,
                countryCode: body?.countryCode,
                regionName: body?.regionName,
                city: body?.city,
                lat: body?.lat,
                lon: body?.lon,
                timezone: body?.timezone,
                ip: body?.query
            }, { spaces: '\t' });
            alrt.style.display = 'inline-flex';
            setTimeout(() => {
                alrt.style.display = 'none';
                window.location.href = "./settings.html";
            }, 1000);
        } catch (error) {
            /* MAYBE THERE IS NO INTERNET CONNECTION SO AVOIDING CRASH */
        }
    });

    // alert update 

    let alert_settings = document.getElementById("alert_settings");
    let alert_settings_title = document.getElementById("alert_settings_title");
    let alert_settings_icon = document.getElementById("alert_settings_icon");
    let app_current_version = document.getElementById("app_current_version");
    let app_latest_version = document.getElementById("app_latest_version");
    let alert_settings_text = document.getElementById("alert_settings_text");
    let Check_for_update_icon = document.getElementById("Check_for_update_icon");

    Check_for_update_icon.addEventListener("click", async e => {

        let response = await fetch('https://api.github.com/repos/rn0x/Altaqwaa-Islamic-Desktop-Application/releases');
        let data = await response.json();
        let latestRelease = data?.[0];
        let lastVersion = latestRelease?.tag_name?.substring(1);

        alert_settings.style.display = "block"

        if (lastVersion === currentRelease) {

            alert_settings_title.innerText = "You already have the latest verison."
            alert_settings_icon.src = "../public/icon/correct.png"
            app_current_version.innerText = currentRelease
            app_latest_version.innerText = lastVersion
        }

        else {

            alert_settings_title.innerText = "A new update is available!"
            alert_settings_icon.src = "../public/icon/x.png"
            app_current_version.innerText = currentRelease
            app_latest_version.innerText = lastVersion
            alert_settings_text.style.display = "block"
        }

        setTimeout(() => {
            alert_settings.style.display = "none"
        }, 5500);

    });

    // Offline Mode

    const modal = document.getElementById("progressModal");
    let totalFiles;
    let downloadedFiles = 0;

    const updateProgress = () => {
        downloadedFiles++;
        const progress = Math.floor((downloadedFiles / totalFiles) * 100);
        document.getElementById("progressBar").style.width = progress + "%";
        document.getElementById("progressText").innerText = `Downloading ${downloadedFiles}/${totalFiles} files...`;

        if (downloadedFiles >= totalFiles) {
            modal.style.display = "none";
        }
    };

    document.getElementsByClassName("close")[0].addEventListener("click", function () {
        modal.style.display = "none";
    });

    function downloadError(error) {
        console.error("Error downloading files:", error);
        modal.style.display = "none";
        errorPopup.style.display = 'inline-flex';
        setTimeout(() => {
            errorPopup.style.display = 'none';
        }, 3500);
    };

    async function downloadFile(audioPath, id, url = false) {
        if (!url) url = `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${id}.mp3`;
        const tempFilePath = path.join(App_Path, `./audio/.temp/${id}.mp3`);

        console.log(url)
        const response = await fetch(url);
        const writer = fs.createWriteStream(tempFilePath);

        response.body.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                updateProgress();
                fs.rename(tempFilePath, audioPath, (err) => {
                    if (err) reject(err)
                    else resolve();
                });
            });
            writer.on('error', reject);
        });
    }

    downloadButton.addEventListener("click", async e => {
        modal.style.display = "block";
        if (!fs.existsSync(path.join(App_Path, "./audio/quran"))) fs.mkdirsSync(path.join(App_Path, "./audio/quran"), { recursive: true });
        if (!fs.existsSync(path.join(App_Path, "./audio/hisnul"))) fs.mkdirsSync(path.join(App_Path, "./audio/hisnul"), { recursive: true });
        if (!fs.existsSync(path.join(App_Path, "./audio/.temp"))) fs.mkdirsSync(path.join(App_Path, "./audio/.temp"), { recursive: true });
        const dlPromises = [];
        totalFiles = 120;
        downloadedFiles = 0;
        let audioPath;
        for (let i = 1; i < 115; i++) {
            audioPath = path.join(App_Path, `./audio/quran/${i}.mp3`);
            if (!fs.existsSync(audioPath))
                dlPromises.push(downloadFile(audioPath, i));
            else updateProgress();
        }

        if (!fs.existsSync(path.join(App_Path, "./audio/recitations/Mishari Al-Afasi")))
            fs.mkdirsSync(path.join(App_Path, "./audio/recitations/Mishari Al-Afasi"), { recursive: true });
        for (let id of ['032', '067', '112', '113', '114', '32-67']) {
            audioPath = path.join(App_Path, `./audio/recitations/Mishari Al-Afasi/${id}.mp3`);
            if (!fs.existsSync(audioPath))
                dlPromises.push(downloadFile(audioPath, 'c' + id, id == '32-67' ?
                    'https://res.cloudinary.com/dpjyefgwu/video/upload/v1708295966/ogbvxbbegidm3aggep9w.mp3' :
                    `https://server8.mp3quran.net/afs/${id}.mp3`));
            else updateProgress();
        }


        Promise.all(dlPromises)
            .then(() => {
                modal.style.display = "block";
                settings.onlineQuran = false;
                fs.writeJsonSync(path.join(App_Path, './data/settings.json'), settings, { spaces: '\t' })
                console.log("All Quran files downloaded successfully");

                let hisnulJson = fs.readJsonSync(path.join(__dirname, '../../data/hisnulMuslim.json'));
                const dlPromises = [];
                totalFiles = 398;
                downloadedFiles = 0;
                for (let topic of hisnulJson) {
                    audioPath = path.join(App_Path, `./audio/hisnul/s${topic.ID}.mp3`);
                    if (!fs.existsSync(audioPath))
                        dlPromises.push(downloadFile(audioPath, "s" + topic.ID, topic.AUDIO_URL));
                    else updateProgress();
                    for (let duaa of topic.DATA) {
                        audioPath = path.join(App_Path, `./audio/hisnul/${duaa.ID}.mp3`);
                        if (!fs.existsSync(audioPath))
                            dlPromises.push(downloadFile(audioPath, duaa.ID, duaa.AUDIO));
                        else updateProgress();
                    }
                }
                Promise.all(dlPromises)
                    .then(() => {
                        settings.onlineAdhkar = false;
                        downloadButton.style.backgroundColor = '#6bc077';
                        fs.writeJsonSync(path.join(App_Path, './data/settings.json'), settings, { spaces: '\t' });
                        alrt.style.display = 'inline-flex';
                        setTimeout(() => {
                            alrt.style.display = 'none';
                        }, 1200);
                    })
                    .catch(error => downloadError(error));
            })
            .catch(error => downloadError(error));

    });



    // save

    save.addEventListener('click', e => {

        dark_mode?.checked ? ipcRenderer.send('background', true)
            : ipcRenderer.send('background', false)

        if (latitude.value !== '') {

            location.lat = Number(latitude.value)
            delete location.country
            delete location.regionName
            delete location.city
            fs.writeJsonSync(path.join(App_Path, './data/location.json'), location, { spaces: '\t' });

        }

        if (longitude.value !== '') {

            location.lon = Number(longitude.value)
            delete location.country
            delete location.regionName
            delete location.city
            fs.writeJsonSync(path.join(App_Path, './data/location.json'), location, { spaces: '\t' });

        }

        if (timezone.value !== '') {

            location.timezone = timezone.value
            delete location.country
            delete location.regionName
            delete location.city
            fs.writeJsonSync(path.join(App_Path, './data/location.json'), location, { spaces: '\t' });

        }

        fs.writeJsonSync(path.join(App_Path, './data/settings.json'), {
            autostart: autostart.checked,
            startHidden: startHidden.checked,
            minimizeToPanel: minimizeToPanel.checked,
            dark_mode: dark_mode.checked,
            Calculation: Calculation.value,
            morning_adhkar_time: morning_adhkar_time.value,
            evening_adhkar_time: evening_adhkar_time.value,
            notifications_adhan: notifications_adhan.checked,
            notifications_adhkar: notifications_adhkar.checked,
            volume: volumeRange.value / 100,
            adhanVolume: adhanVolumeRange.value / 100,
            font_size_quran: settings_font_quran.value,
            font_size_adhkar: settings_font_adhkar.value,
            onlineQuran: settings.onlineQuran,
            onlineAdhkar: settings.onlineAdhkar
        }, { spaces: '\t' });

        alrt.style.display = 'inline-flex';
        setTimeout(() => {
            alrt.style.display = 'none';
            window.location.href = "./settings.html";
        }, 1200);

    })

}