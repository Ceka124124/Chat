// Firebase yapılandırma ve başlatma
const firebaseConfig = {
    apiKey: "AIzaSyCtSf4MPyJktuIX774VogmvsORjMXfClvc",
    authDomain: "sohbet-uygulamasi-1dec6.firebaseapp.com",
    databaseURL: "https://sohbet-uygulamasi-1dec6.firebaseio.com",
    projectId: "sohbet-uygulamasi-1dec6",
    storageBucket: "sohbet-uygulamasi-1dec6.appspot.com",
    messagingSenderId: "138065161828"
};
firebase.initializeApp(firebaseConfig);

// Giriş yapma
function uyeKaydet() {
    var kadi = $("#kadi").val();
    if (kadi != "") {
        var userKey = firebase.database().ref("users/").push().key;
        firebase.database().ref("users/" + userKey).set({
            username: kadi,
            kulid: userKey
        });
        $("#girisEkrani").hide();
        $("#chatEkrani").show();
        chatYukle();
    } else {
        alert("Kullanıcı adını boş bırakmayınız!");
    }
}

// Mesaj gönderme
function mesajGonder() {
    var mesaj = $("#mesaj").val();
    var kadi = $("#kadi").val();
    if (kadi != "" && mesaj != "") {
        var tarih = new Date();
        var messageKey = firebase.database().ref("chats/").push().key;
        firebase.database().ref("chats/" + messageKey).set({
            message: mesaj,
            from: kadi,
            tarih: tarih.getTime()
        });
        $("#mesaj").val(''); 
    } else {
        alert("Lütfen boş alan bırakmayınız!");
    }
}

// Sohbeti yükleme
function chatYukle() {
    var query = firebase.database().ref("chats");
    var kadi = $("#kadi").val();
    query.on('value', function (snapshot) {
        $("#mesajAlani").html("");
        snapshot.forEach(function (childSnapshot) {
            var data = childSnapshot.val();
            var mesaj = data.from === kadi ? 
                `<div class="d-flex justify-content-end">
                    <div class="alert alert-info">${data.message} <b>@${data.from}</b></div>
                 </div>` :
                `<div class="d-flex">
                    <div class="alert alert-dark"><b>@${data.from}</b> ${data.message}</div>
                 </div>`;
            $("#mesajAlani").append(mesaj);
        });
    });
}

// Resim yükleme
function uploadImage(event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref('images/' + file.name);
    storageRef.put(file).then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
            sendMessage(url);
        });
    });
}

// Mesaj gönderme (Resim/Video)
function sendMessage(content) {
    const messageRef = firebase.database().ref('chats').push();
    messageRef.set({
        sender: 'Kullanıcı1',
        message: content,
        timestamp: Date.now()
    });
}

// Mesajlarda arama
function searchMessages() {
    const query = document.getElementById("searchMessage").value.toLowerCase();
    firebase.database().ref('chats').orderByChild('message').startAt(query).endAt(query + "\uf8ff").on('value', function(snapshot) {
        // Arama sonuçlarını göster
    });
                                           }
