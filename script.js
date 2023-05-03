const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const url = "https://api.lyrics.ovh";

form.addEventListener('submit', e => {
    e.preventDefault();
    const songtxt = search.value.trim();

    if (!songtxt) {
        alert("ປ້ອນຂໍ້ມູນບໍ່ຖຶກຕ້ອງ");
    } else {
        searchLyrics(songtxt);
    }
});

async function searchLyrics(song) {
    const res = await fetch(`${url}/suggest/${song}`);
    const allSongs = await res.json();
    showData(allSongs);
}

function showData(songs) {
    // console.log(songs);
    result.innerHTML = `
        <ul class="songs">
            ${songs.data.map(song =>
                `<li>
                    <span>
                        <strong>${song.artist.name}</strong> - ${song.title}
                    </span>
                    <button class="btn" 
                     data-artist="${song.artist.name}"
                     data-song="${song.title}"
                    >ເນື້ອເພງ</button>
                </li>`
            ).join("")}
        </ul>
    `;

    if (songs.next || songs.prev) {
        more.innerHTML = `
        ${songs.prev ? `<button class="btn" onclick="getMoreSongs('${songs.prev}')">ກ່ອນໜ້າ</botton>` : ''}
        ${songs.next ? `<button class="btn" onclick="getMoreSongs('${songs.next}')">ຖັດໄປ</botton>` : ''}
        `
    } else {
        more.innerHTML = '';
    }
}

async function getMoreSongs(songsUrl) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${songsUrl}`);
    const allSongs = await res.json();
    showData(allSongs);
}

result.addEventListener('click', e => {
    const clickEl = e.target;

    if (clickEl.tagName == "BUTTON") {
        const artist = clickEl.getAttribute('data-artist');
        const songName = clickEl.getAttribute('data-song');


        getLyrics(artist, songName);
    }
});

async function getLyrics(artist, songName) {
    const res = await fetch(`${url}/v1/${artist}/${songName}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,"<br>");

    if (lyrics) {
        result.innerHTML = `
        <h2><span>
            <strong>${artist}</strong> - ${songName}
        </span></h2>
        <span>${lyrics}</span>`;
    } else {
        result.innerHTML = `
        <h2><span>
            <strong>${artist}</strong> - ${songName}
        </span></h2>
        <span>ບໍ່ມີເນື້ອເພງນີ້</span>`;
    }

    more.innerHTML = "";
}