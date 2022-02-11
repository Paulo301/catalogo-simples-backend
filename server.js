const express = require('express');

const app = express();

const porta = 8080;

let users = [] // { id, login, senha}
let favorites = [] // [{ userId, favorites}]

app.use(express.json());

app.post("/login", (req, res) => {
  const dados = req.body;
  const foundUser = false;

  users.forEach((user) => {
    if((user.login === dados.login) && (user.password === dados.password)){
      res.send(JSON.stringify({ token: user.login+"_@_"+user.password }));
      foundUser = true;
    } else if((user.login === dados.login)){
      res.status(401).send("Senha incorreta");
      foundUser = true;
    }
  });
  if(!foundUser){
    const newId = users.length ? users[users.length-1].id+1 : 0;
    users.push(
      {
        id: newId,
        login: dados.login, 
        password: dados.password
      }
    );
    favorites.push({ userId: newId, favorites: []});
    res.send(JSON.stringify({ token: dados.login+"_@_"+dados.password }));
  }

});

app.get("/listar-favoritos", (req, res) => {
  const dados = req.params.token.split("_@_");
  
  users.forEach((user) => {
    if((user.login === dados[0]) && (user.password === dados[1])){
      res.send(JSON.stringify({ 
        favorites:  favorites.find((favorite) => favorite.userId === user.id).favorites 
      }));
    }
  });
});

app.post("/adicionar-favorito", (req, res) => {
  const dados = req.params.token.split("_@_");
  const id = req.body;
  let userId = 0;

  users.forEach((user) => {
    if((user.login === dados[0]) && (user.password === dados[1])){
      userId = user.id;
    }
  });

  favorites = favorites.map((favorite) => {
    if(favorite.userId === userId){
      return {...favorite, favorites: [...favorite.favorites, id.id]}
    }
  });
});

app.delete("/remover-favorito", (req, res) => {
  const dados = req.params.token.split("_@_");
  const id = req.body;
  let userId = 0;

  users.forEach((user) => {
    if((user.login === dados[0]) && (user.password === dados[1])){
      userId = user.id;
    }
  });

  favorites = favorites.map((favorite) => {
    if(favorite.userId === userId){
      return {
        ...favorite, 
        favorites: favorite.favorites.filter((fav) => fav !== id.id)
      }
    }
  });
});

app.listen(porta, () => {
  console.log("Servidor iniciado!");
});