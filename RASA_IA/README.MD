***è consigliato l'uso di python2.7***
# Installazione
nlu:
```bash
$ pip install rasa_nlu[spacy]
$ python -m spacy download it
```
core:
```bash
$ pip install rasa_core
```

# NLU: Per creare un nuovo modello è necessario eseguire il comando:
```bash
$ python -m rasa_nlu.train --config nluModelConfig.yml --data data/ --fixed_model_name nlu
```
***è necessario avere un link al dizionario, scaricare se non già fatto:***
```bash
$ python -m spacy download it
```

# NLU: Per creare nuovi data set usando un tool è necessario usare il comando:
```bash
$ rasa-nlu-trainer --source /data/intents/<intento_da_creare>.json
```
***Per esempio se volessimo creare un nuovo data set per ciao.json dovremo eseguire:***
```bash
$ rasa-nlu-trainer --source /data/intents/ciao.json
```

# CORE: Per generare un altro modello è necessario eseguire il comando:
```bash
$ python -m rasa_core.train -d domain.yml -s stories.md -o models/default/core --epochs 200
```

# CORE: Per eseguire il server è necessario eseguire il comando:
```bash
$ python -m rasa_core.server -d models/default/core -u models/default/nlu -o out.log -p 5005
```
