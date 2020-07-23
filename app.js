const http = require('http');
const url = require('url');
const fs = require('fs');
const { parse } = require('querystring')
var username = "";

const server = http.createServer((req, res) => {

    
    let parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.path.replace(/^\/+|\/+$/g, "");

    if(req.method === 'GET'){
        if(path === ""){
            path = "index.html";
        }else if(path === "script"){
            path = "script.js";
        }else if(path === 'style'){
            path = "style.css";
        }
    }else{
        path += '.html'
        username = collectRequestData(req, result => {
            // console.log(result);
            // console.log(`Parsed data belonging to ${result.name}`);
            username = result.name;
        });
    }
    // console.log(`Requested path: ${path}`);
    let file = __dirname + '/Versions/V4/' + path;

    fs.readFile(file, (error, content) => {

        if(error){
            console.log(`File not Found: ${file}`);
            res.writeHead(404);
            res.end();
        }else{

            // console.log(`Return file ${path}`);

            //Specify the content-type in the response
            res.setHeader('X-Content-Type-Options', "nosniff");

            switch(path){
                case "style.css": 
                    res.writeHead(200, {'Content-Type':'text/css'});
                    break;
                case "script.js":
                    res.writeHead(200, {'Content-Type':'application/javascript'});
                    break;
                case "grid.html":
                case "index.html":
                    res.writeHead(200, {'Content-Type': 'text/html'})
            }
            res.end(content);
        }
    });
});

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            let temp = callback(parse(body));
           
            return temp;
        });
    }
    else {
        callback(null);
        return null;
    }
}


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
});






















// const mimeLookup = {
//     '.js': 'application/javascript',
//     '.html': 'text/html',
//     '.css' : 'text/css'
//   };
// const server = http.createServer((req, res) => {

//     let fileUrl = './V4/views/';
//     switch(req.url){
//         case '/': 
//                 fileUrl += 'index.html'; 
//                 res.statusCode =200;
//                 break;
//         case '/grid': 
//                     fileUrl += 'grid.html'; 
//                     res.statusCode = 200;
//                     break;
//         default : 
//                 res.statusCode = 404;
//                 fileUrl += '404.html';
//     }

//      // Extracting file extension to use diff content-type
//      let filepath = path.resolve('./' + fileUrl);

//      let fileExt = path.extname(filepath);
//      let mimeType = mimeLookup[fileExt];

//      console.log(filepath)
//       //Setting header content type
//     res.setHeader('Content-Type', mimeType);
     

//     fs.readFile(fileUrl, (err, data) => {
//         if(err){
//             console.log(err);
//         }else{
//             res.write(data);
//         }
//         res.end();
//     });
// });