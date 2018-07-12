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

class ActionGetBankAccountList(Action):
    def name(self):
        return "ActionGetBankAccountList"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("Aspetta qualche secondo...")
        userDataInformations = UserDataInformations();
        r = requests.get('http://192.168.41.32:8080/ibs-mvc/rest/config/languages')
        return [SlotSet("listAccount", r.json)]

class ActionSendBankAccountList(Action):
    def name(self):
        return 'ActionSendBankAccountList'

    def run(self,dispatcher, tracker, domain):
        slotListAccount=tracker.get_slot("listAccount")
        dispatcher.utter_message(slotListAccount)
        return [];
