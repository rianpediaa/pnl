const express = require('express');
const cors = require('cors');
const  {
  cekUserClaim,
  addClaim,
  newToken,
  getToken
} = require('./lib/token');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const secretKey = 'gilangf3000';

app.use(cors());
app.use(express.json());

app.get('/api/reset',async (req, res) => {
  const result = await newToken()
  res.json(result)
})

app.post('/api/token/get',async (req, res) => {
  const baseUrl = 'https://panel.cyclic.app/'
  const LinkApi = 'https://semawur.com/st/?api=0e0289e29b1516500e810b11cae46a1bafef9059&url='
  try {
    const result = getToken()
    res.json({
      status: 1,
      result: LinkApi + baseUrl + result.path
    })
  } catch (err) {
    res.json({
      status: 0,
      message: 'Terjadi Kesalahan!'
    })
  }
})

app.post('/api/claim/check', async (req, res) => {
  const id = req.query.id
  if (!id) return res.json({
    status: 0,
    message: 'Masukan parameter id!'
  })
  try {
    const check = await cekUserClaim(id)
    if (check.isClaimed === false) {
      res.json({
        status: 1,
        msg: 'User Belum Claim!'
      })
    } else {
      res.json({
          status: 1,
          msg: 'User Sudah Claim!'
      })
    }
  } catch (err) {
    res.json({
      status: 0,
      message: 'Terjadi Kesalahan!'
    })
  }
})

app.post('/api/claim', async (req, res) => {
  const id = req.query.id
  if (!id) return res.json({
    status: 0,
    message: 'Masukan parameter id!'
  })
  const token = req.query.token
  if (!token) return res.json({
    status: 0,
    message: 'Masukan parameter token!'
  })
  try {
    const check = await cekUserClaim(id)
    if (check.isClaimed === false) {
      const resp = await getToken()
      if (resp.token === token) {
         await addClaim(id)
         res.json({
          status: 1,
           msg: 'User Berhasil Claim!'
         })
       } else {
         res.json({
           status: 0,
           message: 'Token Is Expired!'
         })
       }
    } else {
      res.json({
          status: 1,
          msg: 'User Sudah Pernah Claim!'
      })
    }
  } catch (err) {
    res.json({
      status: 0,
      message: 'Terjadi Kesalahan!' + err.message
    })
  }
})

app.get('/:path', async (req, res) => {
  try {
    const result = await getToken()
    if (result.path === req.params.path){
      res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      color: #495057;
    }

    input {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
      border: 1px solid #ced4da;
      border-radius: 4px;
      background-color: #f8f9fa;
      color: #495057;
      cursor: not-allowed;
    }

    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  </style>
  <title>Token - ${result.path}</title>
</head>
<body>
  <div class="container">
    <form>
      <div class="form-group">
        <label for="judul">Token</label>
        <input type="text" id="judul" value="${result.token}" readonly>
      </div>
      <button type="button" onclick="copyText()">Salin Text</button>
    </form>
  </div>

  <script>
    function copyText() {
      var textToCopy = document.getElementById("judul");
      textToCopy.select();
      document.execCommand("copy");
    }
  </script>
</body>
</html>
`)
    } else {
      res.json({
        status: 0,
        message: 'Path tidak tersedia!'
      })
    }
  } catch (err) {
    res.json({
      status: 0,
      message: 'Terjadi Kesalahan!'
    })
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
