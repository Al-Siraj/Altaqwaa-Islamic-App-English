const url = require('url');
const querystring = require('querystring');

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function flattenArrays(arrays) {
    return [].concat(...arrays);
}

function searchIndex(arr, target) {
    let end = arr.length;
    if (end == 0) return -1;
    if (target > arr[end - 1]) return end - 1;
    let start = 0;
    let ans = 0;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (arr[mid] >= target) {
            end = mid - 1;
        } else {
            ans = mid;
            start = mid + 1;
        }
    }
    return ans;
}

function searchValues(objects, searchKeys, indLoop = false) {
    const values = [];

    function search(obj, keys) {
        if (keys.length === 0) {
            values.push(obj);
            return;
        }

        const key = keys[0];
        const remainingKeys = keys.slice(1);

        if (indLoop && key === parseInt(key, 10)) {
            for (const item of obj) {
                search(item[key], remainingKeys)
            }
        } else if (obj.hasOwnProperty(key)) {
            search(obj[key], remainingKeys);
        } else if (Array.isArray(obj)) {
            for (const item of obj) {
                search(item, keys);
            }
        }
    }

    for (const obj of objects) {
        search(obj, searchKeys);
    }

    return values;
}

function extractTextValues(arr) {
    // <div class="tooltiptext">${obj.translation.text}</div>
    var textValues = arr.map(function (obj) {
        return `<p class="word tooltip">${obj.text}
        </p>`;
    });

    return textValues.join('');
}

