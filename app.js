// app.js
require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql2");
const path = require("path");
const upload = require("./uploads");
const feed = require("./photos");
const bodyParser = require("body-parser");
const fs = require("fs");
const bcrypt = require("bcrypt");
const sendMail = require("./sendMail");
const session = require("express-session");
const flash = require("express-flash");
const serverless = require("serverless-http");
const Razorpay = require("razorpay");

// MySQL Connection
const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Connect to MySQL
// Use connection pool
// Test the connection pool
connection.getConnection((err, conn) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }

  console.log("Connected to database.");

  // Release the connection
  conn.release();
});
// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the public directory for static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Set up session and flash:
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

app.use(flash());

// Define a route to render the index page
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/main", (req, res) => {
  res.render("main");
});

app.get("/scoreboard", (req, res) => {
  res.render("scoreboard");
});

app.get("/regForm", (req, res) => {
  res.render("regForm");
});

app.get("/training", (req, res) => {
  res.render("training");
});

// app.get("/feeds", (req, res) => {
//   res.render("feeds");
// });

app.get("/login", (req, res) => {
  res.render("login");
});

// Route to fetch data and render the view
app.get("/store", (req, res) => {
  // Use connection pool to query data
  connection.getConnection((err, conn) => {
    if (err) {
      console.error("Error acquiring connection from pool:", err);
      res.status(500).send("Error acquiring connection from pool");
      return;
    }

    // Query to fetch data from MySQL
    conn.query("SELECT * FROM store", (err, rows) => {
      // Release the connection back to the pool
      conn.release();

      if (err) {
        console.error("Error fetching data: " + err.stack);
        res.status(500).send("Error fetching data");
        return;
      }

      // Render the view and pass the fetched data
      res.render("store", { store: rows });
    });
  });
});

// uploading and storing event
app.post("/event", upload.single("photo"), (req, res) => {
  const { eventName, owner } = req.body;
  const photo = req.file.filename; // Multer adds 'file' object to the request
  // Use connection pool to query data
  connection.getConnection((err, conn) => {
    if (err) {
      console.error("Error acquiring connection from pool:", err);
      res.status(500).send("Error acquiring connection from pool");
      return;
    }
    const sql =
      "INSERT INTO tournaments (event_name, owner, photo_path) VALUES (?, ?, ?)";
    conn.query(sql, [eventName, owner, photo], (err, results) => {
      conn.release();
      if (err) {
        console.error("Error executing query", err);
        return res.status(500).send("Error saving event to database");
      }
      res.status(200).redirect("tournaments");
    });
  });
});

// Define the folder containing images
const imageFolder = "uploads/images";
// Route to fetch tournament details from database
app.get("/tournaments", (req, res) => {
  // Read the files in the image folder
  fs.readdir(imageFolder, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Filter out only image files
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    // Render the EJS template and pass the image files to it
    res.render("tournaments", {
      images: imageFiles,
      imageFolder: "images",
    });
  });
});

//signUp Form
app.post("/sign", async (req, res) => {
  const { name, user, pass, mail } = req.body;

  const hashedPassword = await bcrypt.hash(pass, 10);
  // Server-side validation
  if (!name || !user || !pass || !mail) {
    req.flash("error", "All fields are required");
    return res.redirect("/login");
  }

  if (!/^[A-Za-z\s]+$/.test(name)) {
    req.flash("error", "Name must contain only letters and spaces");
    return res.render("login");
  }

  // Use connection pool to query data
  connection.getConnection((err, conn) => {
    if (err) {
      console.error("Error acquiring connection from pool:", err);
      res.status(500).send("Error acquiring connection from pool");
      return;
    }
    const query =
      "INSERT INTO signup_user (name, user, pass, mail) VALUES (?, ?, ?, ?)";
    conn.query(query, [name, user, hashedPassword, mail], (err, results) => {
      conn.release();
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          if (err.message.includes("username")) {
            console.log(err);
            req.flash("error", "Username already exists");
          } else if (err.message.includes("email")) {
            console.log(err);
            req.flash("error", "Email already exists");
          } else {
            throw err;
          }
          res.render("login");
        } else {
          throw err;
        }
      } else {
        console.log("accout created succesfully ");

        // Send email notification
        const subject = "🏀 Welcome to Hoopers! 🏀";
        const message = `Dear ${name},

        On behalf of the entire Hoopers team, I want to extend a warm welcome to you! We are thrilled to have you join our community of basketball enthusiasts and fans.
        
        Your registration marks the beginning of an exciting journey with us. Whether you're here to stay updated on the latest basketball news, connect with fellow fans, participate in discussions, or access exclusive content, we're committed to providing you with an exceptional experience tailored to your passion for the game.
        
        Here are a few things you can look forward to as a member of our community:
        
        👉Access to Exclusive Content: Gain access to insider stories, interviews, analysis, and much more from the world of basketball.
        
            👉Engaging Discussions: Participate in lively discussions with other fans, share your thoughts, and exchange ideas on all things basketball-related.
        
            👉Customized Experience: Personalize your profile, set preferences, and receive recommendations based on your interests to make the most out of your time on Hooper.
        
            👉Stay Updated: Never miss a beat with our timely updates on games, player performances, trades, and everything else happening in the basketball world.
        
            👉Community Events: Be on the lookout for exciting events, contests, and challenges designed to bring our community together and celebrate our shared love for basketball.
        
        Feel free to explore all the features and resources available on our website. If you have any questions, feedback, or suggestions, don't hesitate to reach out to our support team at hoopers@gmail.com.
        
        Once again, welcome to Hoopers! We're thrilled to have you on board and can't wait to share the excitement of the game with you.
        
        Best regards,
        
        
        The Hoopers team`;

        sendMail(mail, subject, message);
        res.render("login");
      }
    });
  });
});

