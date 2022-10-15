
function RandomNumberGenerator(max) {
    return Math.floor(Math.random() * max);
}

function GenerateLink()
{
    var currentLink = ""
    let characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

    for (let index = 0; index < 6; index++) {
        currentLink += characters[RandomNumberGenerator(characters.length - 2)]
    }
    completeLink = "https//www.prnt.sc/" + currentLink
    
    document.getElementById("currentLink").innerHTML = "Current Link: " + completeLink
    ActiveLink = completeLink
}

function OpenURL()
{
    window.open(completeLink, '_blank').focus()
}

async function fetchAsync (url) {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data)
    return data;
  }

function test()
{
    document.getElementById("test1").innerText = fetchAsync(completeLink)
}