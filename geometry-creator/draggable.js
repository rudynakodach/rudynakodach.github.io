let offsetX, offsetY;

document.body.addEventListener("dragstart", (e) => {
    // set the offset position relative to the mouse pointer
    offsetX = e.clientX - e.target.offsetLeft;
    offsetY = e.clientY - e.target.offsetTop;
})

document.body.addEventListener("drag", (e) => {
    if(e.target.getAttribute("draggable") == "false") {return;}
    console.log(e.target.nodeName)
    if(e.target.nodeName !== "INPUT") {
        // set the new position of the element based on the mouse position
        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;

        // check if the new position is within the viewport
        if (left > 0 && left < window.innerWidth - e.target.offsetWidth) {
            e.target.style.left = left + 'px';
        }
        if (top > 0 && top < window.innerHeight - e.target.offsetHeight) {
            e.target.style.top = top + 'px';
        }
    }
})

document.body.addEventListener("dragend", (e) => {
    // reset the offset positions
    offsetX = 0;
    offsetY = 0;
})