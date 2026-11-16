# Терминал 1: первый сервис
nats reply service "Response from service 1"

# Терминал 2: второй сервис
nats reply service "Response from service 2"

# Терминал 3: отправьте запрос; nats reply помещает оба сервиса в общую группу очереди,
# поэтому отвечает один экземпляр и клиент получает один ответ
nats request service ""
