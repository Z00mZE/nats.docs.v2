# Терминал 1: экземпляр сервиса 1
nats reply api.calculate --queue api-workers "Result from instance 1"

# Терминал 2: экземпляр сервиса 2
nats reply api.calculate --queue api-workers "Result from instance 2"

# Терминал 3: экземпляр сервиса 3
nats reply api.calculate --queue api-workers "Result from instance 3"

# Терминал 4: отправка запросов с балансировкой между экземплярами
nats request api.calculate ""
nats request api.calculate ""
nats request api.calculate ""
