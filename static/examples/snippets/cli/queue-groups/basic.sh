# Терминал 1: первый обработчик в группе очереди
nats sub orders.new --queue workers

# Терминал 2: второй обработчик в той же группе очереди
nats sub orders.new --queue workers

# Терминал 3: третий обработчик в той же группе очереди
nats sub orders.new --queue workers

# Терминал 4: публикация сообщений с распределением между обработчиками
nats pub orders.new "Order 1"
nats pub orders.new "Order 2"
nats pub orders.new "Order 3"
nats pub orders.new "Order 4"

# Каждое сообщение получает ровно один обработчик
