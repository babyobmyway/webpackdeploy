export class Sumsforauc {
    static create(sum) {
        let token = firebase.auth().currentUser.getIdToken(false)
        console.log(token)
        return fetch(`https://villageauc-test-default-rtdb.europe-west1.firebasedatabase.app/sum.json?auth=${token}`, {
            method: 'POST',
            body: JSON.stringify(sum),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
    }

    static fetch1() {
        return fetch('https://villageauc-test-default-rtdb.europe-west1.firebasedatabase.app/sum.json')
            .then(response => response.json())
            .then(response => {
                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })): []
            }).then(function parsingjson(response) {
                const maxArr = response[response.length - 1].bid
                const loginWithMaxBid = response[response.length - 1].login
                const p = document.getElementById('maxbid')
            })
            
    }
    static audio() {
        return fetch('')
    }

}