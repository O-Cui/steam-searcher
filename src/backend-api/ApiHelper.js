const request = require('request')

module.exports = {
    /*
    * A wrapper for the api requests
    * This method returns a promise
    * which gets resolved or rejected based
    * on the result from the API
    */
    make_API_call : function(url){
        //returns a promise, a temporary object that has methods for what to do after
        //the data has been retrieved (ie. what to do if error, and what to do if success)
        return new Promise((resolve, reject) => {
            request(url, { json: true }, (err, res, body) => {
              if (err) reject(err)
              return resolve(body)
            });
        })
    }
}