importScripts('/src/js/librairie/idb.js');
importScripts('/src/js/librairie/idb-operations.js');

const versionCache = '4';
const NOM_CACHE_STATIQUE = `cache-statique-${versionCache}`;
const NOM_CACHE_DYNAMIQUE = `cache-dynamique-${versionCache}`;

let infosBD={'bd': 'bdfilms', 'stores':[{'st': 'films', 'id':'numFilm'},{'st': 'sync-films', 'id':'numFilm'}]};
var dbPromise=creerBD(infosBD);

const ressources = [
    '/',
    '/index.html',
    '/pages/horror.html',
    '/pages/animation.html',
    '/pages/action.html',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/js/bootstrap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/js/bootstrap.bundle.min.js', 
  
    '/manifest.webmanifest',
    'src/style.css', 
    'src/img', 
    'src/js/librairie/idb.js', 

    'src/donnees/films.js',
    'src/js/vueFilms.js',
    'src/js/enregistrer-sw.js', 
    'src/js/app.js',
    'src/favicon.ico'

  ];

  self.addEventListener('install', function(event) {
    console.log("[Service Worker] En cours d'installation du SW ...", event);
    event.waitUntil(
        caches.open(NOM_CACHE_STATIQUE).then(cache => {
          cache.addAll(ressources);
        })
      );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys()
        .then(function(keyList) {
          return Promise.all(keyList.map(function(key) {
            if (key !== NOM_CACHE_STATIQUE && key !== NOM_CACHE_DYNAMIQUE) {
              return caches.delete(key);
            }
          }));
        })
    );
  });


  self.addEventListener("fetch", event => {
    let url = 'https://location:8082/src/donnees/films.json';
    if (event.request.url.indexOf(url) > -1) {
     event.respondWith(fetch(event.request)
       .then((resp) => {
        var cloneResp = resp.clone();
        cloneResp.json()
         .then((donnees) => {
          for (var film of donnees) {
            enregistrer('films', film);
          }
          return resp;
         });
         return resp; 
        }).catch(err => {})
       );
      }
      else{ 
        event.respondWith(
        caches.match(event.request).then(response => {
          return (
            // Si dans le cache statique alors le retourner  
            response ||
            // sinon, prenez la réponse de la demande, ouvrez le cache dynamique 
            //et stockez-y la réponse
            // on utilise resp puisque response est déjà utilisé
            fetch(event.request).then(resp => { 
              return caches.open(NOM_CACHE_DYNAMIQUE).then(cache => {
                // vous devez stoker absolument un clone de la réponse soit resp
                cache.put(event.request.url, resp.clone());
                // puis renvoyez la demande d'origine au navigateur
                return resp;
              });
            })
          );
        }).catch(err => {})
      );
      }
  });

  self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-nouveau-film') {
      console.log('[Service Worker] sync nouveau film');
      event.waitUntil(
        contenuStore('sync-films')
          .then((listeFilms) =>  {
            for (var unFilm of listeFilms) {console.log("En SW");console.log(JSON.stringify(unFilm));
              fetch('/enregistrer', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify(unFilm)
              })
                .then((res) => {console.log(res);
                  //afficherDansListeFilms(leFilmEnregistre);
                  if (res.ok) {
                    supprimerElement('sync-films',unFilm.NumFilm);
                  }
                })
                .catch((err) => {
                  console.log('Erreur avec envoyer les données', err);
                });
            }
  
          })
      );
    }
  });
  