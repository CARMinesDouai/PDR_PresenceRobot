$(document).on('ready',function(){

	//--------------------------//
	// Définition des variables //
	//--------------------------//
	host = location.hostname;
	div_map = $('#div_map');
	div_cam_haut = $('#div_cam_haut');
	div_cam_bas = $('#div_cam_bas');
	nav_map = $('#nav_map');
	nav_cam_haut = $('#nav_cam_haut');
	nav_cam_bas = $('#nav_cam_bas');
	nav_cam = $('#nav_cam');
	dest = {};


	//-------------------------------//
	// Initialisation de l'affichage //
	//-------------------------------//
	div_cam_haut.append('<video src="http://'+host+'/realqt.mov" class="main_view">');	
	div_cam_bas.append('<img src="http://'+host+':90/mjpg/video.mjpg" class="main_view">');
	div_cam_haut.addClass('hidden');
	div_cam_bas.addClass('hidden');


	//---------------------------------//
	// Bind des controles de la navbar //
	//---------------------------------//
	nav_map.on('click', function (event){
		// En cas de click sur l'onglet carte

		// Masque
		div_cam_haut.addClass('hidden');
		nav_cam_haut.parent().removeClass('active');
		div_cam_bas.addClass('hidden');
		nav_cam_bas.parent().removeClass('active');
		nav_cam.removeClass('active');

		// Affiche
		div_map.removeClass('hidden');
		nav_map.parent().addClass('active');
	});


	nav_cam_haut.on('click', function (event){
		// En cas de click sur l'onglet caméra du haut

		// Masque
		div_cam_bas.addClass('hidden');
		nav_cam_bas.parent().removeClass('active');
		div_map.addClass('hidden');
		nav_map.parent().removeClass('active');
		nav_cam.addClass('active');

		// Affiche
		div_cam_haut.removeClass('hidden');
		nav_cam_haut.parent().addClass('active');
	});


	nav_cam_bas.on('click', function (event){
		// En cas de click sur l'onglet caméra du bas

		// Masque
		div_cam_haut.addClass('hidden');
		nav_cam_haut.parent().removeClass('active');
		div_map.addClass('hidden');
		nav_map.parent().removeClass('active');
		nav_cam.addClass('active');

		// Affiche
		div_cam_bas.removeClass('hidden');
		nav_cam_bas.parent().addClass('active');
	});


	//-------------------------------------------//
	// Récupération de la liste des destinations //
	//-------------------------------------------//
	$.ajax({
		url : 'destination.json',
		type : 'GET',
		dataType: 'json',
		success : function(Jdest){
			dest = Jdest;
			affiche_destination(dest, $('#dest'));
		}
	});
	function affiche_destination(dest, node){
		node.html('');
		html = '<table id="list_dest">'
		for( i = 0; i < dest.length; i++){
			html += '<tr><td id="'+i+'" class="a_dest">'+dest[i].nom+'</td></tr>';
		}
		html += '</table>';
		node.html(html);
		bind_destinations();
	}


	//----------------------------------//
	// Bind des boutons de destinations //
	//----------------------------------//
	function bind_destinations(){
		$('.a_dest').off();
		$('.a_dest').on('click', function(event){
			var id = parseInt(event.target.id);
			setGoal(dest[id].pose);
		});
	}


	//-----------------//
	// Connexion à ROS //
	//-----------------//
	ros = new ROSLIB.Ros({url : 'ws://'+host+':9090'});
	ros.on('connection', function() { console.log('Connected to websocket server.'); });
	ros.on('error', function(error) { console.log('Error connecting to websocket server: ', error); });
	ros.on('close', function() { console.log('Connection to websocket server closed.'); });


	//----------------------------//
	// Initialisation de la carte //
	//----------------------------//
	map1 = new Map({
		ros : ros,
		continuous : true,
		showPath : true,
		divId: "map"
	});


	//--------------------------//
	// Définition de l'objectif //
	//--------------------------//
	function setGoal(pose){
		var actionClient = new ROSLIB.ActionClient({
			ros : ros,
			actionName : 'move_base_msgs/MoveBaseAction',
			serverName : '/move_base'
		});
		var goal = new ROSLIB.Goal({
			actionClient : actionClient,
			goalMessage : {
				target_pose : {
					header : { frame_id : '/map' },
					pose : pose
				}
			}
		});
		goal.send();
		map1.showTrajectory();
	}


	//---------------------------------//
	// Bind des boutons de déplacement //
	//---------------------------------//
	function bind_bts(){
		$('#bt_left').on('click', function(event){
			map1.viewer.shift(-2,0);
		});
		$('#bt_right').on('click', function(event){
			map1.viewer.shift(2,0);
		});
		$('#bt_top').on('click', function(event){
			map1.viewer.shift(0,2);
		});
		$('#bt_bottom').on('click', function(event){
			map1.viewer.shift(0,-2);
		});
	}
	bind_bts();

});