//get user from DB for login
const getUser = (user) => {
  return new Promise((resolve, reject) => {
    // Use connection pool to query data
    connection.getConnection((err, conn) => {
      if (err) {
        console.error("Error acquiring connection from pool:", err);
        res.status(500).send("Error acquiring connection from pool");
        return;
      }
      const query = "SELECT * FROM signup_user WHERE user = ?";
      conn.query(query, [user], (err, results) => {
        conn.release();
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  });
};

// Login form
app.post("/log", async (req, res) => {
  const { username, password } = req.body;
  console.log("Received username and password:", username, password);

  try {
    const user = await getUser(username);
    console.log("Retrieved user from database:", user);

    if (!user) {
      console.log("User not found in database");
      req.flash("error", "Invalid username or password");
      return res.render("login");
    }

    console.log("User's hashed password:", user.pass);

    const isPasswordValid = await bcrypt.compare(password, user.pass);

    if (isPasswordValid) {
      console.log("Password is valid. Logging in user:", username);
      req.session.user = user;
      return res.redirect("main");
    } else {
      console.log("Password is invalid");
      req.flash("error", "Invalid username or password");
      return res.render("login");
    }
  } catch (error) {
    console.error("Error:", error.message);
    req.flash("error", "An error occurred");
    return res.render("login");
  }
});

// Route to add details in feeds form
app.get("/feeds", (req, res) => {
  // Use connection pool to query data
  connection.getConnection((err, conn) => {
    if (err) {
      console.error("Error acquiring connection from pool:", err);
      res.status(500).send("Error acquiring connection from pool");
      return;
    }
    // Fetch data from the database
    const sql = "SELECT * FROM feeds";
    conn.query(sql, (err, results) => {
      conn.release();
      if (err) {
        console.error("Error executing query", err);
        return res.status(500).send("Error fetching data from database");
      }
      // Render the EJS template and pass the fetched data to it
      res.render("feeds", { feeds: results });
    });
  });
});

// Route for fetch from the database feeds Form
app.post("/feedForm", feed.single("fphoto"), async (req, res) => {
  const fphoto = req.file.filename; // Get the filename of the uploaded file
  const { head, content } = req.body;
  console.log(fphoto + " : " + head + " : " + content);

  // Now you can use fphoto, head, and content in your database query

  connection.getConnection((err, conn) => {
    if (err) {
      console.error("Error acquiring connection from pool:", err);
      res.status(500).send("Error acquiring connection from pool");
      return;
    }

    const fsql = "INSERT INTO feeds (fphoto, fhead, fwrite) VALUES (?, ?, ?)";
    conn.query(fsql, [fphoto, head, content], (err, results) => {
      conn.release();
      if (err) {
        console.error("Error executing query", err);
        return res.status(500).send("Error saving event to database");
      }
      res.status(200).redirect("feeds");
    });
  });
});

//creating order for buyer
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // amount in paise
    currency: "INR",
  };

  try {
    // Create Razorpay order
    const order = await razorpay.orders.create(options);
    // Send email receipt
    // await sendEmailReceipt(name, email, amount);

    // Respond with the Razorpay order details
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//port number setup
const PORT = process.env.PORT || 8000;
// Close the connection pool when the server is shutting down
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Event handler for when the server is shutting down
server.on("close", () => {
  // Close the connection pool
  pool.end((err) => {
    if (err) {
      console.error("Error closing connection pool:", err);
      return;
    }
    console.log("Connection pool closed.");
  });
});
