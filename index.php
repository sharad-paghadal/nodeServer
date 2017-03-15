<html>
	<head>
		<meta charset="utf-8" />
		<meta content="width=device-width, initial-scale=1.0" name="viewport">
		
		<title>NodeJS + PHP</title>
	</head>

	<body>
			<ul id="messages">
			</ul>
		
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" ></script>
		<script src="node_modules/socket.io-client/dist/socket.io.js"></script>

		<script type="text/javascript">
			var socket = io.connect( 'http://localhost:8088' );

			socket.on( 'message', function( data ) {
				var actualContent = $( "#messages" ).html();
				var newMsgContent = '<li> <strong>' + data.name + '</strong> : ' + data.message + '</li>';
				var content = newMsgContent + actualContent;
				
				$( "#messages" ).html( content );
			});
		</script>
	</body>
</html>