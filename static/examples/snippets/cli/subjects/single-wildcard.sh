# Подписаться с подстановочным знаком одного токена.
# Каждая подписка ожидает сообщения без ограничения времени, поэтому запускайте её
# в отдельном терминале либо повторяйте
# публикации для каждой подписки.
nats sub "orders.*.shipped"
nats sub "orders.*.placed"
nats sub "orders.retail.*"

# Опубликуйте сообщения в конкретных темах из другого терминала
nats pub orders.wholesale.placed "Order W73737"
nats pub orders.retail.placed "Order R65432"
nats pub orders.wholesale.shipped "Order W73001"
nats pub orders.retail.shipped "Order R65321"
