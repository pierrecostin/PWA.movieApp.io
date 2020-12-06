
async function creerBD(infosBD){

	return await idb.open(infosBD.bd,1, (db) => {
		let listeStores=infosBD.stores;
		for(unSt of listeStores){
			if (!db.objectStoreNames.contains(unSt.st)){
				db.createObjectStore(unSt.st, {keypath: unSt.id});
		}
	}	
});
}

let dbPromise = idb.open('dbfilms', 1, (db) => {//dbfilms la base de données
    if (!db.objectStoreNames.contains('films')) {//films la «table»
      db.createObjectStore('films', {keyPath: 'NumFilm'});//clé de recherche
    }
  });

  function enregistrer(st, donnees) {
    return dbPromise
      .then((db) => {
        var tx = db.transaction(st, 'readwrite');
        var store = tx.objectStore(st);
        store.put(donnees);
        return tx.complete;
      });
  }

  function contenuStore(st) {
    return dbPromise
      .then((db) => {
        var tx = db.transaction(st, 'readonly');
        var store = tx.objectStore(st);
        return store.getAll();
      });
  }
    
  function viderStore(st) {
    return dbPromise
      .then(function(db) {
        var tx = db.transaction(st, 'readwrite');
        store.clear();
        return tx.complete;
      });
  }

  function supprimerElement(st, id) {
    dbPromise
      .then(function(db) {
        var tx = db.transaction(st, 'readwrite'); 
        var store = tx.objectStore(st);
        store.delete(id);
        return tx.complete;
      })
    .then(function(){
        console.log('Element supprimé');
    });
  }


