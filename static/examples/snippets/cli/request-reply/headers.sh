#!/bin/bash

# Отправить запрос с заголовками
nats request service "data" -H "X-Request-ID:123" -H "X-Priority:high"
