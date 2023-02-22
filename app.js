const express = require('express');
const { result } = require('lodash');
const { default: mongoose } = require('mongoose')
const blogRoutes = require('./routes/blogRoutes')
    //express app
const app = express()

//connect to mongodb
mongoose.set("strictQuery", false);
const dbURI = 'mongodb+srv://shravantest:test1234@nodetutorial.bikqxgr.mongodb.net/node-tuts?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));


//listen for requests
// app.listen(3000);

// register for view engine 
app.set('view engine', 'ejs');
// app.set('views','myviews')


//morgan 3rd party middleware and static files
const morgan = require('morgan')

app.use(express.static('public'))

//for passing url encoded data and pass it to the req object
app.use(express.urlencoded({ extended: true }))

//middleware
app.use(morgan('dev'));



//mongoose and mongo sandbox routes
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'new blog 2',
        snippet: 'about my new blog',
        body: 'more about my new blog'
    });

    blog.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        });

})

app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/single-blog', (req, res) => {
    Blog.findById('63f320c6f41ef23df3eb2b6d')
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/', (req, res) => {
    // res.send('<h1>Home page</h1>')
    // res.sendFile('./views/index.html', { root: __dirname });
    // const blogs = [
    //     { title: 'Raj finds eggs', snippet: 'Lorem ipsum dolor sit amet' },
    //     { title: 'Ram finds stars ', snippet: 'Lorem ipsum dolor sit amet' },
    //     { title: 'Introduction to c++', snippet: 'Lorem ipsum dolor sit amet' }
    // ];
    // res.render('index', { title: 'Home', blogs });
    res.redirect('/blogs');

});

app.get('/about', (req, res) => {
    // res.send('<h1>About page</h1>')
    // res.sendFile('./views/about.html', { root: __dirname });
    res.render('about', { title: 'About' });
});


//blog routes
app.use('/blogs', blogRoutes);

// // redirects

// app.get('/about-us', (req, res) => {
//     res.redirect('/about');
// })

//404 page

app.use((req, res) => {
    // res.status(404).sendFile('./views/404.html', { root: __dirname });
    res.status(404).render('404', { title: '404! Not found' })
})