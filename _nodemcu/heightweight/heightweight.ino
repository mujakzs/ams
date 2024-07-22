
/*
NodeMCU Pin Mapping

D0 - 16
D1 - 5
D2 - 4
D3 - 0
D4 - 2
D5 - 14
D6 - 12
D7 - 13
D8 - 15

*/

#if !defined(ESP32)
#error This code is intended to run only on the ESP32 boards ! Please check your Tools->Board setting.
#endif

#define _WEBSOCKETS_LOGLEVEL_ 2

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

#include <WebSocketsClient_Generic.h>

WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

#define USE_SSL false
#define SOUND_VELOCITY 0.034
#define max_height 200

#if USE_SSL
// ssl
#define WS_SERVER "wss://echo.websocket.org"
#define WS_PORT 443
#else
// local
#define WS_SERVER "192.168.1.2"
#define WS_PORT 8070
#endif

#define SSID "bell2.4"
#define PASSWORD "84753620A!"

bool alreadyConnected = false;

int connectionLedPin = 2; // 2 is the built in blue LED
const int trigPin = 32;
const int echoPin = 33;

// timing to send ws message
unsigned long startMillis;
unsigned long currentMillis;
const unsigned long period = 500;

void sendHeight(float height, float weight) {
  //webSocket.sendTXT("message here");
  // create JSON message
  DynamicJsonDocument doc(1024);
  doc["height"] = height;
  doc["weight"] = weight;

  // JSON to String (serializion)
  String output;
  serializeJson(doc, output);

  // Send event
  webSocket.sendTXT(output);

  // Print JSON for debugging
  // Serial.println(output);
}

void hexdump(const void* mem, const uint32_t& len, const uint8_t& cols = 16) {
  const uint8_t* src = (const uint8_t*)mem;

  Serial.printf("\n[HEXDUMP] Address: 0x%08X len: 0x%X (%d)", (ptrdiff_t)src, len, len);

  for (uint32_t i = 0; i < len; i++) {
    if (i % cols == 0) {
      Serial.printf("\n[0x%08X] 0x%08X: ", (ptrdiff_t)src, i);
    }

    Serial.printf("%02X ", *src);
    src++;
  }

  Serial.printf("\n");
}

void webSocketEvent(const WStype_t& type, uint8_t* payload, const size_t& length) {
  switch (type) {
    case WStype_DISCONNECTED:
      if (alreadyConnected) {
        Serial.println("[WSc] Disconnected!");
        alreadyConnected = false;
        digitalWrite(connectionLedPin, LOW);
      }

      break;

    case WStype_CONNECTED:
      {
        alreadyConnected = true;
        digitalWrite(connectionLedPin, HIGH);

        Serial.print("[WSc] Connected to url: ");
        Serial.println((char*)payload);

        // send message to server when Connected
        webSocket.sendTXT("Connected");
      }
      break;

    case WStype_TEXT:
      // Serial.printf("[WSc] get text: %s\n", payload);

      // send message to server
      //sendTXTMessage();

      break;

    case WStype_BIN:
      Serial.printf("[WSc] get binary length: %u\n", length);
      hexdump(payload, length);

      // send data to server
      webSocket.sendBIN(payload, length);
      break;

    case WStype_PING:
      // pong will be send automatically
      Serial.printf("[WSc] get ping\n");
      break;

    case WStype_PONG:
      // answer to a ping we send
      Serial.printf("[WSc] get pong\n");
      break;

    case WStype_ERROR:
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
      break;

    default:
      break;
  }
}

void setup() {
  Serial.begin(115200);

  while (!Serial)
    ;

  delay(200);

  Serial.print("\nStart ESP8266_WebSocketClient on ");
  Serial.println(ARDUINO_BOARD);
  Serial.println(WEBSOCKETS_GENERIC_VERSION);

  WiFiMulti.addAP(SSID, PASSWORD);

  while (WiFiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }

  Serial.println();

  // Client address
  Serial.print("WebSockets Client started @ IP address: ");
  Serial.println(WiFi.localIP());

  // server address, port and URL
  Serial.print("Connecting to WebSockets Server @ ");
  Serial.println(WS_SERVER);

  // server address, port and URL
#if USE_SSL
  webSocket.beginSSL(WS_SERVER, WS_PORT);
#else
  webSocket.begin(WS_SERVER, WS_PORT, "/");
#endif


  // event handler
  webSocket.onEvent(webSocketEvent);

  webSocket.setReconnectInterval(5000);
  webSocket.enableHeartbeat(15000, 3000, 2);
  Serial.print("Connected to WebSockets Server @ IP address: ");
  Serial.println(WS_SERVER);

  // pin input/output
  pinMode(connectionLedPin, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  webSocket.loop();

  currentMillis = millis();
  if (currentMillis - startMillis >= period) {
    float height = getHeight();
    sendHeight(height, 0);  // should be weight
    startMillis = currentMillis;
  }
}

float getHeight() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  float distanceCm = duration * SOUND_VELOCITY / 2;
  float height = max_height - distanceCm;
  return height;
}
