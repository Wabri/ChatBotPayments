# coding=utf-8
import requests
from rasa_core import utils
from rasa_core.actions import Action
from rasa_core.agent import Agent
from rasa_core.channels.console import ConsoleInputChannel
from rasa_core.events import SlotSet
from rasa_core.featurizers import (
    MaxHistoryTrackerFeaturizer,
    BinarySingleStateFeaturizer)

class ActionReplyStartConversation:
    def name(self):
        return "ActionReplyStartConversation"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("Ciao, sono il prototipo di un bot")
        return []

class ActionReplyEndConversation:
    def name(self):
        return "ActionReplyEndConversation"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("Alla prossima")
        return []

class ActionGetBankAccountList(Action):
    def name(self):
        return "ActionGetBankAccountList"

    def run(self, dispatcher, tracker, domain):
        URL = 'http://192.168.41.32:8080/ibs-mvc/rest/config/languages'
        r = requests.get(url=URL)
        data = r.json()
        dispatcher.utter_message(data["defaultLanguage"])
        return [SlotSet("listAccount", data)]
        
