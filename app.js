var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongojs = require('mongojs');
var db = mongojs('admin:administrateur1@ds063725.mlab.com:63725/spi', ['Lecture','Eleves']);
var ObjectId = mongojs.ObjectId;

var app = express();

//View engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

//Middleware Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Static Path
app.use(express.static(path.join(__dirname,'public')));

//Variables locales

utilisateurEnLigne = null;


//Route get
app.get('/',function(req,res){
    
    res.render('index');
    
});

app.get('/menu',function(req,res){
    
    if(utilisateurEnLigne != null){
        
        res.render('menu',{
            utilisateur: utilisateurEnLigne
        });
        
    } else{
        res.render('index');
    }
    
});

app.get('/menu_enseignant',function(req,res){
   
    res.render('menu_enseignant');
});

app.get('/menu_eleve',function(req,res){
   
    res.render('menu_eleve');
});

app.get('/boite_outils',function(req,res){
   
    res.render('boite_outils');
});

app.get('/eleve/formulaire',function(req,res){
   
    res.render('formulaire_eleve');
});

app.get('/sauvegarde',function(req,res){
    
    res.render('initialisation');
});

app.get('/radiation/:id',function(req,res){
   
    console.log("Supression: " + req.params.id);
    db.Eleves.remove({_id: ObjectId(req.params.id)});

    res.redirect('/inscription');
    
});

app.get('/inscription',function(req,res){
    
    db.Eleves.find(function (err, docs) {
        
        res.render('inscription',{
            listeEleves: docs
        });
        
    });

});

app.get('/lecture',function(req,res){
    
    db.Lecture.find(function (err, docs) {
        
        res.render('lecture',{
            listeLivres: docs
        });
        
    });

});

app.get('/listes',function(req,res){
    
    res.render('listes');
});

app.get('/evaluation',function(req,res){
    
   
    res.render('evaluation');
});

app.get('/repartition',function(req,res){
    
    res.render('repartition');
});

app.get('/profil',function(req,res){
    
    res.render('profil');
});

app.get('/bulletin',function(req,res){
    
    res.render('bulletin');
});

app.get('/notions',function(req,res){
    
    res.render('notions');
});

app.get('/travail',function(req,res){
    
    res.render('travail');
});

//Route post
app.post('/menu',function(req,res){
    
    
    var utilisateur = {
        
        ecole: req.body.ecole,
        login: req.body.login,
        password: req.body.mdp
        
    }
    
    utilisateurEnLigne = utilisateur;
    
    res.render('menu',{
        utilisateur: utilisateurEnLigne
    });
});

app.post('/inscription',function(req,res){
    
   
    nouveauEleve = {
        
        Prenom: req.body.prenom,
        Nom: req.body.nom,
        DateNaissance: req.body.naissance,
        Adresse: req.body.adresse,
        Ville: req.body.ville,
        Cpostal: req.body.cpostal,
        Telephone: req.body.telephone,
        Niveau: req.body.niveau
        
    }    
    
    db.Eleves.insert(nouveauEleve);
    
    console.log(req.body);
    
    res.redirect('/inscription');
    
});

app.post('/FormulaireEleveConfirmation',function(req,res){
    

    var note = false;
    var num = false;
    
    if((typeof req.body.nonnum === 'undefined') && (typeof req.body.ouinum === 'undefined')){
        num = false;
    } else{
        if(req.body.ouinum === 'true'){
            
            num = true;
        }
    }
    
    if((typeof req.body.ouinote === 'undefined') && (typeof req.body.nonnote === 'undefined')){
        note = false;
    }else{
        if(req.body.ouinote === 'true'){
            note = true;
        }
    }

    var resultat = {
        note: note,
        numerique: num
    }
    
    console.log(resultat);
    
    res.render('formulaire_eleve_confirmation',{
        resultat: resultat
    });
    
});


app.listen(3000,function(){
    
    console.log('Serveur en écoute sur le port 3000');
})