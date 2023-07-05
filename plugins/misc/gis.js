/**
 * Google Image Search
 * Thanks to Jibble330 (https://github.com/Jibble330) for this nice idea.
 */

const axios = require("axios");

module.exports = {
     gis: async (query, limit = 5) => {
    try {
    if (!query) throw new Error("You cannot have an empty query!");
    let urlsArray = [];
    const params = {
        q: query, 
        tbm: "isch",
        hl: "en",
        gl: "in",
        ijn: "0", 
    };
    const headers = {
      "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
      "Accept-Encoding": "application/json",
  };
  
    const res = await axios.get("https://www.google.com/search", { headers: headers, params: params });
    let body = res.data;
    body = body.slice(body.lastIndexOf("AF_initDataCallback"));
    body = body.slice(body.indexOf("["));
    body = body.slice(0, body.indexOf("</script>")-1);
    body = body.slice(0, body.lastIndexOf(","));
    
    const img = JSON.parse(body);

    const imgObjects = img[56][1][0][0][1][0];

    for (let i = 0; i < limit; i++) {
        if (imgObjects[i] && imgObjects[i][0][0]["444383007"][1]) {
            let url = imgObjects[i][0][0]["444383007"][1][3][0]; // the url
            urlsArray.push(url);
        }
    }
    return urlsArray;
} catch (error) {
    console.log("GIS error",error.message)    
    return []
}

},
pinSearch: async (query, limit = 5) => {
    try {
    if (!query) throw new Error("You cannot have an empty query!");
    let urlsArray = [];
    const params = {
        q: "pinterest "+query, 
        tbm: "isch",
        hl: "en",
        gl: "in",
        ijn: "0", 
    };
    const headers = {
      "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
      "Accept-Encoding": "application/json",
  };
  
    const res = await axios.get("https://www.google.com/search", { headers: headers, params: params });
    let body = res.data;
    body = body.slice(body.lastIndexOf("AF_initDataCallback"));
    body = body.slice(body.indexOf("["));
    body = body.slice(0, body.indexOf("</script>")-1);
    body = body.slice(0, body.lastIndexOf(","));
    
    const img = JSON.parse(body);

    const imgObjects = img[56][1][0][0][1][0];

    for (let i = 0; i < limit; i++) {
        if (imgObjects[i] && imgObjects[i][0][0]["444383007"][1]) {
            let url = imgObjects[i][0][0]["444383007"][1][3][0]; // the url
            if (url.includes('pinimg')) urlsArray.push(url);
        }
    }
    return urlsArray;
} catch (error) {
    console.log("GIS_PIN error",error.message)    
    return []
}

}
}