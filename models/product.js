const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getWorkfrontData = cb => {
  fetch('https://ibmixpartnersandbox.my.workfront.com/attask/api/v14.0/task/search', {
    method: 'GET',
    headers: {
      'apiKey': 'lzyv89t09muc95gn6qaackmgr7u6ojzu',
    }
  })
  .then(response => response.json())
  .then(data => {
    cb(JSON.parse(JSON.stringify(data.data)));
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Mail {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getWorkfrontData(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
