const { router, text } = require('bottender/router');
const getWord = require('../lib/search');

async function App(context) {
    //console.log(context.event.rawEvent.message.text)
    return router([
        // return the `SayHi` action when receiving "hi" text messages
        //text(/^h(ello)|(i)|^\/start/, SayHi),
        text(/\d+/, handleNumber),
        text(/([A-Za-z])+/, searchWord),
        text('*', wrongInput)
    ]);
};

async function searchWord(context) {
    //console.log('search');
    const { text } = context.event
    console.log(text)
    const { meaning, mp3File }  = await getWord(text);

    // send meaning 
    await context.sendMessage(meaning, {parseMode : 'markdown'})
    // send pronunciation
    if (mp3File != "-1")
        await context.sendVoice(mp3File)
}

async function handleNumber (context) {
    await context.sendText('Not digit ok ?');
}

async function SayHi(context) {
    await context.sendText(`Hi.`);
}

async function wrongInput(context) {
    await context.sendText('wrong input')
}

module.exports = App
