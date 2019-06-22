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

        $zapytanie=$baza->prepare("SELECT * FROM dht22 ORDER BY id DESC LIMIT 1");
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
            echo '<h4><span class="badge badge-dark">'.$row['wilg'].' %</span></h4>'; 
        }
    }
    else 
    {
        echo "Blad odczytywania wartosci z bazy danych";
    }
?>