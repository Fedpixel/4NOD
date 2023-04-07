const express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    dotenv = require('dotenv').config(),
    Serie = require('./models/serie.model'),
    bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({extended: false}),
    url = require('url')


//Connexion à la BDD
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Remplir la BDD si elle est vide
Serie.countDocuments({}, (err, cnt) => {
    if (err) console.error(err)

    if (cnt === 0) {
        const series = []
        let serie = {}
        //On définit la série 1
        serie['name'] = 'Game Of Thrones'
        serie['releaseDate'] = '17 avril 2011'
        serie['numberOfSeason'] = 8
        serie['description'] = "Neuf familles nobles rivalisent pour le contrôle du Trône de Fer dans les sept royaumes de Westeros. Pendant ce temps, des anciennes créatures mythiques oubliées reviennent pour faire des ravages."
        serie['imgUrl'] = "https://fr.web.img3.acsta.net/c_310_420/pictures/23/01/03/14/13/0717778.jpg"
        serie['comments'] = [{ content: "Super série je l'ai regardé deux fois !", author: "Michel",  date: "25 janvier 2020"}]

        series.push(serie)
        serie = {}

        //On définit la série 2
        serie['name'] = 'The Walking Dead'
        serie['releaseDate'] = '31 octobre 2010'
        serie['numberOfSeason'] = 11
        serie['description'] = "Après une apocalypse ayant transformé la quasi-totalité de la population en zombies, un groupe d'hommes et de femmes mené par l'officier Rick Grimes tente de survivre. Ensemble, ils vont devoir tant bien que mal faire face à ce nouveau monde."
        serie['imgUrl'] = "https://fr.web.img6.acsta.net/pictures/22/08/29/18/20/3648785.jpg"

        series.push(serie)

        // Ajout en BDD
        series.forEach(serie => new Serie(serie).save())
    }
})

//Initialisation du serveur
const app = express()
app.set('view engine', 'ejs')

//Middlewares
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

//Page d'accueil
app.get('/', (req, res) => {
    Serie.find({}, (err, series) => {
        if (err) console.log(err)
        res.render('home', {series: series})
    })
})

//Affichage page modification d'une serie
app.get('/edit/:id', (req, res) => {
    Serie.find({}, (err, series) => {
        if (err) console.log(err)
        res.render('editSerie',
            {
                series: series,
                id: req.params.id
            })
    })
});

//Interpretation du POST pour la modification d'une serie
app.post('/edit/:id', urlencodedParser, (req, res) => {

    Serie.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        releaseDate: req.body.releaseDate,
        numberOfSeason: req.body.numberOfSeason,
        description: req.body.description,
        imgUrl: req.body.imgUrl
    }, function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            console.log("Updated User : ", docs)
        }
    })

    res.redirect('/')
})

//Affichage page ajout d'une serie
app.get('/add', (req, res) => {
    res.render('addSerie')
});

//Interpretation du POST pour l'ajout d'une serie
app.post('/add', urlencodedParser, (req, res) => {

    let serie = {}
    serie['name'] = req.body.name
    serie['releaseDate'] = req.body.releaseDate
    serie['numberOfSeason'] = req.body.numberOfSeason
    serie['description'] = req.body.description
    serie['imgUrl'] = req.body.imgUrl

    new Serie(serie).save()
    res.redirect('/')
})

//Suppression d'une serie
app.get('/delete/:id', (req, res) => {
    Serie.findByIdAndDelete(req.params.id)
        .exec((err, offer) => {
            if (err) {
                console.error(err)
            }
        })
    res.redirect('/')
})

//Suppression d'un commentaire
app.get('/comments/delete/:id', (req, res) => {
    Serie.findByIdAndUpdate(req.params.id, {
        comments: []
    }, function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            console.log("Updated User : ", docs)
        }
    })
    res.redirect('/')
})

//Affichage page modification d'un commentaire
app.get('/comments/edit/:id', (req, res) => {
    Serie.find({}, (err, series) => {
        if (err) console.log(err)
        res.render('editComments',
            {
                series: series,
                id: req.params.id
            })
    })
});

//Interpretation du POST pour la modification d'un commentaire
app.post('/comments/edit/:id', urlencodedParser, (req, res) => {

    Serie.findByIdAndUpdate(req.params.id, {
        comments: [{ content: req.body.content, author: req.body.author,  date: req.body.date}]
    }, function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            console.log("Updated User : ", docs)
        }
    })

    res.redirect('/')
})

//Page inexistante
app.use((req, res) => {
    res.status(404)
    res.render('not-found')
})

//Mise en écoute du serveur
app.listen(8080, () => {
    console.log(`The server is running on port ${process.env.SERVER_PORT}`)
})



