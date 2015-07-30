<?php

if (!isset($_GET['file'])) { die("Please feed me a filename in 'file' parameter"); exit; }

if (strlen(trim($_GET['file']))==0) die("Empty filename");

else if (!file_exists($_GET['file'])) die("Could not open file '{$_GET['file']}'");

else { 

	  require('swfheader.class.php');
	  $video=new swfheader();
	  $thedim=str_replace('|','x',$video->getDimensions($_GET['file']));
	  echo json_encode($video);
	}
?>