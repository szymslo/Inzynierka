$(function () {
    displayData();
    setInterval(function () {
        displayData();    
    }, 30000);
});

function displayData() {
    $("#pm").load("displaypm.php", function(result1) {
        $("#temp").load("displaytemp.php", function(result2) {
            $("#wilg").load("displaywilg.php", function(result3) {
                calculateQuality(); 
            });
        });
    });
}

function calculateQuality() {

    let temp = $('#pm10').text();
    pm10 = temp.slice(5, 8);

    let norma = (parseFloat(pm10) / 50) * 100;
    $("#norma").text(norma + "%");

    //  do 50% normy
    if (pm10 <= 25) {
        $('div.container-fluid').attr('class', 'container-fluid rounded-top bg-success');
        $("#jakosc").text("Jakość powietrza: Bardzo Dobra");
    }

    //  do 100% normy
    else if (25 < pm10 <= 50) {
        $('div.container-fluid').attr('class', 'container-fluid rounded-top');
        $("#tlo").css('background-color', 'rgb(170, 240, 20)');
        $("#jakosc").text("Jakość powietrza: Dobra");
    }

    // 100%-300% normy
    else if (50 < pm10 <= 150) {
        $('div.container-fluid').attr('class', 'container-fluid rounded-top bg-warning');
        $("#jakosc").text("Jakość powietrza: Średnia");
    }

    // 300%-500% normy
    else if (150 < pm10 <= 250) {
        $('div.container-fluid').attr('class', 'container-fluid rounded-top bg-danger');
        $("#jakosc").text("Jakość powietrza: Zła");
    }

    // ponad 500% normy
    else if (pm10 > 250) {
        $('div.container-fluid').attr('class', 'container-fluid rounded-top');
        $("#tlo").css('background-color', 'rgb(120, 22, 90)');
        $("#jakosc").text("Jakość powietrza: Bardzo Zła");
    }
}

    //setTimeout(function () {
    //    calculateQuality();
    //}, 50);