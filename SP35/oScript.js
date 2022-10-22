function OpenURL(url) {
    window.open("https://" + url)
}

window.onscroll = function() {scrollFunction()};

let TopButton = document.getElementById("TopButton");

function scrollFunction() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    TopButton.className = "displayed";
  } 
  else 
  {
    TopButton.className = "hidden";
  }
}

function topFunction() {
  document.body.scrollTop = 0; //safari
  document.documentElement.scrollTop = 0; //chrome / pc
}