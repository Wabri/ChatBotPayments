# coding=utf-8
from rasa_core import utils
from rasa_core.actions import Action
from rasa_core.agent import Agent
from rasa_core.channels.console import ConsoleInputChannel
from rasa_core.events import SlotSet
from rasa_core.featurizers import (
    MaxHistoryTrackerFeaturizer,
    BinarySingleStateFeaturizer)
from rasa_core.interpreter import RasaNLUInterpreters

class UserDataInformations(object):
    def serchAccount(self, info):
        #chiamata al backend
        return info + "conto 1 300 euro \n\rconto 2 400 euro"

class ActionGetBankAccountList(Action):
    def name(self):
        return "ActionGetBankAccountList"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("Aspetta qualche secondo...")
        userDataInformations = UserDataInformations();
        bankAccountsList = userDataInformations.serchAccount(tracker.get_slot("user"))
        return [SlotSet("listAccount", bankAccountsList)]

class ActionSendBankAccountlist(Action):
    def name(self):
        return 'ActionSendBanckAccountlist'

    def run(self,dispatcher, tracker, domain):
        dispatcher.utter_message("La tua lista dei conti è: " + tracker.get_slot("listAccount"))
        return [];
