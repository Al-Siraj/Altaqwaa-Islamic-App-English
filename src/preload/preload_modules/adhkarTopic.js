const url = require('url');
const querystring = require('querystring');

module.exports = function adhkarTopic(fs, path, App_Path, settings, tempSettings) {
    let adhkarJson = fs.readJsonSync(path.join(__dirname, '../../data/azkarEnglish.json'));
    let adhkarContainer = document.getElementById('adhkarContainer');
    const parsedUrl = url.parse(window.location.href);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const topic = parsedQuery.topic;
    const title = document.getElementById("topic");
    const copyImage = settings?.dark_mode ? "../public/icon/copy.png" : "../public/icon/dark/copy.png";
    const playIcon = settings?.dark_mode ? "../public/icon/play.png" : "../public/icon/dark/play.png";
    const pauseIcon = settings?.dark_mode ? "../public/icon/pause.png" : "../public/icon/dark/pause.png";
    const playMenu = document.querySelector('.play-menu');
    const dropdown = document.querySelector('.dropdown');

    title.innerHTML = adhkarJson[topic].TITLE;
    let id = sectionId = 1;
    let subtopics = adhkarJson[topic].SUBTOPICS;
    const hasSubtopics = subtopics.length == 1 ? false : true;
    for (let subtopic of subtopics) {
        subtopicElement = document.createElement("div");
        subtopicElement.id = 'subtopic';
        // subtopic.src = settings.onlineAdhkar ? subtopic.AUDIO_URL : path.join(App_Path, `./audio/hisnul/s${subtopic.ID}.mp3`);
        if (settings.onlineAdhkar) subtopic.src = subtopic.AUDIO_URL;
        else if (subtopic.ID == 0) subtopic.src = path.join(App_Path, `./audio/${subtopic.LOCAL}`);
        else subtopic.src = path.join(App_Path, `./audio/hisnul/s${subtopic.ID}.mp3`);
        subtopicElement.innerHTML = `<div class="sub-topic-title">
                                <div class="topic-text"> ➣ ${subtopic.TITLE}</div>
                                <div class="play-text">Play Section</div>
                                    <img class="section-play-button" src="${playIcon}">
                                    <audio id="section-${sectionId}" src="${subtopic.src}"></audio>
                              </div>`;
        adhkarContainer.appendChild(subtopicElement);
        playElement = document.createElement("label");
        playElement.innerHTML = `<input type="checkbox" id="play-${sectionId}"> ${subtopic.TITLE}`;
        playMenu.appendChild(playElement);
        sectionId++;
        for (let duaa of subtopic.DATA) {
            let tkrar = duaa.REPEAT == 1 ? 'Recite once' : `Recite ${duaa.REPEAT} times`;
            let adhkar = document.createElement("div");
            adhkar.className = 'adhkar'
            if (settings.onlineAdhkar) duaa.src = duaa.AUDIO_URL;
            else if (duaa.ID == 0) duaa.src = path.join(App_Path, `./audio/${duaa.LOCAL}`);
            else duaa.src = path.join(App_Path, `./audio/hisnul/${duaa.ID}.mp3`);
            adhkar.innerHTML = `<div class="arabic_duaa">${duaa.ARABIC_TEXT}</div>
                                    <div class="translation">${duaa.TRANSLATED_TEXT}</div>
                                    <div class="transliteration">${duaa.LANGUAGE_ARABIC_TRANSLATED_TEXT}</div>
                                    <div class="repeat-copy-container">
                                        <div class="repeat">${tkrar}</div>
                                        <div class="play-wrapper">
                                            <img class="play-button" audio-id="${id}" src="${playIcon}">
                                            <audio id="${id}" src="${duaa.src}"></audio>
                                        </div>
                                        <div class="copy"><img src="${copyImage}" class="icon_c_p"></div>
                                    </div>`
            hasSubtopics ? subtopicElement.appendChild(adhkar) : adhkarContainer.appendChild(adhkar);
            id++
        }
    }

    document.getElementById("back_to_list").addEventListener("click", e => {
        window.location.href = "./adhkar.html"
    });

    const playButtons = document.querySelectorAll('.play-button');
    const sectionPlayButtons = document.querySelectorAll('.section-play-button');

    const pauseAll = async function () {
        const audioElements = document.querySelectorAll('audio');
        Array.from(audioElements).forEach((audioElement) => {
            audioElement.pause();
        });
        Array.from(playButtons).forEach((button) => {
            button.src = playIcon;
        });
        Array.from(sectionPlayButtons).forEach((button) => {
            button.src = playIcon;
        });
    }

    const copyButtons = document.querySelectorAll('.copy');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find the associated text to copy
            const textContainer = button.parentNode.parentNode.querySelector('.arabic_duaa');
            const textToCopy = textContainer.textContent;
            // Create a temporary textarea to hold the text
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            // Select the text in the textarea
            textarea.select();
            // Copy the selected text to the clipboard
            document.execCommand('copy');
            // Remove the temporary textarea
            document.body.removeChild(textarea);
        });
    });

    // Add click event listener to each play button
    playButtons.forEach(button => {
        button.addEventListener('click', function () {
            const audioId = this.getAttribute('audio-id');
            const audioElement = document.getElementById(audioId);
            if (audioElement.paused) {
                pauseAll();
                audioElement.play();
                button.src = pauseIcon;
            } else {
                audioElement.pause();
                button.src = playIcon;
            }
        });
        const audioId = button.getAttribute('audio-id');
        const audioElement = document.getElementById(audioId);
        audioElement.addEventListener('ended', function () {
            button.src = "../public/icon/play.png"; // Change to your play icon path
        });
    });

    sectionPlayButtons.forEach(button => {
        let sectionInd = 1;
        const audioElement = button.parentNode.querySelector('audio');
        button.addEventListener('click', function () {
            if (audioElement.paused) {
                pauseAll();
                audioElement.play();
                button.src = pauseIcon;
            } else {
                audioElement.pause();
                button.src = playIcon;
            }
        });
        audioElement.addEventListener('ended', function () {
            button.src = "../public/icon/play.png"; // Change to your play icon path
        });
    });

    // GLOBAL AUDIO PLAYER
    const globalPlay = document.getElementById('icon_mp3')
    const globalAudio = document.getElementById('audio_mp3')
    globalPlay.src = playIcon;

    const pause = async function () {
        globalPlay.src = playIcon;
        playBtn.innerHTML = svgPlay;
        globalAudio.pause()
    }

    const play = async function () {
        globalPlay.src = pauseIcon;
        playBtn.innerHTML = svgPause;
        globalAudio.play()
    }

    const pausePlay = async function () {
        if (globalAudio.paused) {
            playMenu.style.display = 'none';
            pauseAll();
            sectionsToPlay = [];
            playInputs.forEach((input, index) => {
                if (input.checked) sectionsToPlay.push(index);
            });
            if (sectionsToPlay.length == 0) for (let i = 0; i < subtopics.length; i++) { sectionsToPlay.push(i); }
            if (edited && extractFileName(globalAudio.src) != extractFileName(subtopics[sectionsToPlay[0]].src)) {
                edited = false;
                globalInd = 0;
                globalAudio.src = subtopics[sectionsToPlay[globalInd]].src;
            }
            play();
        } else {
            pause();
        }
    }

    const extractFileName = (urlOrPath) => {
        const parsedPath = path.parse(urlOrPath);
        return parsedPath.base;
    };

    let globalInd = 0;
    let edited = true;

    const playInputs = document.querySelectorAll('.play-menu>label>input');
    playInputs.forEach(playInput => {
        playInput.addEventListener('click', function () {
            edited = true;
        })
    })


    let sectionsToPlay = [];
    globalPlay.addEventListener('click', pausePlay);

    globalAudio.addEventListener('ended', function () {
        if (globalInd < sectionsToPlay.length - 1) {
            globalInd++;
            console.log(globalInd)
            this.src = subtopics[sectionsToPlay[globalInd]].src;
            this.play();
        } else {
            globalInd = 0;
            this.src = subtopics[sectionsToPlay[globalInd]].src;
            pause()
        }
    })

    playMenu.style.display = 'none'
    dropdown.addEventListener('click', function () {
        playMenu.style.display = playMenu.style.display == 'none' ? 'grid' : 'none';
    });

    // SETTINGS
    const settingsButton = document.getElementById('settings_button');
    const settingsMenu = document.querySelector('.settings-menu');
    const toggleTranslation = document.getElementById('toggleTranslation');
    const toggleTransliteration = document.getElementById('toggleTransliteration');
    const translations = document.querySelectorAll('.translation');
    const transliterations = document.querySelectorAll('.transliteration');
    toggleTranslation.checked = tempSettings?.adhkarTranslation;
    toggleTransliteration.checked = tempSettings?.adhkarTransliteration;

    settingsMenu.style.display = 'none'
    settingsButton.addEventListener('click', function () {
        settingsMenu.style.display = settingsMenu.style.display == 'none' ? 'grid' : 'none';
    });

    document.addEventListener('click', (event) => {
        if (event.target !== playMenu && event.target !== dropdown && !playMenu.contains(event.target))
            playMenu.style.display = 'none';
    })

    document.addEventListener('click', (event) => {
        if (event.target !== settingsMenu && event.target !== settingsButton && !settingsMenu.contains(event.target))
            settingsMenu.style.display = 'none';
    })

    const toggleTranslationFunc = async function () {
        Array.from(translations).forEach((translation) => {
            translation.style.display = toggleTranslation.checked ? 'block' : 'none';
        });
    }

    const toggleTransliterationFunc = async function () {
        Array.from(transliterations).forEach((transliteration) => {
            transliteration.style.display = toggleTransliteration.checked ? 'block' : 'none';
        });
    }

    // Audio Player
    const audioPlayer = document.getElementById('audioPlayer')
    const openPlayer = document.getElementById('openPlayer');
    const playBtn = document.getElementById('playBtn');
    const previous = document.getElementById('previous');
    const next = document.getElementById('next');
    // const closeBtn = document.getElementById('closeBtn');
    const progressBar = document.getElementById('progressBar');
    const svgPath = path.join(__dirname, `../../public/icon/svg`)
    const svgPlay = fs.readFileSync(path.join(svgPath, 'play.svg'), 'utf-8');
    const svgPause = fs.readFileSync(path.join(svgPath, 'pause.svg'), 'utf-8');
    let isDragging = false;

    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            event.preventDefault();
            pausePlay()
        }
    });

    playBtn.addEventListener('click', pausePlay);

    openPlayer.addEventListener('click', function () {
        openPlayer.classList.add('hidden')
        audioPlayer.classList.remove('hidden')
    })

    previous.addEventListener('click', function () {
        if (globalAudio.currentTime / globalAudio.duration > 0.2 || globalInd == 0) {
            globalAudio.currentTime = 0;
        } else {
            // let cmdPlay = globalAudio.playing ? true : false;
            globalInd--
            console.log(globalInd)
            globalAudio.src = subtopics[sectionsToPlay[globalInd]].src;
            play();
        }

    })

    next.addEventListener('click', function () {
        globalAudio.currentTime = globalAudio.duration;
        play();
    })
    // closeBtn.addEventListener('click', function () {
    //     pause()
    //     audioPlayer.classList.add('hidden')
    //     openPlayer.classList.remove('hidden')
    //     globalAudio.currentTime = 0;
    // })

    // Event listener for mouse down on the progress bar
    progressBar.addEventListener('mousedown', function (event) {
        isDragging = true;
        pause();
        updateProgress(event);
    });

    // Event listener for mouse move on the document
    progressBar.addEventListener('mousemove', function (event) {
        if (isDragging) updateProgress(event);
    });

    // Event listener for mouse up on the document
    progressBar.addEventListener('mouseup', function () {
        isDragging = false;
        play();
    });

    // Function to update the progress based on mouse position
    function updateProgress(event) {
        const rect = progressBar.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const progressBarWidth = rect.width;
        const progress = offsetX / progressBarWidth;
        const currentTime = progress * globalAudio.duration;
        globalAudio.currentTime = currentTime;
        progressBar.value = progress * 100;
    }

    globalAudio.addEventListener('timeupdate', function () {
        if (!isDragging) {
            const progress = (globalAudio.currentTime / globalAudio.duration) * 100;
            progressBar.value = !globalAudio.duration ? 0 : progress;
        }
    });

    toggleTranslation.addEventListener('change', toggleTranslationFunc);
    toggleTransliteration.addEventListener('change', toggleTransliterationFunc);
    toggleTranslationFunc();
    toggleTransliterationFunc();
    window.addEventListener('beforeunload', function () {
        tempSettings.adhkarTranslation = toggleTranslation.checked;
        tempSettings.adhkarTransliteration = toggleTransliteration.checked;
        fs.writeJsonSync(path.join(App_Path, './data/tempSettings.json'), tempSettings, { spaces: '\t' })
    });

}