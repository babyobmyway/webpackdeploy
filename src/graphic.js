import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import { getDatabase, ref, push, set, get, child, onValue } from "firebase/database";
import { timeConverterMain } from "./aucapp.js"

let array = []
let labels = []
let bids = []


// Функция ковертера времени
function timeConverter2(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + ' ' + month
    return time;
}


export async function initGraphics1() {
    const db = firebase.database().ref('/users')
    db.on('value', (snapshot) => {
        let value = snapshot.val()
        let arrayObjs = Object.values(value)
        arrayObjs.forEach((element) => {
            //ошибка для новых пользователей без ставок
            if(element.bids) {
                let a = Object.values(element.bids)
                let b = Object.values(a)
                b.forEach((i) => {
                    array.push(i)
                })
                
                array.sort((a, b) => {
                    if(Number(a.bid) > Number(b.bid)) {
                        return 1
                    }
                    if(Number(a.bid) < Number(b.bid)) {
                        return -1
                    }
                })
            }
        })
        array.splice(0, array.length - 8)
        array.forEach((element) => {
            let time = timeConverterMain(element.date, 1)
            labels.push(time)
            bids.push(element.bid)
        })
        var ctx = document.getElementById('myChart').getContext("2d")
        var gradient = ctx.createLinearGradient(0, 0, 0, 110)
        gradient.addColorStop(0, 'rgba(31, 20, 134, 1)')
        gradient.addColorStop(1, '#FFFFFF')
      const data = {
          labels: labels,
          datasets: [{
            backgroundColor: gradient,
            borderColor: '#2436AC',
            pointRadius: 4,
            data: bids,
            fill: 'start',
          }]
      };
      
      const config = {
          type: 'line',
          data: data,
          options: {
              plugins: {
                  legend: {
                    display: false
                  },
              },
              ticks: {
                  stepSize: 12,
              },
              scales: {
                  y: {
                      grid: {
                          display: false,
                      },
                      ticks: {
                          display: false,
                      }
                  },
                  x: {
                      grid: {
                          display: false,
                      },
                      ticks: {
                          callback: function (value) {
                              return value == 7 || value == 0 ? this.getLabelForValue(value) : '';
                          },
                          crossAlign: 'near',
                          maxRotation: 0,
                          autoSkip: false,
                      }
  
                  }
              },
              tooltips: {
                  mode: false,
                  callbacks: {
                    title: function() {},
                    label: function() {}
                  }
              },
              responsive: false,
              maintainAspectRatio: false,
          },
      };
      const myChart = document.getElementById('myChart') 
      new Chart(
          myChart,
          config
      );
    })
}