#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>
#include <RTClib.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// --- SENSOR DEFINITIONS ---
#define DHTPIN 4
#define DHTTYPE DHT22
#define MQ2_PIN 34
#define LDR_PIN 35
#define TRIG_PIN 26
#define ECHO_PIN 27

// --- OBJECT INITIALIZATION ---
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);
RTC_DS3231 rtc;
Adafruit_MPU6050 mpu;

// --- WIFI & MQTT CONFIG ---
const char *ssid = "YOUR_WIFI_SSID";
const char *password = "YOUR_WIFI_PASSWORD";
const char *mqtt_server = "test.mosquitto.org"; // or your Firebase IoT Gateway
WiFiClient espClient;
PubSubClient client(espClient);

// --- VARIABLES ---
float temperature, humidity, gasLevel, lightLevel, distance;
float accelX, accelY, accelZ;

// --- FUNCTION DECLARATIONS ---
void setup_wifi();
void reconnect();
void publishData();

void setup()
{
    Serial.begin(115200);
    dht.begin();
    Wire.begin();
    rtc.begin();
    lcd.init();
    lcd.backlight();

    // MPU6050 initialization
    if (!mpu.begin())
    {
        Serial.println("MPU6050 not detected!");
        while (1)
            ;
    }

    // WiFi + MQTT setup
    setup_wifi();
    client.setServer(mqtt_server, 1883);

    lcd.setCursor(0, 0);
    lcd.print("Cold Chain Init");
    delay(2000);
    lcd.clear();
}

void loop()
{
    if (!client.connected())
        reconnect();
    client.loop();

    // --- SENSOR READINGS ---
    temperature = dht.readTemperature();
    humidity = dht.readHumidity();
    gasLevel = analogRead(MQ2_PIN);
    lightLevel = analogRead(LDR_PIN);

    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);
    accelX = a.acceleration.x;
    accelY = a.acceleration.y;
    accelZ = a.acceleration.z;

    // Ultrasonic Sensor (door open/close detection)
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    distance = pulseIn(ECHO_PIN, HIGH) * 0.034 / 2;

    // Time from RTC
    DateTime now = rtc.now();

    // --- DISPLAY ON LCD ---
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("T:");
    lcd.print(temperature);
    lcd.print(" H:");
    lcd.print(humidity);
    lcd.setCursor(0, 1);
    lcd.print("Gas:");
    lcd.print(gasLevel);
    lcd.print(" Lt:");
    lcd.print(lightLevel);

    // --- SEND TO CLOUD ---
    publishData();

    delay(5000); // every 5 seconds
}

void setup_wifi()
{
    delay(10);
    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("WiFi connected!");
}

void reconnect()
{
    while (!client.connected())
    {
        Serial.print("Attempting MQTT connection...");
        if (client.connect("ESP32Client"))
        {
            Serial.println("connected");
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            delay(2000);
        }
    }
}

void publishData()
{
    String payload = "{";
    payload += "\"temperature\":" + String(temperature, 2) + ",";
    payload += "\"humidity\":" + String(humidity, 2) + ",";
    payload += "\"gas\":" + String(gasLevel, 2) + ",";
    payload += "\"light\":" + String(lightLevel, 2) + ",";
    payload += "\"accel\":[" + String(accelX, 2) + "," + String(accelY, 2) + "," + String(accelZ, 2) + "],";
    payload += "\"door_distance\":" + String(distance, 2);
    payload += "}";

    Serial.println("Publishing: " + payload);
    client.publish("coldchain/data", payload.c_str());
}