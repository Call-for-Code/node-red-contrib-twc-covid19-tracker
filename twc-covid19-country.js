module.exports = function(RED) {
  // This API allows you to view the current state of a disease for a set of countries globally.
  // It provides information regarding active diseases including confirmed cases, deaths, and recoveries.
  function twcCovid19CountryNode( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var name = n.name;
    var covConfigNode;
    var apiKey;
    const got = require('got');

    // Retrieve the config node
    covConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = covConfigNode.credentials.apikey;

    node.on('input', function (msg) {
      (async () => {
        try {
          const response = await got('https://api.weather.com/v3/wx/disease/tracker/countryList/current?format=json&apiKey='+apiKey);
          // console.log(response.body);
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
  RED.nodes.registerType("twc-covid19-country-report",twcCovid19CountryNode);
}
