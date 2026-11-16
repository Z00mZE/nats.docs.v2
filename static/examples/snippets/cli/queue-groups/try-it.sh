#!/bin/bash

# Терминал 1: запустите первый обработчик
nats sub tasks.process --queue workers

# Терминал 2: запустите второй обработчик
nats sub tasks.process --queue workers

# Терминал 3: отправьте задания
for i in {1..10}; do
  nats pub tasks.process "Task $i"
  sleep 0.5
done

# Наблюдайте распределение заданий между обработчиками
