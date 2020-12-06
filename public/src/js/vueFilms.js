var vueListeFilms="";
var tabFilms = [];

async function remplirTabFilms(reponse){
  if(reponse.length>0){//pas null
      tabFilms=reponse;
  }else{//on est hors ligne et on va chercher nos données dans notre store films
      tabFilms= await contenuStore('films');
  }
}

async function listeFilms(){
  reponse = await getFilms();
  await remplirTabFilms(reponse);
for(unFilm of tabFilms){
vueListeFilms += 
'<div class="col-sm-4">'+
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
}
document.getElementById("listeFilms").innerHTML+=vueListeFilms;
}