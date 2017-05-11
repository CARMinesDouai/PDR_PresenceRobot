//---------------------------//
// Paramètres du serveur Web //
//---------------------------//
var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs")
	port = process.argv[2] || 8080;


//-------------------------//
// Création du Serveur Web //
//-------------------------//
http.createServer(function(request, response) {

	var uri = url.parse(request.url).pathname,
		filename = path.join(process.cwd(), uri);

	var contentTypesByExtension = {
		'.html': "text/html",
		'.css':  "text/css",
		'.js':   "text/javascript"
	};


	//--------------------------------------------//
	// Recherche le fichier et renvoie la réponse //
	//--------------------------------------------//
	fs.exists(filename, function(exists) {
		if(!exists) {
			// Fichier introuvable
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
			return;
		}

		if (fs.statSync(filename).isDirectory()){
			// S'il s'agit d'un dossier on lit le fichier index de ce dossier
			filename += '/index.html';
		}

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				// En cas d'erreur sur la lecture du fichier
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				return;
			}

			// Génère le header
			var headers = {};
			var contentType = contentTypesByExtension[path.extname(filename)];
			if (contentType){
				headers["Content-Type"] = contentType;
			}
			response.writeHead(200, headers);

			// Renvoie le contenu
			response.write(file, "binary");
			response.end();
		});
	});
}).listen(parseInt(port, 10));

console.log("Server listening on http://localhost:" + port);