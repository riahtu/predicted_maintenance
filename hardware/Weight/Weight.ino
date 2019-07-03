int pressurePin = A0;
float force,volt;
int LEDpin = 12;
void setup() {
Serial.begin(9600);
pinMode(LEDpin, OUTPUT);
}
void loop() {
  force = analogRead(pressurePin);
  Serial.print(force);
  Serial.print(" ");
  volt = force/1023;
  Serial.println(volt*5);
  delay(500);
if(force > 300)
{
  digitalWrite(LEDpin, HIGH);
}
else
{
  digitalWrite(LEDpin, LOW);
}
delay(100);
}
