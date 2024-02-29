module.exports = function adhkar(fs, path) {

    let click_copy = document.getElementById('copy');
    let text = document.getElementById('text');
    let description = document.getElementById('description');
    let reference = document.getElementById('reference');
    let adhker_id_1 = document.getElementById('adhker_id_1');
    let adhker_id_2 = document.getElementById('adhker_id_2');
    let adhker_id_3 = document.getElementById('adhker_id_3');
    let adhker_id_4 = document.getElementById('adhker_id_4');
    let adhker_id_5 = document.getElementById('adhker_id_5');
    let adhker_id_6 = document.getElementById('adhker_id_6');
    let adhkarJson = fs.readJsonSync(path.join(__dirname, '../../data/azkarEnglish.json'));
    let adhkarList = [];
    for (let topic in adhkarJson) {
        for (let subtopic of adhkarJson[topic].SUBTOPICS) {
            for (let item of subtopic.DATA) {
                item['TOPIC'] = subtopic.TITLE;
                adhkarList.push(item);
            }
        }
    }
    let azkar_random = adhkarList[Math.floor(Math.random() * adhkarList.length)]

    text.innerText = azkar_random?.ARABIC_TEXT;
    description.innerText = azkar_random?.TRANSLATED_TEXT;
    reference.innerText = azkar_random?.TOPIC;
    adhker_id_1.addEventListener('click', e => window.location.href = '../pages/adhkarTopic.html?topic=morning');
    adhker_id_2.addEventListener('click', e => window.location.href = '../pages/adhkarTopic.html?topic=evening');
    adhker_id_3.addEventListener('click', e => window.location.href = '../pages/adhkarTopic.html?topic=bedtime');
    adhker_id_4.addEventListener('click', e => window.location.href = '../pages/adhkarTopic.html?topic=daily');
    adhker_id_5.addEventListener('click', e => window.location.href = '../pages/adhkarTopic.html?topic=prayer');
    adhker_id_6.addEventListener('click', e => window.location.href = '../pages/adhkarTopic.html?topic=praises');

    click_copy.addEventListener('click', event => {
        let createRange = document.createRange();
        createRange.selectNode(document.getElementById('title'));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(createRange);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    });

    random.addEventListener('click', event => {
        let azkar_random = adhkarList[Math.floor(Math.random() * adhkarList.length)]
        text.innerText = azkar_random?.ARABIC_TEXT;
        description.innerText = azkar_random?.TRANSLATED_TEXT;
        reference.innerText = azkar_random?.TOPIC;
    });
}