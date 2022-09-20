
/*export function audioplayer() {
    let count = 0;
    let audio = document.getElementById('audio')
    const audioPlayPause = document.querySelector('#audioPlayPause')

    audioPlayPause.addEventListener('click', function() {
        if(count == 0) {
            count = 1;
            audio.play()
            audioPlayPause.innerHTML = '<i class="fa fa-pause"></i>';

        } else {
            count = 0;
            audio.pause()
            audioPlayPause.innerHTML = '<i class="fa fa-play"></i>';
        }
    })


    let audioList = document.querySelectorAll('.aTrigger')
    audioList.forEach(function(audioSingle, index) {
        let dataAudioName = audioSingle.getAttribute("data-audio");
        let audioName = dataAudioName.substring(dataAudioName.lastIndexOf('/') + 1, dataAudioName.length)
        audioList[index].nextElementSibling.innerHTML = audioName;
        audioSingle.addEventListener('click', function(index) {
            audioPlayPause.className = 'active'
            let dataAudio = this.getAttribute('data-audio')
            let dataActive = this.getAttribute('data-active')
            let audioSource = document.getElementById("audioSource")
            audioSource.src = dataAudio
            document.getElementById('AudioTitle').innerHTML = audioName
            for(let i = 0; i < audioList.length; i++) {
                audioList[i].innerHTML = '<i class="fa fa-play"></i>'
                audioList[i].setAttribute('data-active', "")
            }
            if (dataActive == "") {
                count = 1
                audio.load()
                audio.play()
                this.setAttribute("data-active", "active")
                audioPlayPause.innerHTML = '<i class="fa fa-pause"></i>'
            } else if(dataActive == "pause") {
                count = 1
                audio.play()
                this.setAttribute("data-active", "active")
                audioPlayPause.innerHTML = '<i class="fa fa-pause"></i>'

            } else {
                count = 0     
                audio.pause()
                this.setAttribute("data-active", "pause")
                audioPlayPause.innerHTML = '<i class="fa fa-play"></i>'
            }
        })

    })
} */




let audioList = document.querySelectorAll('.aTrigger')
    audioList.forEach(function(audioSingle, index) {
        let dataAudioName = audioSingle.getAttribute("data-audio");
        audioSingle.addEventListener('click', function() {
            for(let i = 0; i < audioList.length; i++) {
                if(audioList[i].getAttribute('data-active') == 'active') {
                    audioList[i].setAttribute('data-active', '')
                }
            }
            this.setAttribute("data-active", "active")
            let widgetIframe = document.getElementById('sc-widget'),
            widget = SC.Widget(widgetIframe),
            newSoundUrl = 'https://api.soundcloud.com/tracks/',
            color = "&color=%23100595";
            let track = `${newSoundUrl}`+`${dataAudioName}`+`${color}`
            widget.load(track, {
                auto_play: false,
                hide_related: false,
                show_comments: false,
                show_user: false,
                show_reposts: false,
                show_teaser: true,
                show_artwork: false,
                visual: false,
                sharing: false,
                download: false,
                buying: false,
            })
            widget.bind(SC.Widget.Events.READY, function(){
                widget.play()
            })
            widget.getCurrentSound(function(sound) {
                console.log(sound)
            })
        })
    })
function setVolume(){
            let volume_slider = document.querySelector('.volume_slider');
            let widgetIframe = document.getElementById('sc-widget');
            let widget = SC.Widget(widgetIframe);
            console.log(volume_slider.value)
            widget.setVolume(volume_slider.value)

        }


