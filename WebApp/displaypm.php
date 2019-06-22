<?php
    
    header("Access-Control-Allow-Origin: *");

    $host = 'localhost';
    $user = 'root';
    $pass = 'admin';
    $db = 'pomiary';

    try
    {
        $baza = new PDO('mysql:host='.$host.';dbname='.$db.';charset=utf8', $user, $pass, array(
            PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

        $zapytanie=$baza->prepare("SELECT * FROM pms7003 ORDER BY id DESC LIMIT 1");
        $zapytanie->execute();
    }
    catch(PDOException $err)
    {
        exit('Blad polaczenia z baza danych: '.$err->getMessage());
    }

    if($zapytanie)
    {
        while($row = $zapytanie->fetch(PDO::FETCH_ASSOC))
        {
            echo '<h4><span class="badge badge-dark" id="pm10"><small>PM10:</small> '.$row['pm10'].' µg/m³</span></h4>';
            echo '<h4><span class="badge badge-dark" id="pm25"><small>PM2.5:</small> '.$row['pm25'].' µg/m³</span></h4>';              
        }
    }
    else 
    {
        echo "Blad odczytywania wartosci z bazy danych";
    }
?>