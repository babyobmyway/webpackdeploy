import './css/base.css'
import './css/main.css'
import './css/vendor.css'
import './css/fonts.css'
import AOS from 'Aos'
import {addforfirsthtml, addForAuchtml, slideImgRed, carousel, sliderBlocksMainPage} from './images.js'
import {comments, createComment, magnify, maxBid, modalTable, removeText, myChart} from './aucapp.js'
import {initGraphics1} from './graphic'
import { audioplayer, scloud, setVolume } from './player'
import { authState, createModal, createModalAuth } from './auth'
import { Comments, showReplaies, sendTextComment, countCom } from './comments'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import { startAt } from 'firebase/database'
import { startBasicScene, startBasicScene1 } from './three'
// Main Config firebase, init Firebase
const firebaseConfig = {
    apiKey: "AIzaSyChw8y6ebjtDVMc4Bgv__0nAAW_h9b6G3c",
    authDomain: "vb-database.firebaseapp.com",
    projectId: "vb-database",
    storageBucket: "vb-database.appspot.com",
    messagingSenderId: "996485199307",
    appId: "1:996485199307:web:dcd76a05c38eeee862324e"
  };

firebase.initializeApp(firebaseConfig)


// Убирается голый html при открытии, атрибут 'style' делает html черным.
const htmlbody = document.querySelectorAll(".no-js")
htmlbody[0].removeAttribute('style')
htmlbody[1].removeAttribute('style')



// Анимация появления блоков

let clAOS = function() {
        
    AOS.init( {
        offset: -400,
        duration: 5000,
        easing: 'ease-in-sine',
        delay: 100,
        once: true,
        disable: 'mobile'
    });

};



// Функция прелоадера
export function onload(time) {
    setTimeout( function() {
        let preloader = document.getElementById('preloader')
        if ( !preloader.classList.contains('done')) {
            preloader.classList.add('done')
        }
    }, time)   
}


// Запуск всех функций для главной страницы
if (document.querySelector('#no-js')) {
    addforfirsthtml()
    clAOS()
    modalTable()
    setInterval(carousel, 5000)
    sliderBlocksMainPage()
    authState()
    const closeMobile = document.querySelector('.close-mobile-menu')
    closeMobile.addEventListener('click', function() {
        let body = document.body
        body.classList.remove('nav-wrap-is-visible')
    })
    document.querySelector('#modal-btn').addEventListener('click', function() {
        const logBtn = document.querySelector('#modal-btn').innerHTML
        if(logBtn == 'Login') {
            return createModalAuth()
        }
        document.querySelector('#myDropdown').classList.toggle('show')
        document.querySelectorAll('.forlogout').forEach((element) => {
            element.classList.toggle('show')
        })
    })
    document.querySelector('.login-icon').addEventListener('click', function() {
        let icon = document.querySelector('.login-icon').classList
        if(icon.contains('fa-sign-in')) {
            return createModalAuth()
        }
        firebase.auth().signOut()
        location.reload()

    })
    onload(2000)
}



// Запуск всех функций для страницы "Auction"
if(document.querySelector('#auction')) {
    addForAuchtml()
    magnify('imgID', 2)
    maxBid()
    showReplaies()
    createComment()
    comments()
    widthAndHeightForGraphic()
    initGraphics1()
    modalTable()
    authState()
    const closeMobile = document.querySelector('.close-mobile-menu')
    closeMobile.addEventListener('click', function() {
        let body = document.body
        body.classList.remove('nav-wrap-is-visible')
    })
    document.querySelector('#modal-btn').addEventListener('click', function() {
        const logBtn = document.querySelector('#modal-btn').innerHTML
        if(logBtn == 'Login') {
            return createModalAuth()
        }
        document.querySelector('#myDropdown').classList.toggle('show')
        document.querySelectorAll('.forlogout').forEach((element) => {
            element.classList.toggle('show')
        })
    })
    document.querySelector('.login-icon').addEventListener('click', function() {
        let icon = document.querySelector('.login-icon').classList
        if(icon.contains('fa-sign-in')) {
            return createModalAuth()
        }
        firebase.auth().signOut()
        location.reload()
    })
}


// Запуск функций для страницы Player
if(document.querySelector('#album')) {
    clAOS()
    onload(2000)
    document.querySelector('.fa-volume-up').addEventListener('click', function(){
        document.querySelector('.volume_slider').classList.toggle('show')
    })
}





// Листенер для открытия нав бара (только для мобильных устройств) при котором происходит проверка авторизации пользователя и в зависимости от этого появление блока с Моими ставками
document.querySelector('.header__toggle-menu').addEventListener('click', function() {
    let body = document.body
    body.classList.add('nav-wrap-is-visible')
    if(firebase.auth().currentUser !== null) {
        const myBids = document.querySelector('#header__nav-mybids')
        return myBids.removeAttribute('style')
    }
})



//Функция установки размеров графика для разных типов устройств
function widthAndHeightForGraphic() {
    document.querySelector('#myChart').setAttribute('height', '110')
    if(document.documentElement.clientWidth > 600){
        document.querySelector('#myChart').setAttribute('width', '300')
    } else {
        document.querySelector('#myChart').setAttribute('width', '320')
    }
    
}



// Прослушиватель событий для переключения ракурсов или видов продукта на страницы посвященной аукциону.
let sliderImg = document.querySelectorAll('.swiper-slide')
for (let i = 0; i < sliderImg.length; i++) {
    sliderImg[i].addEventListener('click', slideImgRed)
}

// Инициализация 3D модели логотипа для всех страниц
startBasicScene1()
