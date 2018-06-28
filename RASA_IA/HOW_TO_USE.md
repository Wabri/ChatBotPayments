python -m rasa_nlu.train --config config/spacyConfig.yml --data data/ --path projectModules
python -m rasa_nlu.server --path projectModules
