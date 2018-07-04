# NLU: Per creare un nuovo modello è necessario eseguire il comando:
```
$ python -m rasa_nlu.train --config nlu_model_config.yml --data data/ --o models --fixed_model_name nlu --project current --verbose
```

# NLU: Per creare nuovi data set usando un tool è necessario usare il comando:
```
$ rasa-nlu-trainer --source /data/intents/<intento_da_creare>.json
```
***Per esempio se volessimo creare un nuovo data set per ciao.json dovremo eseguire:***
```
$ rasa-nlu-trainer --source /data/intents/ciao.json
```

# CORE: Per generare un altro modello è necessario eseguire il comando:
```
$ python -m rasa_core.train -d domain.yml -s stories.md -o models/current/core --epochs 200
```

# CORE: Per eseguire il server è necessario eseguire il comando:
```
$ python -m rasa_core.server -d models/current/core -u models/current/nlu -o out.log -p 5005
```
