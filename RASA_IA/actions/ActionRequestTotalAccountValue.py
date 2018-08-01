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
import json

class ActionRequestTotalAccountValue(Action):
    def name(self):
        return "ActionRequestTotalAccountValue"

    def run(self,dispatcher,tracker,domain):
        if tracker.get_slot("selectedAccount") is not None:
            if tracker.get_slot("accountList") is None:
                accountList = '[{"accounts":[{"name":"1","value":300,"currency":"euro"},{"name":"2","value":50,"currency":"franchi"}]}]'
                SlotSet("accountList", accountList)
            accountList = str(tracker.get_slot("accountList"))
            jsonListAccounts = json.loads(accountList)
            accountSelected = jsonListAccounts[0]["accounts"][tracker.get_slot("selectedAccount")-1]
            message = "Il conto che hai selezionato ha un totale di : " + str(accountSelected["value"]) + " " + str(accountSelected["currency"])
        else:
            message = "Non è stato selezionato alcun conto, per favore ripeti"
        dispatcher.utter_message(str(message))
        return []
