const { ipcRenderer } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');
const adhanModule = require('../modules/adhan.js')

window.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();
    
    let App_Path = await ipcRenderer?.invoke('App_Path');
    let settings = fs.readJsonSync(path.join(App_Path, './data/settings.json'));
    let variables_css = document.getElementById("variables_css");
    let icon_closed_window = document.getElementById("icon_closed_window");
    const audio = document.getElementById('audio');
    const title = document.getElementById('text');
    let playing = false;

    document.getElementById('closed').addEventListener('click', e => {
        audio.pause();
        ipcRenderer.send('closed3');
    });

    audio.addEventListener('ended', () => ipcRenderer.send('closed3'))

    if (settings?.dark_mode) {
        variables_css.href = '../public/css/var.css';
        icon_closed_window.srcset = '../public/icon/closed.png';
    } 
    else if (settings?.dark_mode === false) {
        variables_css.href = '../public/css/var_light.css';
        icon_closed_window.srcset = '../public/icon/dark/closed.png';
    }

    while (true) {

        await new Promise(resolve => setTimeout(resolve, 10000));
        let location = fs.readJsonSync(path.join(App_Path, './data/location.json'));
        let settings = fs.readJsonSync(path.join(App_Path, './data/settings.json'));
        let data = adhanModule(path, fs, App_Path, location);
        let time_now_adhan = moment().tz(location?.timezone).format('LT');
        let time_now_adhkar = moment().tz(location?.timezone).format('HH:mm');

        if (time_now_adhan === data.fajr && settings?.notifications_adhan && !playing) {
            playing = true;
            ipcRenderer.send('show3');
            title.innerText = 'Time for Fajr Prayer'
            audio.src = path.join(__dirname, '../public/audio/002.mp3');
            audio.volume = settings?.adhanVolume || 1;
            setTimeout(() => playing = false, 65000);
        }

        else if (time_now_adhan === data.dhuhr && settings?.notifications_adhan && !playing) {
            playing = true;
            ipcRenderer.send('show3');
            title.innerText = 'Time for Dhuhr Prayer'
            audio.src = path.join(__dirname, '../public/audio/001.mp3');
            audio.volume = settings?.adhanVolume || 1;
            setTimeout(() => playing = false, 65000);
        }

        else if (time_now_adhan === data.asr && settings?.notifications_adhan && !playing) {
            playing = true;
            playing = true
            ipcRenderer.send('show3');
            title.innerText = 'Time for Asr Prayer'
            audio.src = path.join(__dirname, '../public/audio/001.mp3');
            audio.volume = settings?.adhanVolume || 1;
            setTimeout(() => playing = false, 65000);
        }

        else if (time_now_adhan === data.maghrib && settings?.notifications_adhan && !playing) {
            playing = true;
            ipcRenderer.send('show3');
            title.innerText = 'Time for Maghrib Prayer'
            audio.src = path.join(__dirname, '../public/audio/001.mp3');
            audio.volume = settings?.adhanVolume || 1;
            setTimeout(() => playing = false, 65000);
        }

        else if (time_now_adhan === data.isha && settings?.notifications_adhan && !playing) {
            playing = true;
            ipcRenderer.send('show3');
            title.innerText = 'Time for Isha Prayer'
            audio.src = path.join(__dirname, '../public/audio/001.mp3');
            audio.volume = settings?.adhanVolume || 1;
            setTimeout(() => playing = false, 65000);
        }

        else if (time_now_adhkar === settings?.morning_adhkar_time && settings?.notifications_adhkar && !playing) {
            playing = true;
            ipcRenderer.send('show3');
            title.innerText = 'Words of Remembrance for the Morning';
            audio.src = path.join(__dirname, '../public/audio/AM.mp3');
            audio.volume = settings?.adhanVolume || 1;
            setTimeout(() => playing = false, 65000);
        }

        else if (time_now_adhkar === settings?.evening_adhkar_time && settings?.notifications_adhkar && !playing) {
            playing = true;
            ipcRenderer.send('show3');
            title.innerText = 'Words of Remembrance for the Evening';
            audio.src = path.join(__dirname, '../public/audio/PM.mp3');
            audio.volume = settings?.adhanVolume || 1;
            setTimeout(() => playing = false, 65000);
        }

    }

});
