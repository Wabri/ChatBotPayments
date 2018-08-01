# coding=utf-8
import requests
from rasa_core import utils
from rasa_core.actions import Action
from rasa_core.agent import Agent
from rasa_core.events import SlotSet
import json


class ActionRequestListAccount(Action):
    def name(self):
        return "ActionRequestListAccount"

    def run(self,dispatcher,tracker,domain):
        print tracker.get_slot("accountList") is None
        if tracker.get_slot("accountList") is None:
            accountList = json.loads('[{"accounts":[{"name":"1","value":300,"currency":"euro"},{"name":"2","value":50,"currency":"franchi"}]}]')
            SlotSet("accountList", accountList)
            print tracker.get_slot("accountList") is None
        jsonListAccounts = tracker.get_slot("accountList")
        print tracker.get_slot("accountList")
        accountList = jsonListAccounts[0]["accounts"]
        message = "La lista dei conti è: "
        for account in accountList:
            message += "conto " + str(account["name"]) + " valore " + str(account["value"]) + " " + str(account["currency"]) + ", "
        dispatcher.utter_message(str(message.decode('utf_8',"ignore")))
        return[]
