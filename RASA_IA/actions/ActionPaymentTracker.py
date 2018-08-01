# coding=utf-8
import requests
from rasa_core import utils
from rasa_core.actions import Action
from rasa_core.agent import Agent

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
