const div = document.getElementById('objectMenu');
let isDragging = false;
let offsetX, offsetY;

div.addEventListener('mousedown', startDrag);
div.addEventListener('touchstart', startDrag);

function startDrag(event) {
    isDragging = true;
    offsetX = event.clientX - parseInt(div.style.left);
    offsetY = event.clientY - parseInt(div.style.top);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
}

function drag(event) {
    if (isDragging) {
        event.preventDefault();
        div.style.left = `${event.clientX - offsetX}px`;
        div.style.top = `${event.clientY - offsetY}px`;
    }
}

document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

function stopDrag(event) {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
}