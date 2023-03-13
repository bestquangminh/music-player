const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const header = $('.header');
const headerText = $('.header__title-text'); 
const headerTitle = $('.header h3');
const cdThumb = $('.cd__thumbnail');
const audio = $('#audio');
const playButton = $('.toggle');
const nextButton = $('.nextsong');
const prevButton = $('.prevsong');
const randomButton = $('.randomsong');
const progress = $('#progress');
const audio_duration = $('.audio-duration');
const audio_currentTime = $('.audio-currentTime');
const repeatButton = $('.repeatsong');
const musicList = $('.music-list');
const darkMode = $('.header__changeMode-spotify');
var songInfo;
const timeConvert = n => {
    const minutes = Math.floor(n / 60);
    const seconds = n % 60;
    return `${minutes}:${seconds < 10? '0' : ''}${seconds}`;
}
const app = {
    currentIndex:0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    song: [
        {
            name: 'Lose Yourself',
            singer: 'Eminem',
            path: './assets/music/Lose-Yourself-Eminem.mp3',
            image: 'https://static.stereogum.com/uploads/2022/10/Eminem-Lose-Yourself-1666109360-520x5201-1666540295.jpeg'
        },

        {
            name: 'Mockingbird',
            singer: 'Eminem',
            path: './assets/music/Mockingbird-Eminem.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Mockingbird_%28Eminem_song%29_cover.jpg'
        },

        {
            name: 'Gods Plan',
            singer: 'Drake',
            path: './assets/music/[DownloadLaguGratis.Net] God s Plan.mp3',
            image: 'https://i.ytimg.com/vi/FrsOnNxIrg8/maxresdefault.jpg'
        },
        
        {
            name: 'A lot',
            singer: '21 Savage ft J Cole',
            path: './assets/music/[DownloadLaguGratis.Net] 21 Savage a lot Official Video ft. J. Cole.mp3',
            image: 'https://i.ytimg.com/vi/VbrEsOLu75c/maxresdefault.jpg'
        }
    ],
    render: function(){
        const htmls = this.song.map((song, index) => {
                return `<div class="song ${index === this.currentIndex ? "active" : ""}" data-index=${index}>
                <img src="${song.image}" alt="" class="song__img">
                <div class="song__description">
                    <h3 class="song__description-title">${song.name}</h3>
                    <p class="song__description-artist">${song.singer}</p>
                </div>
                <div class="song__menu">
                    <i class="fa-solid fa-ellipsis option"></i>
                </div>
            </div>`
        }) 
        $('.music-list').innerHTML = htmls.join('');
        songInfo = $$('.song');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
            return this.song[this.currentIndex];
            }
        })
    },
    handleEvent: function() {
        // *Xử lý phóng to / thu nhỏ CD
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;
        // *xử lý CD quay và dừng
        const cdAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdAnimate.pause();
        document.onscroll = function() {
            const scrollTop = window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
            
        }

        // *Xử lý click play button
        playButton.onclick = function() {
            if(app.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }  
        };

        audio.onplay = function() {
            app.isPlaying = true;
            playButton.classList.add('playing');
            cdAnimate.play();
        }

        audio.onpause = function() {
            app.isPlaying = false;
            playButton.classList.remove('playing');
            cdAnimate.pause();
        }

        // *thanh progress chạy theo nhạc
        audio.ontimeupdate = function() {
            if(!isNaN(audio.duration)) {
             progress.value = audio.currentTime;
            }
            audio_currentTime.innerHTML = timeConvert(Math.floor(audio.currentTime));
        }

        // *tua nhạc
        progress.onchange = function() {
            audio.currentTime = progress.value;
            audio.play();
        }  
        // *xử lý next song
        nextButton.onclick = function() {
            if(app.isRandom) {
                app.randomSong();
            }
            else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToTop();
        }   
        // *xử lý prev song
        prevButton.onclick = function() {
            if(app.isRandom) {
                app.randomSong();
            }
            else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToTop();

        }    
        // *xử lý random song
        randomButton.onclick= function(e) {
            app.isRandom = !app.isRandom;
            randomButton.classList.toggle('activeBtn', app.isRandom);

            randomButton.classList.toggle('dark-mode-BtnToggle', app.isRandom && header.classList.contains('dark-mode'));
        }

        // *xử lý lập lại song
        repeatButton.onclick = function(e) {
            app.isRepeat = !app.isRepeat;
            repeatButton.classList.toggle('activeBtn', app.isRepeat);

            repeatButton.classList.toggle('dark-mode-BtnToggle', app.isRepeat && header.classList.contains('dark-mode'));

        }

        // *xử lý khi song kết thúc
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play();
            }
            else {
            nextButton.click();
            }
        }

        // *xử lý khi click vào song
        musicList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if( songNode|| e.target.closest('.option'))  {
                if(songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
            }
        }

        // *xử lý darkmode
        darkMode.addEventListener('click', () => {
            header.classList.toggle('dark-mode');
            headerTitle.classList.toggle('dark-mode');
            playButton.classList.toggle('dark-mode-Btn');
            headerText.classList.toggle('dark-mode-Text');
        })
    },
    loadCurrentSong: function(){
        headerTitle.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        audio.onloadedmetadata = function() {
            audio_duration.innerHTML = `${timeConvert(Math.round(Math.floor(audio.duration)))}`;
            progress.max = audio.duration;
            progress.value = audio.currentTime;
            }
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.song.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex <= 0) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    randomSong: function(){
        let newIndex;
        do {
        newIndex =  Math.floor(Math.random() * this.song.length);
        } while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToTop: function(){
        setTimeout(() => {
            if(this.currentIndex === 0 || this.currentIndex === 1) {
                $('.active').scrollIntoView({
                    behavior:'smooth',
                    block:'center',
                })
            }
            else {
                $('.active').scrollIntoView({
                    behavior:'smooth',
                    block:'nearest',
                })
            }
        }, 500)
    },
    start: function(){
        this.defineProperties();
        this.loadCurrentSong();
        this.handleEvent();
        this.render();
        console.log(songInfo)
    }
}

app.start();