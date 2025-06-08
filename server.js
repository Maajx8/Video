
const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('video'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = 'processed_' + req.file.originalname;

  const command = `ffmpeg -i ${inputPath} -vf "gblur=sigma=20,eq=contrast=1.5:brightness=0.05" -c:a copy ${outputPath}`;

  exec(command, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error processing video');
    }
    res.download(outputPath, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));
