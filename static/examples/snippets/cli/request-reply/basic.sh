# Терминал 1: настройте сервис, отвечающий на запросы времени
nats reply time --command "date"

# Терминал 2: отправьте запрос
nats request time ""

# Вывод: Wed Nov 15 10:23:45 PST 2023
