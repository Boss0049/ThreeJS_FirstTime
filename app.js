import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/three', express.static('ThreeJS'));
app.use(express.static('public'));

app.get('/', (req, res) => { res.send("ThreeJSDemo"); });
app.get('/ex1', (req, res) => { res.render('preview', {go_to:"Ex1"}); });
app.get('/ex2', (req, res) => { res.render('preview', {go_to:"Ex2"}); });
app.get('/ex3', (req, res) => { res.render('preview', {go_to:"Ex3"}); });

app.get('/ar-model-360', (req, res) => { res.render('preview', {go_to:"AR-Model-360"}); });

app.listen(port, () => {
	console.log("Starting server. PORT:"+port);
});
