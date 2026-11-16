#!/bin/bash

# Терминал 1: сервис-калькулятор складывает два числа из тела запроса
nats reply calc.add --command "sh -c \"echo \$NATS_REQUEST_BODY | awk '{print \$1 + \$2}'\""

# Терминал 2: выполните вычисления
nats request calc.add "5 3"
# Вывод: 8
nats request calc.add "10 7"
# Вывод: 17
