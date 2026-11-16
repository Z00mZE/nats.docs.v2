#!/bin/bash

# Опубликовать сообщение в теме "weather.updates"
nats pub weather.updates "Temperature: 72°F"
