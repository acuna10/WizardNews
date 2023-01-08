const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");
const app = express();

app.use(express.static("public"));

app.use(morgan('dev'));

//list posts//
app.get("/", (req, res) => {
  const posts = postBank.list();
  
  const html = `<!DOCTYPE html>
  <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
    <div class="news-list">
    <header><img src="/logo.png"/>Wizard News</header>
    ${posts.map(post => `
      <div class='news-item'>
        <p>
          <span class="news-position">${post.id}. ▲</span>
          <a href="/posts/${post.id}">${post.title}</a>
          <small>(by ${post.name})</small>
        </p>
        <small class="news-info">
          ${post.upvotes} upvotes | ${post.date}
        </small>
      </div>`
  ).join('')}
  </div>
    </body>
  </html>`;

  res.send(html);
});

//single post view//
app.get('/posts/:id', (req, res, next) => {
  const id = req.params.id;

  const post = postBank.find(id);

  const singleView = `<!DOCTYPE html>
  <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        <br>
        <div>
          ${post.title}
          <small>(by ${post.name})</small>
        </div>
        <br>
        ${post.content}
      </div>
    </body>
  </html>`;

  //error page//
  if (!post.id) {
    res.status(404)
    const html = `<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>404: Page Not Found --- Try Another One My Friend.</p>
       <div class="tenor-gif-embed" data-postid="14677181" data-share-method="host" data-aspect-ratio="1.52381" data-width="100%"><a href="https://tenor.com/view/calculating-puzzled-math-confused-confused-look-gif-14677181">Calculating Puzzled GIF</a>from <a href="https://tenor.com/search/calculating-gifs">Calculating GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
    </body>
    </html>`
    res.send(html)
  }
  else {
    res.send(singleView);
  }
});

const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});