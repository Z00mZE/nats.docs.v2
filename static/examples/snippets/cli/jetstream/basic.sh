# Создать поток для всех тем с префиксом `orders.`
nats stream add ORDERS --subjects "orders.>" --storage file --retention limits --defaults

# Опубликовать несколько заказов
nats pub orders.new "Order #1001"
nats pub orders.new "Order #1002"
nats pub orders.shipped "Order #1001 shipped"

# Создать долговечный pull-потребитель с доставкой с начала потока
nats consumer add ORDERS order-processor --pull --deliver all --ack explicit --defaults

# Получить и подтвердить следующую порцию сообщений
nats consumer next ORDERS order-processor --count 3 --ack
