const express = require('express');
const router = express.Router();

let chatData = [
  {
    topic: "E'erybody loves chat rooms",
    comments: [
      {
        name: 'Jacob Church',
        message: 'FIRST!!!',
        timestamp: Date().substr(0,21),
        avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRRMVx2q8wbso3Ni9oF5tNedKJ0TvoRxYZ9LEosRKKfDy7iJaH',
        upvotes: 0
      },
      {
        name: 'Leroy Jenkins',
        message: 'Leeeeroooooooyy Jeeenkins!',
        timestamp: Date().substr(0,21),
        avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ8Bxh32mJuJCCyR2uN142jYeX-WrND61Y-UO4Ot6O1av8xtNn',
        upvotes: 0
      }
    ]
  },
  {
    topic: 'CS 260 tips',
    comments: [
      {
        name: 'Mystery person',
        message: 'Quit.',
        timestamp: Date().substr(0,21),
        avatarUrl: '',
        upvotes: 0
      }
    ]
  }
];
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: 'public' });
});

router.get('/chatData', function(req, res) {
  res.send(chatData);
});

router.post('/newThread', function(req,res) {
  chatData.push(req.body);
  res.send('{"success" : "Updated successfully", "status" : 200}')
})

router.post('/newComment', function(req,res) {
  let index = parseInt(req.query.i);
  chatData[index].comments.push(req.body);
  res.send('{"success" : "Updated successfully", "status" : 200}')
})

router.post('/upvote', function(req, res) {
  let thread = req.body.threadIndex;
  let comment = req.body.commentIndex;
  chatData[thread].comments[comment].upvotes++;
  res.send('{"success" : "Updated successfully", "status" : 200}')
})

module.exports = router;
