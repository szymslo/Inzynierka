<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=utf-8");

    $response = array();

    $host = 'localhost';
    $user = 'root';
    $pass = 'admin';
    $db = 'pomiary';

    try
    {
        $baza = new PDO('mysql:host='.$host.';dbname='.$db.';charset=utf8', $user, $pass, array(
            PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

        $zapytanie1=$baza->prepare("SELECT * FROM dht22 ORDER BY id DESC LIMIT 10");
        $zapytanie1->execute();

    }
    catch(PDOException $err)
    {
        exit('Blad polaczenia z baza danych: '.$err->getMessage());
    }

    if($zapytanie1)
    {
        while($row = $zapytanie1->fetch(PDO::FETCH_ASSOC))
        {
            $response[] = $row;
        }      
        print json_encode($response);
    }
    else 
    {
        $response["success"] = 0;
        $response["message"] = "Blad odczytywania wartosci z bazy danych";
        echo json_encode($response);
    }
?>