cd RASA_IA

rm -r models

python -m rasa_nlu.train --config nluModelConfig.yml --data data/ --project current --fixed_model_name nlu --path models/

python -m rasa_core.train -d domain.yml -s newStories.md -o models/current/core --epochs 400

python -m rasa_core.server -d models/current/core -u models/current/nlu -o out.log -p 5004 --verbose --debug
