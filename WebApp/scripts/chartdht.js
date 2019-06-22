$(function () {
  rysujWykres1();
  setInterval(function () {
    rysujWykres1();
  }, 60000);
});

function rysujWykres1() {
  $.ajax({
    url: 'http://localhost/readdht.php',
    type: 'GET',
    success: function (data) {
      console.log(data);

      var dhtId = []; //numer pomiaru (zamienic potem na godzine)
      var dhtTemp = []; //temperatura
      var dhtWilg = []; //wilgotnosc

      data.reverse();
      for (var i in data) {
        dhtId.push((data[i].data_pomiaru).slice(11, 16));
        dhtTemp.push(data[i].temp)
        dhtWilg.push(data[i].wilg)
      }

      var chartdata = {
        labels: dhtId,
        datasets: [{
            label: "Temperatura [°C]",
            fill: false,
            lineTension: 0.3,
            backgroundColor: "rgba(255, 50, 0, 0.75)",
            borderColor: "rgba(255, 50, 0, 1)",
            pointHoverBackgroundColor: "rgba(255, 50, 0, 1)",
            pointHoverBorderColor: "rgba(255, 50, 0, 1)",
            data: dhtTemp
          },
          {
            label: "Wilgotność [%]",
            fill: false,
            lineTension: 0.3,
            backgroundColor: "rgba(0, 135, 255, 0.75)",
            borderColor: "rgba(0, 135, 255, 1)",
            pointHoverBackgroundColor: "rgba(0, 135, 255, 1)",
            pointHoverBorderColor: "rgba(0, 135, 255, 1)",
            data: dhtWilg
          }
        ]
      };

      var ctx = $("#wykresdht");
      
      if(window.bardht != undefined)
        window.bardht.destroy();

      window.bardht = new Chart(ctx, {
        type: 'line',
        data: chartdata
      });
    },

    error: function (data) {}
  });
}
