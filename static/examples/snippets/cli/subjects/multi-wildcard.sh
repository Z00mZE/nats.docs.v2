# Подписаться с подстановочным знаком одного токена.
# Каждая подписка ожидает сообщения без ограничения времени, поэтому запускайте её
# в отдельном терминале либо повторяйте
# публикации для каждой подписки.
nats sub "sensor.alarm.*"
nats sub "sensor.*.*.critical"
nats sub "sensor.>"

# Опубликуйте сообщения в конкретных темах из другого терминала
nats pub sensor.alarm.smoke "kitchen,14:22"
nats pub sensor.alarm.smoke.critical "kitchen,14:23"
nats pub sensor.alarm.water "basement,16:42"
nats pub sensor.alarm.water.critical "basement,16:43"
