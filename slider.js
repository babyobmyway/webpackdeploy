let offset = 0
const sliderLine = document.querySelector('.masonry')
document.querySelector('.pgn__next').addEventListener('click', function() {
    offset += 360
    sliderLine.style.left = -offset + 'px'
})