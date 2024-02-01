const fs = require('@cyclic.sh/s3fs')(process.env.S3_BUCKET_NAME)
const path = require('path');
const randomstring = require('randomstring'); // Perbaiki impor modul randomstring

function readJson(file) {
  try {
    const content = fs.readFileSync(path.join('db', file), 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return {
      status: 0,
      error_msg: `${err.message}!`
    };
  }
}

function cekUserClaim(claimedValue) {
  try {
    const json = readJson('token.json');
    const user = json.user_claim || [];

    // Check if claimedValue exists in user_claim array
    const isClaimed = user.includes(claimedValue);

    return {
      status: 1,
      isClaimed: isClaimed,
    }
  } catch (err) {
    return {
      status: 0,
      error_msg: `${err.message}!`,
    };
  }
}

function newToken() {
  try {
    const token = randomstring.generate(10); // Ganti menjadi randomstring.generate
    const tokenPath = randomstring.generate(5); // Ganti menjadi randomstring.generate
    const json = readJson('token.json');
    json.token = token;
    json.path = tokenPath; // Ganti menjadi tokenPath
    json.user_claim = [];
    fs.writeFileSync(path.join('db', 'token.json'), JSON.stringify(json), 'utf8');
    return json;
  } catch (err) {
    return {
      status: 0,
      error_msg: `${err.message}!`
    };
  }
}

function addClaim(newClaim) {
  try {
    const json = readJson('token.json');
    const user = json.user_claim || [];
    
    user.push(newClaim);
    json.user_claim = user;
    
    fs.writeFileSync(path.join('db', 'token.json'), JSON.stringify(json), 'utf8');
    return json;
  } catch (err) {
    return {
      status: 0,
      error_msg: `${err.message}!`
    };
  }
}

function getToken() {
  try {
    const json = readJson('token.json');
    // json.user_path = json.user_claim; // Ganti menjadi user_path
    
    // fs.writeFileSync(path.join('db', 'token.json'), JSON.stringify(json), 'utf8');
    return json
  } catch (err) {
    return {
      status: 0,
      error_msg: `${err.message}!`
    };
  }
}

module.exports = {
  cekUserClaim,
  addClaim,
  newToken,
  getToken
};

// Usage example:
// const newClaim = 20383938; // Example number
// const result = newToken();
// console.log(result);