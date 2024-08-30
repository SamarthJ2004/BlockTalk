const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

//mongo
const URL = "mongodb+srv://anushka:anushkas@cluster0.w2aa386.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(URL)
  .then(() => {
    console.log("You are connected to MongoDB");
  })
  .catch((err) => {
    console.error("Oops!! Some error occurred: ", err);
  });

const AccountSchema = new mongoose.Schema({
  account: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now }
});
const AccountModel = mongoose.model('Account', AccountSchema);

const BookmarkSchema = new mongoose.Schema({
  acc: { type: String, required: true },
  tweetId: { type: String, required: true }
});
const BookmarkModel = mongoose.model('Bookmark', BookmarkSchema);

app.get('/api/data', (req, res) => {
  res.json({ message: 'CORS is enabled!' });
});

app.post('/api/account', (req, res) => {
  const { account } = req.body;

  if (!account) return res.status(400).json({ message: 'Account is required' });

  const newAccount = new AccountModel({ account });

  newAccount.save()
    .then(data => {
      res.status(201).json({ message: 'Account saved successfully', data });
    })
    .catch(err => {
      if (err.code === 11000) {
        res.status(400).json({ message: 'Account already exists' });
        console.log('Account already exits!!!');
      } else {
        res.status(500).json({ message: 'Error saving account', error: err });
        console.error('Error saving account:', err);
      }
    });
});

app.get('/communities', async (req, res) => {
  try {
    console.log("Fetching communities...");
    res.setHeader('Content-Type', 'application/json');
    const data = await AccountModel.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/bookmarks', async (req, res) => {
  const { account } = req.body;
  console.log('This is the account i got: ', account);
  try {
    console.log("Fetching bookmarks...");
    res.setHeader('Content-Type', 'application/json');
    const data = await BookmarkModel.find().select('-__v');
    res.json(data);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/bookmarks', async (req, res) => {
  const { tweetId, acc } = req.body;

  if (!tweetId || !acc) {
    return res.status(400).json({ message: 'tweetId and account are required' });
  }

  try {
    const existingBookmark = await BookmarkModel.findOne({ tweetId, acc });

    if (existingBookmark) {
      return res.status(400).json({ message: 'Bookmark already exists for this account' });
    }
    const bookmark = new BookmarkModel({ tweetId, acc });
    await bookmark.save();
    res.status(201).json({ message: 'Bookmark saved successfully', bookmark });
  } catch (error) {
    console.error('Error saving bookmark:', error);
    res.status(500).json({ message: 'Error saving bookmark', error });
  }
});

app.listen(3011, () => {
  console.log('Server is running on port 3011');
});