module.exports = function Quran(fs, path, App_Path, settings, tempSettings) {
    function readFilesInDirectory(directoryPath) {
        const files = fs.readdirSync(directoryPath);
        const result = {};
        files.forEach((fileName) => {
            const filePath = path.join(directoryPath, fileName);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            result[path.parse(fileName).name] = fileContent;
        });
        return result;
    }
    const svgMap = readFilesInDirectory(path.join(__dirname, `../../public/icon/svg`))
    const parsedUrl = url.parse(window.location.href);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const id = parsedQuery.id ? parsedQuery.id : fs.readJsonSync(path.join(App_Path, './data/Now.json')).id;
    if (id == 0) window.location.href = './surah.html'
    const surahJson = fs.readJsonSync(path.join(__dirname, `../../data/quran/${id}.json`));
    const englishWords = searchValues(surahJson['verses'], ['words', 'translation', 'text'])
    const audioJson = fs.readJsonSync(path.join(__dirname, `../../data/verse_segments/${id}.json`));
    const verseSegments = audioJson.verse_timings;
    const footnoteJson = fs.readJsonSync(path.join(__dirname, `../../data/footnotes/${id}.json`));

    let dark_mode = settings?.dark_mode
    let verseIndex = 0;
    let verseUserIndex = 0;
    let wordIndex = 0
    let showTooltips = false

    // Insert Heading 
    document.getElementById('surah_id').innerText = id;
    document.getElementById('surah_name').innerText = String(id).padStart(3, '0') + ' surah'
    document.getElementById('surah_en_name').innerText = surahJson.transliteratedName
    document.getElementById('bsmlh').innerHTML = (id === '9' | id === '1') ? '' : svgMap.bsml

    // Insert verses/text
    let surahContainer = document.getElementById('surah_text');
    for (let verse of surahJson.verses.slice(0, 10)) {
        let verse_container = document.createElement("div");
        verse_container.className = 'verse_container'
        let style = `font-family: 'p${verse.words[0].page_number}';`
        verse_container.innerHTML = `<div class="arabic_verse_by_words" style="${style}">${extractTextValues(verse.words)}</div>
                                     <div class="translated_verse">${verse.translations[0].text}</div>
                                     <div class="footnote_container" note="" style="display: none"></div>
                                     <div class="transliterated_verse">${verse.translations[1].text}</div>`
        surahContainer.appendChild(verse_container);
    }
    // Settings
    const settingsButton = document.getElementById('settings_button');
    const settingsMenu = document.querySelector('.settings-menu');
    const toggleTranslation = document.getElementById('toggleTranslation');
    const toggleTransliteration = document.getElementById('toggleTransliteration');
    const enableAutoScroll = document.getElementById('enableAutoScroll');
    const translations = document.getElementsByClassName('translated_verse');
    const transliterations = document.getElementsByClassName('transliterated_verse');
    const footnoteContainers = document.getElementsByClassName('footnote_container');
    toggleTranslation.checked = tempSettings?.quranTranslation;
    toggleTransliteration.checked = tempSettings?.quranTransliteration;
    enableAutoScroll.checked = tempSettings?.enableAutoScroll;

    settingsMenu.style.display = 'none';
    settingsButton.addEventListener('click', function () {
        settingsMenu.style.display = settingsMenu.style.display == 'none' ? 'grid' : 'none';
    });

    const toggleTranslationFunc = async function () {
        Array.from(translations).forEach((translation) => {
            translation.style.display = toggleTranslation.checked ? 'block' : 'none';
        });
        if (!toggleTranslation.checked) {
            Array.from(footnoteContainers).forEach((footnoteContainer) => {
                footnoteContainer.style.display = 'none';
            });
        }
    }

    const toggleTransliterationFunc = async function () {
        Array.from(transliterations).forEach((transliteration) => {
            transliteration.style.display = toggleTransliteration.checked ? 'block' : 'none';
        });
    }

    toggleTranslation.addEventListener('change', toggleTranslationFunc);
    toggleTransliteration.addEventListener('change', toggleTransliterationFunc);
    toggleTranslationFunc();
    toggleTransliterationFunc();

    const loadRemainder = () => {
        for (let verse of surahJson.verses.slice(10)) {
            let verse_container = document.createElement("div");
            verse_container.className = 'verse_container'
            let style = `font-family: 'p${verse.words[0].page_number}';`
            verse_container.innerHTML = `<div class="arabic_verse_by_words" style="${style}">${extractTextValues(verse.words)}</div>
                                         <div class="translated_verse">${verse.translations[0].text}</div>
                                         <div class="footnote_container" note="" style="display: none"></div>
                                         <div class="transliterated_verse">${verse.translations[1].text}</div>`
            surahContainer.appendChild(verse_container);
        };
        toggleTranslationFunc();
        toggleTransliterationFunc();
        let footnotes = document.querySelectorAll("sup");
        Array.from(footnotes).forEach((footnote) => {
            const footnoteContainer = footnote.parentNode.nextElementSibling;
            footnote.addEventListener('click', function () {
                const footnoteId = this.getAttribute('foot_note');
                if (footnoteContainer.style.display == 'none') {
                    footnoteContainer.innerHTML = `<b>Footnote ${this.textContent}</b><br>${footnoteJson[footnoteId]}`;
                    footnoteContainer.style.display = 'block';
                    footnoteContainer.setAttribute('note', footnoteId);
                } else if (footnoteId != footnoteContainer.getAttribute('note')) {
                    footnoteContainer.innerHTML = `<b>Footnote #${this.textContent}</b><br>${footnoteJson[footnoteId]}`;
                    footnoteContainer.setAttribute('note', footnoteId);
                } else {
                    footnoteContainer.style.display = 'none';
                }
            })
        });

        // Define page elements
        let verses = document.getElementsByClassName("verse_container");
        let arabicVerses = document.getElementsByClassName("arabic_verse_by_words");
        let words = document.getElementsByClassName("word");

        // Audio Player/Controls
        const icon_mp3 = document.getElementById('icon_mp3')
        const audio = document.getElementById('audio_mp3')
        const audioPlayer = document.getElementById('audioPlayer')
        const playBtn = document.getElementById('playBtn');
        const rewindBtn = document.getElementById('rewindBtn');
        const closeBtn = document.getElementById('closeBtn');
        const progressBar = document.getElementById('progressBar');
        const openPlayer = document.getElementById('openPlayer');
        const surahContent = document.getElementById('Surah_Content');
        const wordStartTimesArray = searchValues(verseSegments, ['segments'])
        const verseStartTimes = searchValues(verseSegments, ['segments', 0, 1])
        const showTooltipsButton = document.getElementById('show_tooltips');
        const gridButton = document.getElementById('back_to_list');
        const hideButton = document.getElementById(`hide_button`);
        audio.src = settings.onlineQuran ? audioJson.audio_url :
            path.join(App_Path, `./audio/quran/${id}.mp3`);
        if (!dark_mode) icon_mp3.src = '../public/icon/dark/play.png';
        if (!dark_mode) hideButton.src = '../public/icon/dark/hide.png';
        if (!dark_mode) gridButton.firstElementChild.src = '../public/icon/dark/grid.png';
        if (!dark_mode) showTooltipsButton.classList.add('light-icon');

        let wordStartTimes = []
        wordStartTimesArray.forEach((a) => {
            wordStartTimes.push(searchValues(a, [1]))
        });

        let playing = false

        const pause = async function () {
            icon_mp3.src = dark_mode ? '../public/icon/play.png' : '../public/icon/dark/play.png';
            icon_mp3.classList.remove('selected')
            playBtn.innerHTML = '<span class="tooltiptext">Play</span>' + svgMap.play
            audio.pause()
            playing = false
            Array.from(words).forEach((word) => { word.classList.remove('playing') })
        }

        const play = async function () {
            icon_mp3.classList.add('selected')
            icon_mp3.src = dark_mode ? '../public/icon/pause.png' : '../public/icon/dark/pause.png';
            playBtn.innerHTML = '<span class="tooltiptext">Pause</span>' + svgMap.pause
            audio.play()
            playing = true
        }

        const pausePlay = async function () {
            playing ? pause() : play()
        }

        icon_mp3.addEventListener('click', pausePlay);
        playBtn.addEventListener('click', pausePlay);
        document.addEventListener('keydown', function (event) {
            if (event.code === 'Space' && event.target === document.body) {
                event.preventDefault(); // Prevents scrolling down the page
                pausePlay()
            }
        });

        rewindBtn.addEventListener('click', function () {
            pause()
            audio.currentTime = 0;
            play()
        })

        closeBtn.addEventListener('click', function () {
            pause()
            audioPlayer.classList.add('hidden')
            openPlayer.classList.remove('hidden')
            audio.currentTime = 0;
        })

        let isDragging = false;

        // Event listener for mouse down on the progress bar
        progressBar.addEventListener('mousedown', function (event) {
            isDragging = true;
            pause();
            updateProgress(event);
        });

        // Event listener for mouse move on the document
        progressBar.addEventListener('mousemove', function (event) {
            if (isDragging) {
                updateProgress(event);
            }
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
            const currentTime = progress * audio.duration;
            audio.currentTime = currentTime;
            progressBar.value = progress * 100;
        }

        audio.addEventListener('timeupdate', function () {
            if (!isDragging) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressBar.value = progress;
            }
        });

        openPlayer.addEventListener('click', function () {
            openPlayer.classList.add('hidden')
            audioPlayer.classList.remove('hidden')
        })

        // document.addEventListener('click', function () {
        //     console.log(verseIndex, wordIndex, trueWordIndex)
        // })

        let prevVerseIndex, prevWordIndex, trueWordIndex

        function highlightWord(verseInd, wordInd) {
            arabicVerses[verseInd].children[wordInd].classList.add("playing");
            try {
                if (wordInd != prevWordIndex || verseInd != prevVerseIndex) arabicVerses[prevVerseIndex].children[prevWordIndex].classList.remove("playing");
                if (verseInd != prevVerseIndex && enableAutoScroll.checked) scrollToVerse(verseInd);
            } catch { }
            [prevVerseIndex, prevWordIndex] = [verseInd, wordInd]
        }

        audio.addEventListener("timeupdate", function () {
            if (playing) {
                let currentTime = audio.currentTime * 1000;
                verseIndex = searchIndex(verseStartTimes, currentTime)
                wordIndex = searchIndex(wordStartTimes[verseIndex], currentTime)
                trueWordIndex = wordStartTimesArray[verseIndex][wordIndex][0] - 1
                highlightWord(verseIndex, trueWordIndex);
            }
        });

        // Repeat Range 
        const startTimeInput = document.getElementById('startTime');
        const endTimeInput = document.getElementById('endTime');
        const playInRangeBtn = document.getElementById('playInRangeBtn');
        let rangeStage = 0
        let timeUpdateListener = null
        startTimeInput.setAttribute('max', surahJson.versesCount);
        endTimeInput.setAttribute('max', surahJson.versesCount);

        startTimeInput.addEventListener('blur', function () {
            let startTime = parseInt(startTimeInput.value);
            let endTime = parseInt(endTimeInput.value);
            if (startTime > surahJson.versesCount) {
                startTimeInput.value = surahJson.versesCount;
                startTime = surahJson.versesCount;
            }
            if (startTime > endTime) {
                endTimeInput.value = startTime;
            }
        });

        endTimeInput.addEventListener('blur', function (event) {
            let startTime = parseInt(startTimeInput.value);
            let endTime = parseInt(endTimeInput.value);
            if (endTime > surahJson.versesCount) {
                endTimeInput.value = surahJson.versesCount;
            }
            if (endTime < startTime) {
                startTimeInput.value = endTime;
            }
            if (event.code === 'Click' && event.target === document.body) {
                event.preventDefault(); // Prevents scrolling down the page
                pausePlay()
            }
        });

        playInRangeBtn.addEventListener('click', function () {
            const startTime = verseSegments[parseInt(startTimeInput.value) - 1].timestamp_from / 1000;
            const endTime = verseSegments[parseInt(endTimeInput.value) - 1].timestamp_to / 1000;
            switch (rangeStage) {
                case 0:
                    audio.removeEventListener('timeupdate', timeUpdateListener);
                    startTimeInput.classList.remove('collapsed')
                    endTimeInput.classList.remove('collapsed')
                    playInRangeBtn.innerHTML = svgMap.check
                    rangeStage = 1
                    break;
                case 1:
                    timeUpdateListener = function () {
                        if (audio.currentTime >= (endTime - 0.25)) {
                            audio.currentTime = startTime;
                        }
                    }
                    audio.currentTime = startTime;
                    play()
                    audio.addEventListener('timeupdate', timeUpdateListener);
                    startTimeInput.classList.add('collapsed')
                    endTimeInput.classList.add('collapsed')
                    playInRangeBtn.innerHTML = '<span class="tooltiptext">Stop</span>' + svgMap.stop
                    rangeStage = 2
                    break;
                case 2:
                    pause()
                    audio.removeEventListener('timeupdate', timeUpdateListener);
                    playInRangeBtn.innerHTML = '<span class="tooltiptext">Repeat Range</span>' + svgMap.repeat
                    rangeStage = 0
                    break;
                default:
                    break;
            }
        })

        surahContent.addEventListener('click', () => {
            if (rangeStage == 1) {
                startTimeInput.classList.add('collapsed');
                endTimeInput.classList.add('collapsed');
                playInRangeBtn.innerHTML = '<span class="tooltiptext">Repeat Range</span>' + svgMap.repeat
                rangeStage = 0
            }
            settingsMenu.style.display = 'none';
        });

        startTimeInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') playInRangeBtn.click();
        });

        endTimeInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') playInRangeBtn.click();
        });

        // Return to surah page
        gridButton.addEventListener("click", e => {
            window.location.href = './surah.html'
        });

        document.addEventListener('keydown', (event) => {
            const key = event.key;
            if (document.activeElement.tagName !== 'INPUT') {
                if (key === 'ArrowUp' || key === 'ArrowDown') {
                    event.preventDefault();
                    if (key === 'ArrowUp') verseUserIndex = (verseUserIndex - 1 + verses.length) % verses.length;
                    else verseUserIndex = (verseUserIndex + 1) % verses.length;
                    scrollToVerse(verseUserIndex)
                }
            }
        });

        function scrollToVerse(verseInd) {
            if (verseInd < 1) verseInd = 1
            verses[verseInd - 1].scrollIntoView({ behavior: 'smooth' });
        }

        // Memorization Mode
        let memorization_mode = false
        hideButton.addEventListener("click", () => {
            memorization_mode = !memorization_mode
            hideButton.classList.toggle('selected')
            if (memorization_mode) {
                Array.from(arabicVerses).forEach((verse) => {
                    verse.classList.remove("clicked")
                    verse.classList.add("underline-words")
                });
                Array.from(words).forEach((word) => {
                    word.classList.add("hide")
                });
            } else {
                Array.from(arabicVerses).forEach((verse) => {
                    verse.classList.remove("underline-words")
                });
                Array.from(words).forEach((word) => {
                    word.classList.remove("hide")
                });
            }

        })

        Array.from(arabicVerses).forEach((verse) => {
            verse.addEventListener("mouseleave", () => {
                verse.classList.remove("clicked");
            });
            verse.addEventListener("click", () => {
                if (memorization_mode) {
                    verse.classList.add("clicked");
                    var words = verse.getElementsByTagName('p');
                    var hasHiddenWord = Array.from(words).slice(0, -1).some(function (word) {
                        return word.classList.contains('hide');
                    });
                    if (hasHiddenWord) showAll(verse);
                    else hideAll(verse)
                }
            });
        });

        function hideAll(verse) {
            if (memorization_mode) {
                var words = verse.getElementsByClassName('word');
                Array.from(words).forEach((word) => {
                    word.classList.add("hide");
                });
            }
        }

        function showAll(verse) {
            var words = verse.getElementsByClassName('word');
            Array.from(words).forEach((word) => {
                word.classList.remove("hide");
            });
        }

        Array.from(words).forEach((word, index) => {
            word.addEventListener("mouseover", () => {
                if (!word.parentElement.classList.contains('clicked')) {
                    word.classList.remove("hide");
                }
                if (showTooltips) {
                    word.classList.add("hovered-word");
                    let englishTooltip = document.createElement("div");
                    englishTooltip.className = 'tooltiptext'
                    englishTooltip.textContent = englishWords[index]
                    word.appendChild(englishTooltip)
                }
            });
            word.addEventListener("mouseout", () => {
                word.classList.remove("hovered-word");
                for (let node of word.childNodes) {
                    if (node.nodeType != 3)
                        word.removeChild(node);
                }
            })
        });

        showTooltipsButton.addEventListener("click", () => {
            showTooltips = !showTooltips
            showTooltipsButton.classList.toggle('selected')
        })

        window.addEventListener('beforeunload', function (event) {
            tempSettings.quranTranslation = toggleTranslation.checked;
            tempSettings.quranTransliteration = toggleTransliteration.checked;
            tempSettings.enableAutoScroll = enableAutoScroll.checked;
            fs.writeJsonSync(path.join(App_Path, './data/tempSettings.json'), tempSettings, { spaces: '\t' })
        });

    };
    if (surahJson.versesCount < 20) loadRemainder();
    else setTimeout(loadRemainder, 500); // 5000 milliseconds = 5 seconds
}