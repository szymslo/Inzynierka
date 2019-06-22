$(function () {
    pokazZegar();
    setInterval(function () {
        pokazZegar();
    }, 1000);
});

function dodajZero(i) {
    if (i < 10) return '0' + i;
    else return i;
}

function pokazZegar() {
    let data = new Date();
    let godzina = data.getHours();
    let minuta = data.getMinutes();
    let sekunda = data.getSeconds();
    let dzienTygodnia = data.getDay();
    let dzien = data.getDate();
    let miesiac = data.getMonth();
    let rok = data.getFullYear();

    let dni = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    let miesiace = ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia"];


    $("#data").text(dni[dzienTygodnia] + ", " + dzien + " " + miesiace[miesiac] + " " + rok);
    $("#czas").text(dodajZero(godzina) + ":" + dodajZero(minuta) + ":" + dodajZero(sekunda));
}