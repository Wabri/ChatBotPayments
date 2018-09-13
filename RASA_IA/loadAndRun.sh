pip install -r requirements.txt

spacy download it_core_news_sm

spacy link it_core_news_sm it --force

python -m rasa_nlu.train --config nluModelConfig.yml --data data/ --project current --fixed_model_name nlu --path models/

python -m rasa_core.train -d payment_domain.yml -s stories/payment_stories.md -o models/current/core --epochs 300

python -m rasa_core.server -d models/current/core -u models/current/nlu -o out.log --cors 'http://192.168.13.15:9001' --verbose --auth_token wabridev
