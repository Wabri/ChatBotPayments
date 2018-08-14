# mandare la frase al bot

post http://192.168.170.120:5004/conversations/default/parse
{"query":"ciao bot"}

# continuare la conversazione

post http://192.168.170.120:5004/conversations/default/respond
{"query":"ciao bot"}

# resettare la conversazione

post http://192.168.170.120:5004/conversations/default/continue
{"events": [{"event": "restart"}]}

# prendere le informazioni della conversazione

get http://192.168.170.120:5004/conversations/default/tracker

# settare il jsessionid e xcsrftoken della conversazione

curl -XPOST http://192.168.170.120:5004/conversations/default/tracker/events -d '[{"event": "slot", "name": "jsessionid", "value": "E0B22049719DD7BF90FE79F819DB6050"}]' | python -mjson.tool

curl -XPOST http://192.168.170.120:5004/conversations/default/tracker/events -d '[{"event": "slot", "name": "xcsrftoken", "value": "268d2f5c7cb566f9fdaf9171e98b3363b"}]' | python -mjson.tool
