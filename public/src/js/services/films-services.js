async function getFilms(){
    //Fetch un fichier json
    let url = 'http://localhost:8082/src/donnees/films.json';
    let reponse; 
    try{
        reponse = await fetch(url);
        reponse = await reponse.json();
    }catch(err){
        reponse=[];
    }
    return reponse;
}
function ajouterFilm() {
    var formData = new FormData(document.getElementById('formAjouter'));
    //formData.append("id",new Date().toISOString());
    
    fetch('/enregistrer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then( donnees => {
        afficherDansListeFilms(donnees);
    })
    .catch(err => console.log(err))
  }