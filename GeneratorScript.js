
function RandomNumberGenerator(max) {
    return Math.floor(Math.random() * max);
}

function GenerateLink()
{
    var currentLink = ""
    let characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    for (let index = 0; index < 6; index++) {
        currentLink += characters[RandomNumberGenerator(characters.length)]
    }
    completeLink = "https://prnt.sc/" + currentLink
    
    document.getElementById("currentLink").innerHTML = "Current Link: " + completeLink
    ActiveLink = completeLink
}

function OpenURL()
{
    window.open(completeLink, '_blank').focus()
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, true);
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function test()
{
    document.getElementById("test1").innerText = httpGet(completeLink)
}