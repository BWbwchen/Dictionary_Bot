const axios = require('axios');
const cheerio = require('cheerio');


const LEN_LIMIT = 3

function filteInvalid(string_array) {
    if (string_array[0].length == 0) {
        return false;
    } else {
        return true;
    }
}


function format(string_array) {
    valid = filteInvalid(string_array)
    if (valid === false) 
        return "You type wrong word! or this word isn't in Cambridge dictionary"
    for (let id in string_array) {
        string_array[id] = id + ") " + string_array[id]
    }

    if (string_array.length >= LEN_LIMIT) {
        return string_array.slice(0, LEN_LIMIT).join('.\n\n');
    } else {
        return string_array.join('.\n\n');
    }
}

function usPronun (string_array) {
    let re = /us_pron/
    let mp3 = /mp3/
    let url = string_array
        .filter((s) => s.search(re) !== -1)
        .filter(s => s.search(mp3) != -1)
    if (url.length > 0) return url[0]
    else return "-1"
}


async function getWord(text) {
    let url = `https://dictionary.cambridge.org/dictionary/english/${text}`
    let voiceUrl = `https://dictionary.cambridge.org`
    // get word meaning 
    let response = await axios.get(url)

    const $ = cheerio.load(response.data);
    let res_string = $('.ddef_d').text().trim().split(/: | \\s+/)
    let message = format(res_string)
    let mp3FileUrl = usPronun($('source').map((i, x) => $(x).attr('src')).toArray())
    
    //console.log(mp3FileUrl)

    //console.log(message)
    //console.log('got answer')
    return {
        meaning : `\`${text}\`\n\n${message}` , 
        mp3File : mp3FileUrl != "-1" ? voiceUrl+mp3FileUrl : "-1"
    }

    /*
    .catch((error) => {
        console.log(error)
        return "Network error";
    })
    */
}

module.exports = getWord
