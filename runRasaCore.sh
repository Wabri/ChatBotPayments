cd RASA_IA

python2.7 -m spacy download it

python2.7 -m rasa_nlu.train --config nluModelConfig.yml --data data/ --project current --fixed_model_name nlu --path models/

python2.7 -m rasa_core.train -d domain.yml -s stories.md -o models/current/core --epochs 100

python2.7 -m rasa_core.server -d models/current/core -u models/current/nlu -o out.log -p 5004
