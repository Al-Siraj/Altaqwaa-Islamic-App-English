const { ipcRenderer } = require('electron');
const momentHj = require('moment-hijri');
const moment = require('moment-timezone');
const fs = require('fs-extra');
const path = require('path');
momentHj.locale('en-EN')
const adhanModule = require('../modules/adhan.js')

window.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();
    const App_Path = await ipcRenderer.invoke('App_Path');
    let location = fs.readJsonSync(path.join(App_Path, './data/location.json'));
    let settings = fs.readJsonSync(path.join(App_Path, './data/settings.json'));
    let variables_css = document.getElementById("variables_css");
    let data_hijri = document.getElementById('data_hijri');
    let data_Gregorian = document.getElementById('data_Gregorian');
    let datoday = document.getElementById('datoday');
    let hour_minutes = document.getElementById('hour_minutes');
    let seconds = document.getElementById('seconds');
    let remaining_ = document.getElementById('remaining');
    let remaining_time = document.getElementById('remaining_time');
    let remaining_name = document.getElementById('remaining_name');

    if (settings?.dark_mode) {
        variables_css.href = '../public/css/var.css';
    }

    else if (settings?.dark_mode === false) {
        variables_css.href = '../public/css/var_light.css';
    }

    data_hijri.innerText = momentHj().format('iYYYY/iM/iD');
    data_Gregorian.innerText = momentHj().format('M/D/YYYY');
    datoday.innerText = moment().format('dddd')
    hour_minutes.innerText = moment().tz(location?.timezone).format('h:mm');
    seconds.innerText = moment().tz(location?.timezone).format(': ss A');

    let fastData = adhanModule(path, fs, App_Path, location);

    switch (fastData.nextPrayer) {
        case "fajr":
            remaining_name.innerText = "Fajr";
            remaining_.style.display = 'block'
            remaining_time.style.display = 'block'
            break;

        case "dhuhr":
            remaining_name.innerText = "Dhuhr";
            remaining_.style.display = 'block'
            remaining_time.style.display = 'block'
            break;

        case "asr":
            remaining_name.innerText = "Asr";
            remaining_.style.display = 'block'
            remaining_time.style.display = 'block'
            break;

        case "maghrib":
            remaining_name.innerText = "Maghrib";
            remaining_.style.display = 'block'
            remaining_time.style.display = 'block'
            break;

        case "isha":
            remaining_name.innerText = "Isha";
            remaining_.style.display = 'block'
            remaining_time.style.display = 'block'
            break;

        default:
            remaining_name.innerText = "--";
            remaining_.style.display = 'none'
            remaining_time.style.display = 'none'
            break;
    }

    remaining_time.innerText = fastData.remainingNext;

    setInterval(() => {
        let refreshData = adhanModule(path, fs, App_Path, location);
        switch (refreshData.nextPrayer) {
            case "fajr":
                remaining_name.innerText = "Fajr";
                remaining_.style.display = 'block'
                remaining_time.style.display = 'block'
                break;

            case "dhuhr":
                remaining_name.innerText = "Dhuhr";
                remaining_.style.display = 'block'
                remaining_time.style.display = 'block'
                break;

            case "asr":
                remaining_name.innerText = "Asr";
                remaining_.style.display = 'block'
                remaining_time.style.display = 'block'
                break;

            case "maghrib":
                remaining_name.innerText = "Maghrib";
                remaining_.style.display = 'block'
                remaining_time.style.display = 'block'
                break;

            case "isha":
                remaining_name.innerText = "Isha";
                remaining_.style.display = 'block'
                remaining_time.style.display = 'block'
                break;

            default:
                remaining_name.innerText = "--";
                remaining_.style.display = 'none'
                remaining_time.style.display = 'none'
                break;
        }

        remaining_time.innerText = refreshData.remainingNext;
        data_hijri.innerText = momentHj().format('iYYYY/iM/iD');
        data_Gregorian.innerText = momentHj().format('M/D/YYYY');
        datoday.innerText = moment().format('dddd');
        hour_minutes.innerText = moment().tz(location?.timezone).format('h:mm');
        seconds.innerText = moment().tz(location?.timezone).format(': ss A');
    }, 1000);
});