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
