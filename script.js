ActiveLink = ""

function play() {
    var audio = new Audio('https://us-tuna-sounds-files.voicemod.net/90411f9f-09a3-488d-9a18-9e28eedbb859-1655891553739.mp3');
    audio.play();
}

function generate(max) {
    return Math.floor(Math.random() * max);
}

function Link()
{
    var currentLink = ""
    let characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    for (let index = 0; index < 6; index++) {
        currentLink += characters[generate(characters.length)]
    }
    completeLink = "https://prnt.sc/" + currentLink
    console.log(currentLink)
    
    document.getElementById("currentLink").innerHTML = completeLink
    ActiveLink = completeLink
}

function OpenNewTab() {
    if(ActiveLink == "")
    {
        return;
    }
    window.open(ActiveLink, "_black").focus();
}

function OpenProject1InBrowser() {
    window.open("https://github.com/rudynakodach/SteamCalc").focus()
}