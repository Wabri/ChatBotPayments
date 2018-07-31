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
            dispatcher.utter_message(str(message.decode("ascii", "ignore")))
        return[]

class ActionRequestListAccount(Action):
    def name(self):
        return "ActionRequestListAccount"

    def run(self,dispatcher,tracker,domain):
        if (tracker.get_slot("accountList") is None):
            accountList = '{"account":[{"conto 1":300},{"conto 2":50}]}'
            SlotSet("accountList", accountList)
        message = "La lista dei conti è: " + str(tracker.get_slot("selectedAccount"))
        dispatcher.utter_message(str(message.decode("ascii", "ignore")))


class ActionGoodbye(Action):
    def name(self):
        return "ActionGoodbye"

    def run(self,dispatcher,tracker,domain):
        dispatcher.utter_message("Ciao, se hai altro da chiedere io sono qui!")
