<?php
    
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=utf-8");

    $response = array();

    $host = 'localhost';
    $user = 'root';
    $pass = 'admin';
    $db = 'pomiary';

    if(isset($_POST['temp']) && isset($_POST['wilg']))
    {
        $temp = addslashes($_POST['temp']);
        $wilg = addslashes($_POST['wilg']);
    
        try
        {
        $baza = new PDO('mysql:host='.$host.';dbname='.$db.';charset=utf8', $user, $pass, array(
            PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

            $zapytanie1=$baza->prepare("INSERT INTO dht22 (temp, wilg) VALUES (:temp, :wilg)");

            $zapytanie1->bindValue(':temp',  $temp, PDO::PARAM_INT);
            $zapytanie1->bindValue(':wilg',  $wilg, PDO::PARAM_INT);

            $zapytanie1->execute();
        }
        catch(PDOException $err)
        {
            exit('Blad polaczenia z baza danych: '.$err->getMessage());
        }

        if($zapytanie1)
        {
            $response["success"] = 1;
            $response["message"] = "Pomyslnie dodano wartosci z czujnika DHT22 do bazy danych";
            echo json_encode($response);
        }
        else 
        {
            $response["success"] = 0;
            $response["message"] = "Blad dodawania wartosci z czujnika DHT do bazy danych";
            echo json_encode($response);
        }
    }

    else if(isset($_POST['pm10']) && isset($_POST['pm25']))
    {
        $pm10 = addslashes($_POST['pm10']);
        $pm25 = addslashes($_POST['pm25']);
    
        try
        {
        $baza = new PDO('mysql:host='.$host.';dbname='.$db.';charset=utf8', $user, $pass, array(
            PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

            $zapytanie2=$baza->prepare("INSERT INTO pms7003 (pm10, pm25) VALUES (:pm10, :pm25)");

            $zapytanie2->bindValue(':pm10',  $pm10, PDO::PARAM_INT);
            $zapytanie2->bindValue(':pm25',  $pm25, PDO::PARAM_INT);

            $zapytanie2->execute();
        }
        catch(PDOException $err)
        {
            exit('Blad polaczenia z baza danych: '.$err->getMessage());
        }

        if($zapytanie2)
        {
            $response["success"] = 1;
            $response["message"] = "Pomyslnie dodano wartosci z czujnika PMS do bazy danych";
            echo json_encode($response);
        }
        else 
        {
            $response["success"] = 0;
            $response["message"] = "Blad dodawania wartosci z czujnika PMS do bazy danych";
            echo json_encode($response);
        }
    }

    else 
    {
        $response["success"] = 0;
        $response["message"] = "Brak parametrow";
        echo json_encode($response);
    }

?>