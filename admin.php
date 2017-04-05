<html>
	<head>
		<meta charset="utf-8" />
		<meta content="width=device-width, initial-scale=1.0" name="viewport">
		
		<title>NodeJS + PHP</title>
	</head>

	<body>
		<form>
			<input type="text" id="text" name="mail"><br>
			<input type="button" id="submit" name="submit" value="Submit">
		</form>
			
		
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" ></script>
		<script src="node_modules/socket.io-client/dist/socket.io.js"></script>

		<script type="text/javascript">
			var socket = io.connect( 'http://localhost:8088' );

			$(function(){
                $('#submit').click(function(){ /*listening to the button click using Jquery listener*/
                    var data = { /*creating a Js ojbect to be sent to the server*/ 
                        message:$('#text').val(), /*getting the text input data      */
                        author:'Sharad'                
                    }
                    socket.send(JSON.stringify(data));
                    $('#text').val('');
                });
            });
		</script>
	</body>
</html>