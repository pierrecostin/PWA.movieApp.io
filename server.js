const fs = require('fs');
const express = require("express");
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));

var server = app.listen(8082, function () {

var host = server.address().address
var port = server.address().port
console.log("Serveur démarré à http://%s:%s", host, port)
})

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get('/',(req,res) => {
    res.sendFile( __dirname + "(/index.html" )
});

app.post('/enregistrer',(req, res) => {
    film = {
        Titre:req.body.Titre,
        Realisateur:req.body.Realisateur,
        Categorie:req.body.Genre,
        Duree:req.body.Duree,
        CheminPochette:"src/img/cornisland.jpg"
     };
     strReponse=JSON.stringify(reponse);
     
     
     let fichierJSON=__dirname + "/public/src/donnees/films.json";
     const json = fs.readFileSync(fichierJSON, 'UTF8');
     const tabFilms = JSON.parse(json);
     tabFilms.push(reponse);
     strTabFilms=JSON.stringify(tabFilms);

     fs.writeFileSync(fichierJSON, strTabFilms);

     res.header('Content-type', 'application/json');
     res.header('Charset', 'utf8');
     res.send(strReponse);

    });

