import logo from './assets/images/villageboyz.jpg'
import guitarman from './assets/images/featured-guitarman.jpg'
import user from './assets/images/user-03.jpg'
import tulips400 from './assets/images/tulips-400.jpg'
import tulips800 from './assets/images/tulips-800.jpg'
import beetle from './assets/images/featured-beetle.jpg'
import watch from './assets/images/featured-watch.jpg'
import lump400 from './assets/images/lamp-400.jpg'
import lump800 from './assets/images/lamp-800.jpg'
import ld1 from './assets/album1/love.jpg'
import cookie400 from './assets/images/cookies-400.jpg'
import cookie800 from './assets/images/cookies-800.jpg'
import sweatshirts1000 from './assets/images/sweatshirt-1000.jpg'
import sweatshirt_red from './assets/images/sweatshirt-red.jpg'
import sweatshirt_green from './assets/images/sweatshirt-green.jpg'
import sweatshirt_blue from './assets/images/sweatshirt-blue.jpg'
import { magnify } from './aucapp'


export function addforfirsthtml() {
    const img1 = document.querySelector('.logo')
    const img2 = document.querySelector('.entry')
    const img3 = document.querySelectorAll('.entry__profile-pic')
    const img5 = document.querySelectorAll('.entry')
    const img6 = document.querySelectorAll('.entry__thumb-link')
    const img7 = document.querySelector('.entry__thumb_1')
    const img8 = document.querySelectorAll('.slider__slides')
    for (let i = 0; i < img3.length - 1; i++) {
        img3[i].insertAdjacentHTML('beforeend', `<img class="avatar" src="${user}" alt="">`)
    
    }
    img6[1].insertAdjacentHTML('beforeend', `<img src="${tulips400}" 
                                    srcset="${tulips400} 1x, ${tulips800} 2x" alt=""></img>`)
    img6[0].insertAdjacentHTML('beforeend', `<img src="${ld1}" 
                                    srcset="${ld1} 1x, ${ld1} 2x" alt=""></img>`)
    img6[2].insertAdjacentHTML('beforeend', `<img src="${cookie400}" 
                                    srcset="${cookie400} 1x, ${cookie800} 2x" alt=""></img>`)        

}


export function addForAuchtml() {
    const sweatshirt = document.querySelector('.s-content__post-thumb')
    const sweatshirtMain = document.querySelector('.imgone')
    const sweatshirtred = document.querySelector('.imgtwo')
    const sweatshirtgreen = document.querySelector('.imgthree')
    const sweatshirtblue = document.querySelector('.imgfour')
    sweatshirt.insertAdjacentHTML('afterbegin', `
    <img src="${sweatshirts1000}" alt="" id="imgID">
    `)
    sweatshirtMain.insertAdjacentHTML('beforeend', `<img src="${sweatshirts1000}" alt="" id="slideOne">`)
    sweatshirtred.insertAdjacentHTML('beforeend', `<img src="${sweatshirt_red}" alt="" id="slideTwo">`)
    sweatshirtgreen.insertAdjacentHTML('beforeend', `<img src="${sweatshirt_green}" alt="" id="slideThree">`)
    sweatshirtblue.insertAdjacentHTML('beforeend', `<img src="${sweatshirt_blue}" alt="" id="slideFour">`)
}


export function slideImgRed(event) {
    let imgMain = document.querySelector('.s-content__post-thumb')
    const imgNew = this.innerHTML
    imgMain.innerHTML = imgNew
    imgMain.querySelector(`#${event.target.id}`).id = 'imgID'
    let sliderImg = document.querySelectorAll('.swiper-slide')
    for (let i = 0; i < sliderImg.length; i++) {
        if (sliderImg[i] != event.target) {
            sliderImg[i].classList.remove('active')
        }
    }
    event.target.parentElement.classList.add('active')
    magnify('imgID', 2)
    
}


export function carousel() {
    const sll = document.querySelector('#sliderss')
    let sliders = sll.querySelectorAll('.entry')
    let a
    for(let i = 0; i < sliders.length; i++) {  
        if(sliders[i].matches('.activeAlbumSlide')) {
            a = i
            sliders[i].classList.remove('activeAlbumSlide')
            sliders[i].style.display = 'none'
        }
    }
    if(a == sliders.length - 1) {
        a = -1
    }
    sliders[a + 1].style.display = 'block'
    sliders[a + 1].classList.add('activeAlbumSlide')
}


export function sliderBlocksMainPage() {
    let offset = 0
    const sliderLine = document.querySelector('.masonry')
    const sliderMain = document.querySelectorAll('.masonry__brick')
    document.querySelector('.pgn__next').addEventListener('click', function() {
        offset += 360
        if (offset > 1080) {
            offset = 0
        }
        sliderLine.style.left = -offset + 'px'

    })
    
    document.querySelector('.pgn__prev').addEventListener('click', function() {
        offset -= 360
        if (offset < 0) {
            offset = 1080
        }
        sliderLine.style.left = -offset + 'px'
    })
}

