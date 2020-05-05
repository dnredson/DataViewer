const fetch = require("node-fetch");
const getEntityById = async url => {

  const response = await fetch(url, {method: "GET",
                  headers: { "fiware-service": "openiot", "fiware-servicepath": "/"}
      });
      const json = await response.json();
      return json;
     
    }
  

    function getEntity (pilots) {

if (pilots=='guaspari'){
  url = "http://177.104.61.48:2019/v0/SoilProbe";
}
      Promise.all([getEntityById(url)]).then(function(result1){
       var numberOfEntities = result1[0].length;
       
       var numberOfIndexes = result1[0][0].index.length;
       
      console.log(numberOfEntities);
      
       

      }).catch(err=>{console.log(err);})

      
    
   
  }

  getEntity('guaspari');

