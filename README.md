# ChatBotPayments

--------------------


Versione: 0.1.0

Lingua: Italiano


--------------------

## index

* [Introduction](#0-introduction)
* [Frontend](#1-frontend)
    - [index.ts](#11-indexts)
    - [index.html](#12-indexhtml)
    - [script.ts](#13-scriptts)
* [Backend](#2-backend)

## 0. Introduction

Questo è il mio progetto di tesi e tirocinio per il corso di laurea in informatica presso l'Università degli studi di Firenze.
Il progetto si basa sulla creazione di un servizio di chat bot che permetta i pagamenti vocali. 
Lo sviluppo di questo applicativo è diviso in 2 parti: frontend e backend.
Il frontend l'ho scritto in typescript e una volta compilato in javascript l'ho eseguito tramite node.
il backend è un insieme di linguaggi: per la parte di configurazione ho usato yaml e markdown, per la parte effettiva python.


## 1. Frontend

Non avendo mai avuto esperienza con linguaggi per web ho avuto molte difficoltà a imparare JavaScript.
Sviluppare quindi la prima versione del frontend mi ha impiegato molto tempo e, una volta completata,
è stato difficile mantenerla. Mi è stato consigliato dal mio tutor universitario di provare a imparare TypeScript.
Ho quindi studiato questo linguaggio (vedi repo: [Learning TypeScript](https://github.com/Wabri/LearningTypescript)) 
trovandolo molto più leggibile, facile da mantenere e comprendere.
Da zero ho riscritto il frontend usando questo linguaggio, approfittandone anche per dare un ordine.
Attualmente è suddiviso in 3 parti: index.ts, index.html e script.js.

#### 1.1 index.ts 

Rappresenta la parte principale del frontend: vengono caricati i settings vari (dotenv), crea il server locale (express)
con reindirizzamento alla pagina html principale (index.html), gestisce la comunicazione utente-bot (socket). 

#### 1.2 index.html

Rappresenta la parte grafica del frontend, è quello che effettivamente si vede da browser. 
In pratica bottoni e zone di testo, non che i riferimenti agli script che librerie che sono usate per rendere la pagina dinamica.
Ho usato 2 librerie esterne: [socket.io](https://socket.io/) per poter sfruttare i socket e [jquery](https://api.jquery.com/) 
che è la libreria che effettivamente rende la pagina dinamica permettendo di modificare il codice html a runtime.
Infine c'è il riferimento allo script.js.

##### 1.3 script.ts

Questo script è programmato per eseguire 4 azioni: gestione chat, modifica dei campi di index.html, voice recognition e synth voice. 
Per il riconoscimento vocale e per la sintetizzazione della voce ho usato [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
libreria open source ancora in fase di sviluppo. La modifica dei campi di index.html viene fatta da jquery. 
Infine la gestione della chat è fatta usando socket messi a disposizione dalla libreria socket.io.

## 2. Backend
Inizialmente questa parte veniva fatta da [dialogflow](https://dialogflow.com/) strumento di casa google che permette di
creare con un'interfaccia molto semplice il tuo bot personalizzato. Per una questione di riservatezza dei dati sensibili
è stato richiesto di cambiare strumento per costruire l'intelligenza artificiale. Dopo varie ricerche ho deciso di 
usare [Rasa](https://rasa.com/), open source che ha le stesse funzioni di dialogflow ma con una fase di configurazione e
programmazione delle azioni leggermente più complessa. Rasa propone 2 funzionalità: Natural Language Understanding e Core.

##### 2.1 NLU
Un'intelligenza artificiale di questo prende in input un testo e restituisce in output diverse informazioni: l'intento 
della frase (i cosidetti intents) e le parole chiave che è possibile estrapolare (chiamate entities). 
L'intelligenza ha però bisogno di data set per allenarsi, dobbiamo quindi creare alcuni esempi di risoluzione.
La definizione di questi dati viene fatta tramite dei file json:
```
{
  "rasa_nlu_data": {
    "regex_features": [],
    "entity_synonyms": [],
    "common_examples": []
  }
}
```
Sono molto semplici da comprendere: **regex_features** sono le espressioni regolari, **entity_synonyms** sono i sinonimi
che è possibile incontrare, **common_examples** che sono gli esempi che è necessario fornire per allenare l'intelligenza.
Gli esempi che ho scritto io si trovano nella cartella [RASA_AI/data/intents](RASA_IA/data/intents). Potevo estrarre
i dati generati con dialogflow, ma ho preferito riscriverli per non dipendere da uno strumento esterno in modo da rendere
più facile da mantenere. Prima di allenare l'intelligenza è necessario creare il file di configurazione in cui indichiamo
la lingua e lo strumento usato per fare training, ho quindi creato il file nluModelConfig che si trova 
[RASA_IA/nluModelConfig.yml](RASA_IA/nluModelConfig.yml) che ha questo contenuto:
```
language: "it"

pipeline: "spacy_sklearn"
```
A questo punto è possibile eseguire il training.

##### 2.2 Core
