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

class ServerInfo:

    def __init__(self):
        self.serverIP = "192.168.13.15"
        self.serverPort = "8080"

    def get_IP(self):
        return self.serverIP

    def get_Port(self):
        return self.serverPort

serverInfo = ServerInfo();

class ActionGreetings(Action):
    def name(self):
        return "ActionGreetings"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("Salve, sono BVBot! Come posso aiutare?")
        return []

class ActionPaymentTracker(Action):
    def name(self):
        return "ActionPaymentTracker"

    def run(self,dispatcher,tracker,domain):
        if (tracker.get_slot("selectedAccount") is None):
            dispatcher.utter_message("Per effettuare un pagamento ho bisogno di sapere il conto di partenza.")
        elif (tracker.get_slot("valuePayment") is None ) or (tracker.get_slot("currencyPayment") is None):
            dispatcher.utter_message("Per effettuare un pagamento ho bisogno di sapere il valore del pagamento.")
        elif (tracker.get_slot("ibanReceiver") is None):
            dispatcher.utter_message("Per effettuare un pagamento ho bisogno di sapere il conto di destinazione.")
        else:
            message = "Tutti i dati sono stati completati! Il pagamento verrà effettuato a partire dal conto "
            message += str(tracker.get_slot("selectedAccount")) + " per un totale di "
            message += str(tracker.get_slot("valuePayment")) + " " + str(tracker.get_slot("currencyPayment")) + " verso il conto "
            message += str(tracker.get_slot("ibanReceiver")) + " !"
            dispatcher.utter_message(str(message.decode("utf_8", "ignore")))
        return[]

class ActionRequestListAccount(Action):
    def name(self):
        return "ActionRequestListAccount"

    def run(self,dispatcher,tracker,domain):
        data = tracker.get_slot('accountList')
        if data is None:
            URL = 'http://'+serverInfo.get_IP()+':'+serverInfo.get_Port()+'/ibs-mvc/rest/domain/customers'
            cookie = {str(tracker.get_slot("jsessionid")),str(tracker.get_slot("xcsrftoken"))}
            r = requests.get(url=URL, cookies=cookie)
            data = r.json()
        message = "La lista dei conti è: "
        index = 0;
        for account in data:
            message += "" + str(index).encode('utf8') + "." + account["description"].encode('utf8')
            index = index +1
        dispatcher.utter_message(message.decode("utf_8", "ignore"))
        return[SlotSet('accountList', value=data, timestamp=None)]

class ActionRequestTotalAccountValue(Action):
    def name(self):
        return "ActionRequestTotalAccountValue"

    def run(self,dispatcher,tracker,domain):
        if tracker.get_slot("selectedAccount") is not None:
            if tracker.get_slot("accountList") is None:
                URL = 'http://'+serverInfo.get_IP()+':'+serverInfo.get_Port()+'/ibs-mvc/rest/domain/customers'
                cookie = {str(tracker.get_slot("jsessionid")),str(tracker.get_slot("xcsrftoken"))}
                r = requests.get(url=URL, cookies=cookie)
                data = r.json()
                SlotSet("accountList", data)
            accountList = str(tracker.get_slot("accountList"))
            jsonListAccounts = json.loads(accountList)
            accountSelected = jsonListAccounts[0]["accounts"][tracker.get_slot("selectedAccount")-1]
            message = "Il conto che hai selezionato ha un totale di : " + str(accountSelected["value"]) + " " + str(accountSelected["currency"])
        else:
            message = "Non è stato selezionato alcun conto, per favore ripeti"
        dispatcher.utter_message(str(message))
        return []

class ActionGoodbye(Action):
    def name(self):
        return "ActionGoodbye"

    def run(self,dispatcher,tracker,domain):
        dispatcher.utter_message("Ciao, se hai altro da chiedere io sono qui!")
