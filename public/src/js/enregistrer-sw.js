if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('/sw-films.js')
    .then(function() {
        console.log('serice worker enregistré!')
    }).catch(function(err) {
        console.log('Problème pour enregistrer le sw ' + err);
    });;

}

var promptDiffere;

window.addEventListener('beforeinstallprompt', function(event){
    console.log('on est dans beforeinstallprompt');
    event.preventDefault();
    promptDiffere = event;
    return false;
});

