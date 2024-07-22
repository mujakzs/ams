

#define max_distance 200


const int trigPin = 0;
const int echoPin = 2;
long duration;
int distance;
int distance1;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  // Write a pulse to the HC-SR04 Trigger Pin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Measure the response from the HC-SR04 Echo Pin
  duration = pulseIn(echoPin, HIGH);

  // Determine distance from duration
  // Use 343 metres per second as speed of sound
  distance = duration * 0.034 / 2;
  distance1 = 180 - distance;
  // Prints "Distance: <value>" on the first line of the LCD
  Serial.println(distance1);

  delay(500);
}