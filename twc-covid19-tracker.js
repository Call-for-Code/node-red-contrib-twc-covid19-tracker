module.exports = function(RED) {
  function covid19apikeyNode(n) {
    RED.nodes.createNode(this,n);
    var node = this;
    //node.apikey = n.apikey;
  }
  RED.nodes.registerType("covapikey", covid19apikeyNode, {
    credentials: {
      apikey: {type: "password"}
    }
  });

  function twcCovid19TrackerNode( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var name = n.name;
    var locationtype = n.locationtype;
    var location= n.location;
    var territory=n.territory;
    var covConfigNode;
    var apiKey;
    const got = require('got');

    // Retrieve the config node
    covConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = covConfigNode.credentials.apikey;

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

      (async () => {
        try {
          const response = await got('https://api.weather.com/v3/wx/disease/tracker/'+msg.twcparams.territory+'/60day?'+ msg.twcparams.locationtype + '='+ msg.twcparams.location +'&format=json&apiKey='+apiKey);
          // console.log(response.body)
          msg.payload = JSON.parse(response.body);
          node.send(msg);
        } catch (error) {
          // console.log(error.response.body);
          node.warn(error.response.body);
          node.send(msg);
        }
      })();
    });
  }
  RED.nodes.registerType("twc-covid19-tracker",twcCovid19TrackerNode);
}
