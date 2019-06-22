$(function () {
  rysujWykres2();
  setInterval(function () {
    const context = canvas.getContext('wykrespms');
    context.clearRect(0, 0, canvas.width, canvas.height);
    rysujWykres2();
  }, 60000);
});

function rysujWykres2() {
  $.ajax({
    url: 'http://localhost/readpms.php',
    type: 'GET',
    success: function (data) {
      console.log(data);

      var pmsId = []; //numer pomiaru (zamienic potem na godzine)
      var pmsPm10 = []; //temperatura
      var pmsPm25 = []; //wilgotnosc

      data.reverse();
      for (var i in data) {
        pmsId.push((data[i].data_pomiaru).slice(11, 16));
        pmsPm10.push(data[i].pm10)
        pmsPm25.push(data[i].pm25)
      }

      var chartdata = {
        labels: pmsId,
        datasets: [{
            label: "PM10 [µg/m³]",
            fill: false,
            lineTension: 0.3,
            backgroundColor: "rgba(40, 40, 42, 0.75)",
            borderColor: "rgba(40, 40, 42, 1)",
            pointHoverBackgroundColor: "40, 40, 42, 1)",
            pointHoverBorderColor: "40, 40, 42, 1)",
            data: pmsPm10
          },
          {
            label: "PM2.5 [µg/m³]",
            fill: false,
            lineTension: 0.3,
            backgroundColor: "rgba(150, 150, 154, 0.75)",
            borderColor: "rgba(150, 150, 154, 1)",
            pointHoverBackgroundColor: "rgba(150, 150, 154, 1)",
            pointHoverBorderColor: "rgba(150, 150, 154, 1)",
            data: pmsPm25
          }
        ]
      };

      var ctx = $("#wykrespms");

      if(window.barpms != undefined)
        window.barpms.destroy();

      window.barpms = new Chart(ctx, {
        type: 'line',
        data: chartdata
      });
    },

    error: function (data) {}
  });
}