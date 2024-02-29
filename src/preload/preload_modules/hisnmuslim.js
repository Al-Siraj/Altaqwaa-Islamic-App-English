module.exports = function hisnmuslim(fs, path, App_Path, settings) {

    let hisnmuslim = fs.readJsonSync(path.join(__dirname, '../../data/hisnulMuslim.json'));
    let popup = document.getElementById('popup');
    let closePopup = document.getElementById('mp3_hisn_closed');
    let audioPlayer = document.getElementById('mp3_hisn_src');
    let ul_hisn = document.getElementById('ul_hisn');
    let subjects = document.getElementsByClassName('class_hisn');
    let duaasContainer = document.getElementById('duaasContainer');


    closePopup.addEventListener('click', e => {
        audioPlayer.pause();
        popup.style.display = 'none'
        duaasContainer.innerHTML = ''
        document.body.style.overflow = 'visible';
    });

    for (let item of hisnmuslim) {
        let createLi = document.createElement("li");
        ul_hisn.appendChild(createLi);
        createLi.innerText = item?.TITLE
        createLi.id = item.ID
        createLi.className = 'class_hisn'
    }

    Array.from(subjects).forEach((subject, item) => {
        subject.addEventListener('click', e => {
            let i = 1
            for (let duaa of hisnmuslim[item].DATA) {
                let duaaContainer = document.createElement("div");
                duaaContainer.className = 'adhkar'
                duaaContainer.id = `h${item}_d${i}`
                duaaContainer.innerHTML = `<p class="text">${duaa.ARABIC_TEXT}</p>
                                           <p class="text_bottom">${duaa.TRANSLATED_TEXT}</p>
                                           <ul class="copy_and_paste"><li class="tkrar">
                                           <p>Recite: </p><p class="tkrar_number">${duaa.REPEAT}</p></li>
                                           <li><img src="../public//icon/copy.png" class="icon_c_p" id="copy"></li></ul>`;
                duaasContainer.appendChild(duaaContainer);
                i++
            }
            popup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            audioPlayer.src = settings.onlineAdhkar ? hisnmuslim[item].AUDIO_URL : path.join(App_Path, `./audio/hisnul/s${hisnmuslim[item].ID}.mp3`);
        })
    })

}