import { createModal, createModalAuth, getHistoryBid } from "./auth.js";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { getDatabase, ref, push, set, get, child, onValue } from "firebase/database";
import { Comments } from "./comments.js";

// Функция увеличительного стекла
export function magnify(imgID, zoom) {
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);
  
    /* Создать увеличительное стекло: */
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");
    glass.setAttribute("id","img-glass")
    let blockWidth = document.querySelector('#s-content__media').offsetWidth
    /* Вставить увеличительное стекло: */
    img.parentElement.insertBefore(glass, img);
  
    /* Установите свойства фона для стекла лупы: */
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = (0.355 * blockWidth) * zoom + "px " + (0.355 * blockWidth) * zoom + "px";
    bw = 3;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;
  
    /* Выполните функцию, когда кто-то перемещает лупу по изображению: */
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
  

    function moveMagnifier(e) {
      var pos, x, y;
      /* Предотвратите любые другие действия, которые могут возникнуть при перемещении по изображению */
      e.preventDefault();
      /* Получить позиции курсора x и y: */
      pos = getCursorPos(e);
      x = pos.x;
      y = pos.y;
      /* Не допускайте, чтобы лупа находилась вне изображения: */
      if (x > img.width - (w / zoom)) {x = img.width - (w / zoom)}
      if (x < w / zoom) {x = w / zoom}
      if (y > img.height - (h / zoom)) {y = img.height - (h / zoom)}
      if (y < h / zoom) {y = h / zoom}
      /* Установите положение стекла лупы: */
      glass.style.left = (x - w) + "px";
      glass.style.top = (y - h) + "px";
      /* Покажите, что такое увеличительное стекло "смотреть": */
      glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }
    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /* Получить x и y позиции изображения: */
      a = img.getBoundingClientRect();
      /* Вычислите координаты курсора x и y относительно изображения: */
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /* Consider any page scrolling: */
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return {x : x, y : y};
    }
}
// Функция проверки авторизации и дальнейших действий в различных случаях
export function modalTable() {
    const modalBtn = document.querySelectorAll('.forlogout')
    const submitBtn = document.querySelector('#modalAuth-btn')
    function forLog(){
        if(firebase.auth().currentUser !== null) {
            return createModal(), getHistoryBid()
        } else {
            return createModalAuth() 
        }
    }
    modalBtn[0].addEventListener('click', forLog)
    if(submitBtn) {
        submitBtn.addEventListener('click', forLog)
    }
    modalBtn[1].addEventListener('click', function() {
        firebase.auth().signOut()
        location.reload()
    })
}   

// Функция отправки данных в БД
export async function submitFormHandler(event) {
    event.preventDefault()
    let bid = event.target.querySelector('#bid').value
    function getUid() {
        const user = firebase.auth().currentUser
        return user ? user.uid : null
    }
    let uidUser = getUid()
    const db = getDatabase();
    const postListRef = ref(db, `users/${uidUser}/bids`);
    const newPostRef = push(postListRef);
    set(newPostRef, {
        bid: bid,
        date: Date.now(),
    });
    await firebase.database().ref(`/maxBid`).set({
        bid,
        date: Date.now()
    })

    confirmModal()
}

// Функция открытия окна подтверждения установки новой ставки
function confirmModal() {
    document.querySelector('#submit-form').remove()
    document.querySelector('#header-of-form').innerHTML = '<h1>BID succesfuly sended</h1>'
}


// Функция, показывающая максимальную ставку на данный момент
export function maxBid() {
    const maxBid = document.querySelector('.s-content__maxbid')
    const db = getDatabase();
    const dbRef = ref(db, '/maxBid/bid')
    onValue(dbRef, (snapshot) => {
        const val = snapshot.val()
        function numberWithSpaces(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
        let valueWithSpaces = numberWithSpaces(val)
        maxBid.insertAdjacentHTML('afterbegin', `<p class="maxBid">Current BID:<br><span class="valuebid">${valueWithSpaces} ₽</span></p>`)
        let preloader = document.getElementById('preloader')
        if ( !preloader.classList.contains('done')) {
            preloader.classList.add('done')
        }
        })
}


//Функция отправки комментария в БД
export function createComment() {
    let commentBtn = document.querySelector('#send_comment')
    commentBtn.addEventListener('click', function(){
        try {
                let text = document.querySelector('#cMessage').value
                let form = document.querySelector('#commentForm')
                firebase.auth().onAuthStateChanged((user) => {
                const db = ref(getDatabase());
                if(!user) {
                    return createModalAuth()
                }
                let uidUser = user.uid
                let userName
                get(child(db, `users/${uidUser}/info/login`)).then((snapshot) => {
                    userName = snapshot.val()
                    const comment = {
                        userName: userName,
                        text: text,
                        date: Math.floor(Date.now()/1000)
                    }
                    commentBtn.disabled = true
                    document.querySelector('.commentlist').insertAdjacentHTML('beforeend', ` 
                    <li class="depth-1 comment">
                        <div class="comment__content">
                            <div class="comment__info">
                                <cite>${comment.userName}</cite>
                                <div class="comment__meta">
                                    <time class="comment__time">${timeConverterMain(comment.date, 2)}</time>
                                    <a class="reply" href="#0">Reply</a>
                                </div>
                            </div>
                            <div class="comment__text">
                                <p>${comment.text}</p>
                            </div>
                        </div>
                    </li>`
                    )
                    Comments.sendComment(comment)
                }).then(() => {
                    form.reset()
                    commentBtn.disabled = false
                    let countCom = document.querySelector('.countCom')
                    let count = document.querySelectorAll('.depth-1')
                    countCom.textContent = `${count.length} `
                })
            })
        } catch {
            return createModalAuth()
        }
    })
}


// Функция отображения комментария на страничке (Нужно усовершенствовать функцию с помощью AJAX)
export function comments() {
    Comments.getComments().then((response) => {
        response.forEach((element) => {
            let date = element.date
            let dateConverted = timeConverterMain(date, 2)
            document.querySelector('.commentlist').insertAdjacentHTML('beforeend', ` 
            <li class="depth-1 comment">
                <div class="comment__content">
                    <div class="comment__info">
                        <cite>${element.userName}</cite>
                        <div class="comment__meta">
                            <time class="comment__time">${dateConverted}</time>
                            <a class="reply" href="#0">Reply</a>
                        </div>
                    </div>
                    <div class="comment__text">
                        <p>${element.text}</p>
                    </div>
                </div>
            </li>`
            )
        })
    }).then(() => {
        let countCom = document.querySelector('.countCom')
        let count = document.querySelectorAll('.depth-1')
        countCom.textContent = `${count.length} Comments`
    })
}




// Подсчет количества комментариев
export function countComment() {
    let arrayComments = document.querySelectorAll('.depth-1')
    document.querySelector('.countCom').textContent = `${arrayComments.length} Comments`
}


export function timeConverterMain(UNIX_timestamp, variant) {
    let a
    if (variant == 2) {
        a = new Date(UNIX_timestamp * 1000);
    } else {
        a = new Date(UNIX_timestamp);
    }
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min
    if(a.getMinutes() < 10) {
        min = '0' + a.getMinutes()
    } else {
        min = a.getMinutes()
    }
    let timeForVariant1 = date + ' ' + month
    let timeForVariant2 = date + ' ' + month + ' ' + year + ' @ ' + hour + ':' + min;
    switch (variant) {
        case 1:
            return timeForVariant1;
            break;
        case 2:
            return timeForVariant2;
            break;
        default:
            console.log('error')
    }
}


function timeConverter2(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + ' ' + month
    return time;
}