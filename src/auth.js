import { submitFormHandler } from "./aucapp"
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import { getDatabase, ref, onValue} from "firebase/database";
 

// Функция открытия модального окна для установки ставки и истории ставок
export function createModal() {
    if(document.querySelector('#headersubmit')) {
        document.querySelector('#headersubmit').remove()
    }
    const modal = document.querySelector('#top')
    const db = ref(getDatabase(), `/maxBid`);
        modal.insertAdjacentHTML('afterbegin', `
        <div class="header__submit" id="headersubmit">
            <h1 id="header-of-form">Form for submit BID</h1>
            <form role="submit" method="get" class="header__submit-form" action="#" id="submit-form">
                <label>
                    <input type="number" class="submit-field" placeholder="BID" value="" name="s" autocomplete="off" id="bid">
                </label>
                <div id="description-of-bid">
                </div>
                <button
                    type="submit"
                    id="submit-btn"
                    class="mui-btn mui-btn--flat"
                    >SuBMIT</button>
            </form>
            <a href="#0" title="Close Search" class="header__overlay-close" id="closesubmit">Close</a>
        </div>
        `)
    onValue(db, (snapshot) => {
            let value = snapshot.val()
            let valueBid = value.bid
            const inputBid = document.querySelector('#bid')
            inputBid.setAttribute('min', `${value.bid}`)
            inputBid.setAttribute('max', `${Number(valueBid) + 1000}`)
    })
    closeSubmit()
    document
    .getElementById('submit-form')
    .addEventListener('submit', submitFormHandler, {once: true})
    
}

// Функция для закрытия окна
function closeSubmit() {
    const close = document.getElementById('closesubmit')
    close.addEventListener('click', function() {
        location.reload()

    })
}

// Функция открытия окна Авторизации
export function createModalAuth() {
    const modal = document.querySelector('#top')
    modal.insertAdjacentHTML('afterbegin', `
    <div class="header__submit" id="headersubmit">
        <h1 id="header-of-form">Authorization</h1>
        <form role="submit" method="get" class="header__submit-form" action="#" id="submit-form">
            <label>
                <input type="email" class="submit-field" placeholder="E-mail" value="" autocomplete="off" id="email">
            </label>
            <label>
                <input type="password" class="submit-field" placeholder="Password" value="" autocomplete="off" id="password">
            </label>
            <div id="wrongpass">
            <button
            type="submit"
            id="submit-btn"
            class="mui-btn mui-btn--flat"
            >SuBMIT</button></div>
            <p>Dont have acc? <a id="registr">Registration</a></p>
        </form>
        <a href="#0" title="Close Search" class="header__overlay-close" id="closesubmit">Close</a>
    </div>
    `)
    closeSubmit()
    document
    .getElementById('submit-form')
    .addEventListener('submit', submitAuthForm)
    document.querySelector('#registr').addEventListener('click', createFormReg)
}


// Функция получения уникального кода пользователя, для получения его индивидуальных данных
async function getUid() {
    const user = firebase.auth().currentUser
    return user ? user.uid : null
}

//Функция получения истории ставок пользователя
export async function getHistoryBid() {
    const uidUser = await getUid()
    const db = ref(getDatabase(), `users/${uidUser}/bids`);
    let historyBid = document.querySelector('#description-of-bid')
    historyBid.insertAdjacentHTML('afterbegin', `<div id="list-of-bid">List last 5 your bids:<br></div>`)
    await onValue(db, (snapshot) => {
            let value = snapshot.val()
            let list = document.querySelector("#list-of-bid")
            if (!value) {
                return list.insertAdjacentHTML('beforeend', `<p class="listofbid">List of bets is empty</p>`)
            }
            let array = Object.values(value)
            if (array.length - 5 >= 0) {
                for(let i = array.length - 1; i >= array.length - 5; i--) {
                    list.insertAdjacentHTML('beforeend', `<p class="listofbid">${i + 1}. ${array[i].bid} ₽</p>`)
                }
                return
            } else {
                for(let i = array.length - 1; i >= 0; i--) {
                    list.insertAdjacentHTML('beforeend', `<p class="listofbid">${i + 1}. ${array[i].bid} ₽</p>`)
                }
            }
             
            
        })
} 


