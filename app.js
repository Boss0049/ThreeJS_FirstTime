import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/three', express.static('ThreeJS'));
app.use(express.static('public'));

app.get('/', (req, res) => { res.send("ThreeJSDemo"); });

const addPage = (r, t, v = 'preview') => { app.get(r, (req, res) => { res.render(v, {go_to: t}); }); }

addPage('/ex1',  'Ex1');
addPage('/ex2',  'Ex2');
addPage('/ex3',  'Ex3');
addPage('/ex4',  'Ex4');
addPage('/ex5',  'Ex5');
addPage('/ex6',  'Ex6');
addPage('/ex7',  'Ex7');
addPage('/ex8',  'Ex8');
addPage('/ex9',  'Ex9');
addPage('/ex10', 'Ex10');
addPage('/ex11', 'Ex11');
addPage('/ex12', 'Ex12');

addPage('/ar-model', 'AR-Model');
addPage('/ar-dino', 'ARDino');
addPage('/vr-dino', 'VRDino');
addPage('/test', 'Test');

addPage('/a1', 'a1');
addPage('/a2', 'a2');
addPage('/a3', 'a3');
addPage('/a4', 'a4');
addPage('/a5', 'a5');
addPage('/a6', 'a6');
addPage('/a7', 'a7');
addPage('/a8', 'a8');
addPage('/a9', 'a9');
addPage('/a10', 'a10');
addPage('/a11', 'a11');

app.listen(port, () => {
	console.log("Starting server. PORT:"+port);
});


