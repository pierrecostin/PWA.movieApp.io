

let infosBD={'bd': 'bdfilms', 'stores':[{'st': 'films', 'id':'numFilm'},{'st': 'sync-films', 'id':'numFilm'}]};
var dbPromise=creerBD(infosBD);



function montrerInstallBanner() {
if (promptDiffere){
    promptDiffere.prompt();
    promptDiffere.userChoice.then(function(choiceResult) {
    console.log(choiceResult.outcome);
    if (choiceResult.outcome === 'dismissed'){
    console.log('Installation cancellée');
    } else {
    console.log('Usager a installé notre application');
    }
});
    promptDiffere = null;
}
}

$( document ).ready(function() {
    $( "#btAjouterFilm").click(function() {
        $ ( "#divAjouter" ).toggle( "slow");
        });
    });

var formAjouter=document.querySelector("#formAjouter");
var titre=document.querySelector("#Titre");
var res=document.querySelector("#Realisateur");
var gen=document.querySelector("#Genre");
var duree=document.querySelector("#Duree");

formAjouter.addEventListener('submit', function(event) {
    event.preventDefault();

    if (titre.value.trim() === '' || res.value.trim() === '') {//on ferait une vraie validation des données
        alert('Vérifiez vos données!');
        return;
      }
      else{
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready
            .then((sw) => {//instance du SW
              film = {//film à envoyer au serveur
                NumFilm:99, //dans notre store on a définit une clé
                Titre:titre.value,
                Realisateur:res.value,
                Genre:gen.value,
                Duree:duree.value,
                CheminPochette:"src/img/cornisland.jpg"
             };
              //enregistrer les infos du film dans notre BD bdfilms
              enregistrer('sync-films', film)
                .then(function() {
                  return sw.sync.register('sync-nouveau-film');//tag de notre Sync Task enregistré dans le SW
                })
                .then(function() {
                  document.querySelector('#msg').innerHTML="Enregistré dans le store sync-films";
                  setInterval(() => { document.querySelector('#msg').innerHTML=""; }, 5000);
                })
                .catch(function(err) {
                  console.log(err);
                });
            });
        } else {
          ajouterFilm();//définie dans films-service.js
        }
      }
    })
    
    function afficherDansListeFilms(unFilm){
      vueListeFilms = '<div class="col-sm-4">'+
      '<div class="card">'+
        '<div class="image">'+
          '<img src="'+unFilm.CheminPochette+'"/>'+
        '</div>'
        '<div class="card-inner">'+
          '<div class="header">'+
            '<h2>'+unFilm.Genre+'</h2>'+
       '</div>'+
        '<div class="content">'+
          '<p>'+unFilm.Titre+'</p>'+
        '</div>'+
          '</div>'+
      '</div>'
  '</div>';
    document.getElementById("listeFilms").innerHTML+=vueListeFilms;
    }
    
    
    