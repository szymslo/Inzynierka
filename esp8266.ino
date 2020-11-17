#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <pms.h>
#include "DHT.h"

#define DHTPIN 0 //numer pinu do jakiego został podłączony czujnik dht
#define DHTTYPE DHT22 //typ czujnika dht

DHT dht(DHTPIN, DHTTYPE); //obiekt na czujnik dht
Pmsx003 pms(5, 4); //obiekt na czujnik pms

//nazwa sieci wifi i hasło
const char* nazwa = "*****";
const char* haslo = "*****";

//serwer na który będą wysyłane dane (localhost)
const char *host = "*****";

void setup()
{
  Serial.begin(9600); //otwarcie portu szeregowego i ustawienie prędkości
  WiFi.mode(WIFI_STA); //układ niewidoczny jako acces point
  WiFi.begin(nazwa, haslo); //połączenie z siecią wifi

  //oczekiwanie na połączenie z siecią
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  //wyświetlenie nazwy sieci oraz adresu ip przydzielonego esp8266
  Serial.println("");
  Serial.print("Połączono z ");
  Serial.println(nazwa);
  Serial.print("Adres IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  dht.begin(); //inicjalizacja czujnika dht

  //inicjalizacja i ustawienie parametrów czujnika pms
  pms.begin();
  pms.waitForData(Pmsx003::wakeupTime);
  pms.write(Pmsx003::cmdModeActive);
}

auto lastRead = millis(); //czas oczekiwania na dane z czujnika pms [ms]
size_t count = 0; //licznik odczytów z dht

void loop()
{
  //zmienne służące do wysłania danych pomiarowych na serwer
  HTTPClient http;
  String dhtPost;
  String pmsPost;
  
  //tablica na dane z czujnika pms
  const auto n = Pmsx003::Reserved;
  Pmsx003::pmsData data[n];
  
  while(count<1)
  {
    float temp = dht.readTemperature(); //odczyt temperatury
    float wilg = dht.readHumidity(); //odczyt wilgotnosci

    //sprawdzenie czy poprawnie odczytano wartości z czujnika dht
    if (isnan(temp) || isnan(wilg)) // "is not number"
    {
      Serial.print(".");
    }
    else 
    {
      //wyświetlenie wyników
      Serial.println();
      Serial.print("Temperatura: ");
      Serial.print(temp);
      Serial.print("*C ");
      Serial.print("Wilgotność: ");
      Serial.print(wilg);
      Serial.println("% ");
      Serial.println();

      //wysyłanie wartości na serwer
      dhtPost = "temp=" + String(temp) + "&wilg=" + String(wilg);
      http.begin("http://192.168.0.18/add.php");
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      int httpCode = http.POST(dhtPost);
      String payload = http.getString();
      http.end();
      
      count++;
    }
  }
  
  Pmsx003::PmsStatus status = pms.read(data, n); //odczyt danych z czujnika pms do tablicy

  //sprawdzenie czy poprawnie odczytano wartości z czujnika pms
  switch (status) 
  {
    case Pmsx003::OK: //dane poprawne
    {
      auto newRead = millis();
      Serial.println();
      Serial.print("Czas oczekiwania [ms]: ");
      Serial.println(newRead - lastRead);
      lastRead = newRead;

      for (size_t i = Pmsx003::PM1dot0; i < n; ++i) //wyświetlenie zawartości tablicy z danymi 
      { 
        Serial.print(data[i]);
        Serial.print("\t");
        Serial.print(Pmsx003::dataNames[i]);
        Serial.print(" [");
        Serial.print(Pmsx003::metrics[i]);
        Serial.print("]");
        Serial.println();    
      }

      //wysyłanie wartości na serwer
      pmsPost = "pm10=" + String(data[5]) + "&pm25=" + String(data[4]);
      http.begin("http://192.168.0.18/add.php");
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      int httpCode = http.POST(pmsPost);
      String payload = http.getString();
      http.end();

      delay(60000);
      count=0;
      break;
    }
    
    case Pmsx003::noData: //brak danych
      break;
  
    default: //oczekiwanie na pełne dane
      Serial.print(".");
      break;
  };
}
