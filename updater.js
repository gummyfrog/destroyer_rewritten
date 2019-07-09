var axios = require('axios')

class Updater {
  
  constructor(opt = {}) {
    this.settings = Object.assign({name: "Unnamed Source", desc: "Undescribed Source"}, opt);
    
    this.name = this.settings.name;
    this.desc = this.settings.desc;
    this.dateOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" }
  };

  post(obj) {
    var date = new Date();
    var postObj = {};
    obj['desc'] = this.desc;
    obj['last'] = date.toLocaleString('en-US', this.dateOptions)
    postObj[this.name] = obj;
    return axios.post('http://frogeye.duckdns.org:8282/status', postObj, { "headers": {"password": process.env.PASSWORD}});
  };

  quote(obj) {
    console.log('communicating with server');
    return axios.post('http://frogeye.duckdns.org:8282/quote', obj, { "headers": {"password": process.env.PASSWORD}});
  }

  download(url,filename) {
    return axios.post('http://frogeye.duckdns.org:8282/download', {url: url, filename: filename}, { "headers": {"password": process.env.PASSWORD}});
  }

  get() {
    return new Promise((resolve, reject) => {
      axios.get('http://frogeye.duckdns.org:8282/status')
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
    });
  }
};

module.exports = Updater;

