//get all elements
const playButton = document.getElementById('play-button')
const pauseButton = document.getElementById('pause-button')
const stopButton = document.getElementById('stop-button')
// const textInput = document.getElementById('text')
const textInput = document.getElementById('formattedText')
const speedInput = document.getElementById('speed')
const formattedText = document.getElementById('formattedText')

let currentCharacter, unformattedText
const utterance = new SpeechSynthesisUtterance()

playButton.addEventListener('click', () => {
    playText(textInput.innerHTML)
})

pauseButton.addEventListener('click', pauseText)
stopButton.addEventListener('click', stopText)
speedInput.addEventListener('input', () => {
    stopText();
    playText(utterance.text.substring(currentCharacter))
})


utterance.addEventListener('end', () => {
    textInput.disabled = false
    textInput.innerHTML = unformattedText
    console.log("playSpeech end...")
})

utterance.addEventListener('boundary', e => {
    console.log(e.charIndex, e.charLength, e.substring)
    currentCharacter = e.charIndex

    //get word to highlight
    let temp

    if (e.charIndex === 0 && e.charLength === 0) {
        temp = unformattedText
    }
    else {
        if (e.charIndex === 0) {
            //start of string
            temp = "<span class='highlight'>" + unformattedText.substring(0, e.charLength) + '</span>'
            temp += unformattedText.substring(e.charLength)
        }
        else {
            //get first part unformatted
            temp = unformattedText.substring(0, e.charIndex)

            //highlight part
            temp += "<span class='highlight'>" + unformattedText.substring(e.charIndex, e.charIndex + e.charLength) + '</span>'
            temp += unformattedText.substring(e.charIndex + e.charLength)
        }
    }
    textInput.innerHTML = temp
})


function playText(text) {
    console.log("playText " + text)
    if (speechSynthesis.paused && speechSynthesis.speaking) {
        return speechSynthesis.resume()
    }

    if (speechSynthesis.speaking) return

    unformattedText = text
    textInput.disabled = true
    utterance.text = text
    utterance.rate = speedInput.value || 1
    speechSynthesis.speak(utterance)

    formattedText.innerHTML = unformattedText
}

function pauseText() {
    if (speechSynthesis.speaking) {
        speechSynthesis.pause()
    }
}

function stopText() {
    speechSynthesis.resume()
    speechSynthesis.cancel()
}