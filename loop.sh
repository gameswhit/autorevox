#!/bin/bash

while true; do
    node bot.js
    if [ $? -ne 0 ]; then
        echo "halah bacot"
        sleep 4 # menunggu 1 detik sebelum mengulang
    fi
done