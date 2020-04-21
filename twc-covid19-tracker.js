module.exports = function(RED) {
  function twcCovid19TrackerNode( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var units = n.units;
    var name = n.name;
    var locationtype = n.locationtype;
    var location= n.location;
    var territory=n.territory;
    var pwsConfigNode;
    var apiKey;
    var request = require('request-promise');

    // Retrieve the config node
    pwsConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = pwsConfigNode.credentials.apikey;

    if (!territory) {
      territory = 'country';
    }

    node.on('input', function (msg) {

      msg.twcparams = msg.twcparams || {};

      if( typeof msg.twcparams.territory == 'undefined' ) {
        msg.twcparams.territory = territory; // take the default or the node setting
      } else {
        // passed in param, override default or node setting
        msg.twcparams.territory = msg.twcparams.territory.toLowerCase();
      }

      if( typeof msg.twcparams.location == 'undefined' ) {
        msg.twcparams.location = location;
      }

      if( typeof msg.twcparams.locationtype == 'undefined' ) {
        msg.twcparams.locationtype = locationtype;
      }

      request('https://api.weather.com/v3/wx/disease/tracker/'+msg.twcparams.territory+'/60day?'+ msg.twcparams.locationtype + '='+ msg.twcparams.location +'&format=json&apiKey='+apiKey)
        .then(function (response) {
          msg.payload = JSON.parse(response);
          node.send(msg);
        })
        .catch(function (error) {
          node.send(msg);
        });
    });
  }
  RED.nodes.registerType("twc-covid19-tracker",twcCovid19TrackerNode);
}
