function translate_prayer_time(page) {
    let elements_to_translate = page.getElementsByClassName('slah')
    elements_to_translate.push(page.getElementById('remaining'))
    let translations = {
        'الفجر': 'Fajr',
        'الظهر': 'Dhuhr',
        'العصر': 'Asr',
        'المغرب': 'Maghrib',
        'العشاء': 'Isha',
        'الوقت المتبقي لرفع الأذان لصلاة': 'Time remaining until'
    }
    for (let item of elements_to_translate) {
        item.innerText = translations[item.innerText]
    }
}

function translate_all() {
    let pageIds = ['page_quran', 'page_quran_mp3', 'page_adhkar', 'page_hisnmuslim', 'prayer_time', 'page_settings']
    for (let pageId of pageIds) {
        let page = document.getElementById(pageId)
        page.getEle
        if (page) {
            switch (pageId) {
                case 'prayer_time':
                    translate_prayer_time(page)
            }
        }
    }
}

translate_all()

