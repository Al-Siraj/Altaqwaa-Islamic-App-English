const momentHj = require('moment-hijri');
const moment = require('moment-timezone');
const adhanModule = require('../../modules/adhan.js')
momentHj.locale('en-EN')

module.exports = function prayer_time(fs, path, App_Path, settings) {

    let location = fs.readJsonSync(path.join(App_Path, './data/location.json'));
    let dark_mode = settings?.dark_mode;
    let english = true;
    let data_hijri = document.getElementById('data_hijri');
    let data_Gregorian = document.getElementById('data_Gregorian');
    let datoday = document.getElementById('datoday');
    let country = document.getElementById('country');
    let hour_minutes = document.getElementById('hour_minutes');
    let seconds = document.getElementById('seconds');
    let time_fajr = document.getElementById('time_fajr');
    let time_dhuhr = document.getElementById('time_dhuhr');
    let time_asr = document.getElementById('time_asr');
    let time_maghrib = document.getElementById('time_maghrib');
    let time_isha = document.getElementById('time_isha');
    let fajr_li = document.getElementById('fajr_li');
    let dhuhr_li = document.getElementById('dhuhr_li');
    let asr_li = document.getElementById('asr_li');
    let maghrib_li = document.getElementById('maghrib_li');
    let isha_li = document.getElementById('isha_li');
    let remaining_ = document.getElementById('remaining');
    let remaining_time = document.getElementById('remaining_time');
    let remaining_name = document.getElementById('remaining_name');

    data_hijri.innerText = momentHj().format('iYYYY/iM/iD');
    data_Gregorian.innerText = momentHj().format('M/D/YYYY');
    datoday.innerText = english ? moment().format('dddd'): momentHj().locale('ar-SA').format('dddd');
    hour_minutes.innerText = moment().tz(location?.timezone).format('h:mm');
    seconds.innerText = moment().tz(location?.timezone).format(': ss A');

    if (location?.country && location?.regionName && location?.city) {
        country.innerHTML = `${location?.country} ${location?.regionName} <span id="city">${location?.city}</span>`
        country.style.display = 'block'
    }

    else if (location?.timezone && location.timezone != null && location.timezone != undefined) {
        let text = english ? 'Time Zone: ' : 'المنطقة الزمنية:' 
        country.innerHTML = `${text} <span id="city">${location?.timezone}</span>`
        country.style.display = 'block'
    }

    else if (location?.country === undefined) {
        country.innerHTML = ''
        country.style.display = 'none'
    }

    let data = adhanModule(path, fs, App_Path, location);

    remaining_time.innerText = data.remainingNext;
    time_fajr.innerText = data.fajr;
    time_dhuhr.innerText = data.dhuhr;
    time_asr.innerText = data.asr;
    time_maghrib.innerText = data.maghrib;
    time_isha.innerText = data.isha;

    switch (data.nextPrayer) {
        case "fajr":
            remaining_name.innerText = english ? "Fajr" : "الفجر";
            remaining_.style.display = 'block'
            remaining_time.style.display = 'block'
            fajr_li.style.background = dark_mode ? '#6bc077' : '#b0bec5'
            dhuhr_li.style.background = null
            asr_li.style.background = null
            maghrib_li.style.background = null
            isha_li.style.background = null
            break;

        case "dhuhr":
            remaining_name.innerText = english ? "Dhuhr" : "الظهر";
            remaining_.style.display = 'block'
            remaining_time.style.display = 'block'
            fajr_li.style.background = null
            dhuhr_li.style.background = dark_mode ? '#6bc077' : '#b0bec5'
            asr_li.style.background = null
            maghrib_li.style.background = null
            isha_li.style.background = null
            break;

        case "asr":
            remaining_name.innerText = english ? "Asr" : "العصر";
            remaining_.style.display = 'block'
            remaining_time.style.display = 'block'
            fajr_li.style.background = null
            dhuhr_li.style.background = null
            asr_li.style.background = dark_mode ? '#6bc077' : '#b0bec5'
            maghrib_li.style.background = null
            isha_li.style.background = null
            break;

        case "maghrib":
            remaining_name.innerText = english ? "Maghrib" : "المغرب";
            remaining_.style.display = 'block'
            remaining_time.style.display = 'block'
            fajr_li.style.background = null
            dhuhr_li.style.background = null
            asr_li.style.background = null
            maghrib_li.style.background = dark_mode ? '#6bc077' : '#b0bec5'
            isha_li.style.background = null
            break;

        case "isha":
            remaining_name.innerText = english ? "Isha" : "العشاء";
            remaining_.style.display = 'block'
            remaining_time.style.display = 'block'
            fajr_li.style.background = null
            dhuhr_li.style.background = null
            asr_li.style.background = null
            maghrib_li.style.background = null
            isha_li.style.background = dark_mode ? '#6bc077' : '#b0bec5'
            break;

        default:
            remaining_name.innerText = "--";
            remaining_.style.display = 'none'
            remaining_time.style.display = 'none'
            fajr_li.style.background = null
            dhuhr_li.style.background = null
            asr_li.style.background = null
            maghrib_li.style.background = null
            isha_li.style.background = null
            break;
    }

    setInterval(() => {
        data_hijri.innerText = momentHj().format('iYYYY/iM/iD');
        data_Gregorian.innerText = momentHj().format('M/D/YYYY');
        datoday.innerText = english ? moment().format('dddd'): momentHj().locale('ar-SA').format('dddd');
        hour_minutes.innerText = moment().tz(location?.timezone).format('h:mm');
        seconds.innerText = moment().tz(location?.timezone).format(': ss A');

        let data = adhanModule(path, fs, App_Path, location);

        remaining_time.innerText = data.remainingNext;
        time_fajr.innerText = data.fajr;
        time_dhuhr.innerText = data.dhuhr;
        time_asr.innerText = data.asr;
        time_maghrib.innerText = data.maghrib;
        time_isha.innerText = data.isha;

        switch (data.nextPrayer) {
            case "fajr":
                remaining_name.innerText = english ? "Fajr" : "الفجر";
                remaining_.style.display = 'block'
                remaining_time.style.display = 'block'
                fajr_li.style.background = dark_mode ? '#6bc077' : '#b0bec5'
                dhuhr_li.style.background = null
                asr_li.style.background = null
                maghrib_li.style.background = null
                isha_li.style.background = null
                break;

            case "dhuhr":
                remaining_name.innerText = english ? "Dhuhr" : "الظهر";
                remaining_.style.display = 'block'
                remaining_time.style.display = 'block'
                fajr_li.style.background = null
                dhuhr_li.style.background = dark_mode ? '#6bc077' : '#b0bec5'
                asr_li.style.background = null
                maghrib_li.style.background = null
                isha_li.style.background = null
                break;

            case "asr":
                remaining_name.innerText = english ? "Asr" : "العصر";
                remaining_.style.display = 'block'
                remaining_time.style.display = 'block'
                fajr_li.style.background = null
                dhuhr_li.style.background = null
                asr_li.style.background = dark_mode ? '#6bc077' : '#b0bec5'
                maghrib_li.style.background = null
                isha_li.style.background = null
                break;

            case "maghrib":
                remaining_name.innerText = english ? "Maghrib" : "المغرب";
                remaining_.style.display = 'block'
                remaining_time.style.display = 'block'
                fajr_li.style.background = null
                dhuhr_li.style.background = null
                asr_li.style.background = null
                maghrib_li.style.background = dark_mode ? '#6bc077' : '#b0bec5'
                isha_li.style.background = null
                break;

            case "isha":
                remaining_name.innerText = english ? "Isha" : "العشاء";
                remaining_.style.display = 'block'
                remaining_time.style.display = 'block'
                fajr_li.style.background = null
                dhuhr_li.style.background = null
                asr_li.style.background = null
                maghrib_li.style.background = null
                isha_li.style.background = dark_mode ? '#6bc077' : '#b0bec5'
                break;

            default:
                remaining_name.innerText = "لايوجد" ;
                remaining_.style.display = 'none'
                remaining_time.style.display = 'none'
                fajr_li.style.background = null
                dhuhr_li.style.background = null
                asr_li.style.background = null
                maghrib_li.style.background = null
                isha_li.style.background = null
                break;
        }
    }, 1000);
}