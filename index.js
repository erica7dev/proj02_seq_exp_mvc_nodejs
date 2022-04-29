const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session"); //session & cookies
const FileStore = require("session-file-store")(session); //armazena dados da session em arq. de sessão
const flash = require("express-flash");

const app = express();

//db
const conn = require("./db/conn");

// Models
const Tought = require("./models/Tought");

// routes
const toughtsRoutes = require("./routes/toughtsRoutes");
const authRoutes = require("./routes/authRoutes");
const ToughController = require("./controllers/ToughtController");

//view engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//session middleware
app.use(
  session({
    name: 'session',
    secret: 'trem_esquisito',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  }),
)

app.use(flash()); //msg flash  renderiza sem redirecionar solicitação

app.use(express.static("public"));

//middleware
app.use((req, res, next) => {
  console.log(req.session.userid);

  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next();
});

//config. routes
app.use("/toughts", toughtsRoutes);
app.use("/", authRoutes);


app.get("/", ToughController.showToughts);

//db
conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));