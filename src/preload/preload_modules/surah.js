module.exports = function surah(fs, path, App_Path) {
 
    let Quran_json = fs.readJsonSync(path.join(__dirname, '../../data/Quran.json'));
    fs.writeJson(path.join(App_Path, './data/Now.json'), { id: 0});

    for (let item of Quran_json) {

        let quran = document.getElementById('quran');
        let create_but = document.createElement("button");
        let surah_div = document.createElement("div");
        let surah_number_div = document.createElement("div");
        let surah_number = document.createElement("div");
        let surah_name_div = document.createElement("div");
        let surah_name = document.createElement("div");
        let surah_name_en = document.createElement("div");
        let surah_verses = document.createElement("div");

        quran.appendChild(create_but);
        create_but.id = `surah_number_${item?.Number}`
        create_but.className = 'surah'
        create_but.appendChild(surah_div);
        surah_div.className = 'surah_div'

        surah_div.appendChild(surah_number_div);
        surah_number_div.className = 'surah_number_div'
        surah_number_div.appendChild(surah_number);
        surah_number.innerText = `${item?.Number}`

        surah_div.appendChild(surah_name_div);
        surah_name_div.className = 'surah_name_div'
        surah_name_div.appendChild(surah_name);
        surah_name.innerText = item?.Name_Translation;
        surah_name.className = 'surah_name'

        surah_name_div.appendChild(surah_name_en);
        surah_name_en.innerText = item?.English_Name;
        surah_name_en.className = 'surah_name_en'

        create_but.appendChild(surah_verses);
        surah_verses.innerText = `${item?.Number_Verses} Ayahs`
        surah_verses.className = 'surah_verses'

    }

    let surah = Array.from(document.getElementsByClassName('surah'));

    for (let item of surah) {
        let surah_number = document.getElementById(item.id)
        let id = item?.id
        surah_number.addEventListener('click', e => {
            fs.writeJsonSync(path.join(App_Path, './data/Now.json'), { id: id.split("_")[2]});
            window.location.href = '../pages/quran.html'
        });
    }
}