//Отправка формы авторизации
async function submitAuthForm(event) {
    event.preventDefault()
    try {
        let email = event.target.querySelector('#email').value
        let password = event.target.querySelector('#password').value
        if (email == "") {
            return
        }
        await firebase.auth().signInWithEmailAndPassword(email, password)
        createModal()
        getHistoryBid()
        
     } catch (e) {
        let button = document.querySelector('#submit-btn').disabled
        if (String(e).indexOf('user-not-found')) {
            document.querySelector('#wrongpass').insertAdjacentHTML('afterbegin', '<p class="wrongpass">User not found(incorrect login)</p>')
            button = true;
            setTimeout(() => {
                document.querySelector('.wrongpass').remove()
                button = false;
            },5000)
        } else if (String(e).indexOf('wrong-password')) {
            document.querySelector('#wrongpass').insertAdjacentHTML('afterbegin', '<p class="wrongpass">Wrong password</p>')
            button = true;
            setTimeout(() => {
                document.querySelector('.wrongpass').remove()
                button = false;
            },5000)
        } else if(String(e) == "") {
            document.querySelector('#wrongpass').insertAdjacentHTML('afterbegin', '<p class="wrongpass">Empty</p>')
            button = true;
            setTimeout(() => {
                document.querySelector('.wrongpass').remove()
                button = false;
            },5000)
        } else {
            document.querySelector('#wrongpass').insertAdjacentHTML('afterbegin', '<p class="wrongpass">Unknown error</p>')
            button = true;
            setTimeout(() => {
                document.querySelector('.wrongpass').remove()
                button = false;
            },5000)
        }
    } 
}

//Функция отправки формы регистрации
async function submitRegForm(event) {
    event.preventDefault()
    try {
        let email = event.target.querySelector('#email').value
        let password = event.target.querySelector('#password').value
        let login = event.target.querySelector('#login').value
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        const uidUser = await getUid()
        await firebase.database().ref(`/users/${uidUser}/info`).set({
            login: login,
        })
        createModal()
        getHistoryBid()

    } catch {
        let form = document.getElementById('headersubmit')
        form.remove()
    }
}


//Создание формы регистрации
function createFormReg() {
    document.querySelector('#headersubmit').remove()
    const modal = document.querySelector('#top')
    modal.insertAdjacentHTML('afterbegin', `
    <div class="header__submit" id="headersubmit">
        <h1 id="header-of-form">Registration</h1>
        <form role="submit" method="get" class="header__submit-form" action="#" id="submit-form">
            <label>
                <input type="login" class="submit-field" placeholder="Login" value="" name="s" autocomplete="off" id="login">
            </label>
            <label>
                <input type="email" class="submit-field" placeholder="E-mail" value="" name="s" autocomplete="off" id="email">
            </label>
            <label>
                <input type="password" class="submit-field" placeholder="Password" value="" name="s" autocomplete="off" id="password">
            </label>
            <label>
                <input type="password" class="submit-field" placeholder="Password" value="" name="s" autocomplete="off" id="password">
            </label>
            <div>
            <button
            type="submit"
            id="submit-btn"
            class="mui-btn mui-btn--flat"
            >SuBMIT</button></div>
        </form>
        <a href="#0" title="Close Search" class="header__overlay-close" id="closesubmit">Close</a>
    </div>
    `)
    closeSubmit()
    document
    .getElementById('submit-form')
    .addEventListener('submit', submitRegForm)
}


// Функция проверки состояния авторизации
export function authState() {
    try {
        firebase.auth().onAuthStateChanged((user) => {
            if(user != null) {
                let icon = document.querySelector('.login-icon')
                icon.classList.remove('fa-sign-in')
                icon.classList.add('fa-sign-out')
                const db = getDatabase() 
                const uidUser = user.uid
                const dbRef = ref(db, `users/${uidUser}/info/login`);
                onValue(dbRef, (snapshot) => {
                    let value = snapshot.val() 
                    waiting(value)                
                })
                               
            } else {
                return
            }
            
        })
    } catch {
        return
    }

}

//Вспомогательная функция для выведения имени пользователя
function waiting(value) {
    let profile = document.querySelector('.header__search-trigger')
    profile.innerHTML = `${value}<i class="fa fa-caret-down"></i>`

    
}