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

async function getWord(text) {
    let url = `https://dictionary.cambridge.org/dictionary/english/${text}`
    // get word meaning 
    let response = await axios.get(url)

    const $ = cheerio.load(response.data);
    let res_string = $('.ddef_d').text().trim().split(/: | \\s+/)
    let message = format(res_string)

    //console.log(message)
    //console.log('got answer')
    return text + "\n\n" + message;

    /*
    .catch((error) => {
        console.log(error)
        return "Network error";
    })
    */
}

module.exports = getWord
