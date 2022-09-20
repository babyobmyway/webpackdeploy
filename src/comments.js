import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'


// Класс для отправки и получения комментариев с помощью REST
export class Comments{
    static sendComment(comment) {
        firebase.auth().currentUser.getIdToken(false).then(function(token) {
            return fetch(`https://vb-database-default-rtdb.firebaseio.com/comments.json?auth=${token}`, {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
        })   
    }
    static getComments() {
        return fetch("https://vb-database-default-rtdb.firebaseio.com/comments.json")
        .then(response => response.json())
        .then(response => {
            return response ? Object.keys(response).map(key => ({
                ...response[key],
                id: key
            })): []
        }).then((response) => {
            return response
        })
    }

}



// Функция скрытия комментариев 
export function showReplaies(){
    if(document.querySelector('.show__replies') != null) {
        document.querySelector('.show__replies').addEventListener('click', function() {
            document.querySelector('#comment__replay-1').classList.toggle('comments__show')
        })
    }
}

