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

class ActionReplyStartConversation(Action):
    def name(self):
        return "ActionReplyStartConversation"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("Salve! Sono BVBot! Come posso aiutare?")
        return []

class ActionReplyEndConversation(Action):
    def name(self):
        return "ActionReplyEndConversation"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("E' un piacere aiutarti! Se hai bisogno di altro io sono qui")
        return []

class ActionGetBankAccountList(Action):
    def name(self):
        return "ActionGetBankAccountList"

    def run(self, dispatcher, tracker, domain):
        # chiamata get che deve prendere la lista dei conti dell'utente
        # URL = 'http://192.168.41.32:8080/ibs-mvc/rest/config/languages'
        # r = requests.get(url=URL)
        # data = r.json()
        # accountList = str(''.join(data["languages"]))
        # dispatcher.utter_message(accountList)

        # nessuna chiamata, per i test offline
        accountList = '{"account":[{"conto 1":300},{"conto 2":50}]}'
        dispatcher.utter_message(accountList)
        return [SlotSet("accountList", accountList)]

class ActionGetTotalValueOfBankAccount(Action):
    def name(self):
        return "ActionGetTotalValueOfBankAccount"

    def run(self, dispatcher, tracker, domain):
        accountList = tracker.get_slot("accountList")
        selectedAccount = tracker.get_slot("selectedAccount")
        if (accountList is None):
            #URL = 'http://192.168.41.32:8080/ibs-mvc/rest/config/languages'
            #r = requests.get(url=URL)
            #data = r.json()
            #accountList = str(data["languages"])
            accountList = '{"account":[{"conto 1":300},{"conto 2":50}]}'
            SlotSet("accountList", accountList)
        # nel caso in cui nella chiamata alla lista degli account c'è anche il valore dei conti basta estrapolare il dato da quella chiamata
        selectedAccount = tracker.get_slot("selectedAccount")
        # questa sotto non è ovviamente la chiamata da fare, ma non sapendo URL e payload ho fatto così
        # URL = 'http://192.168.41.32:8080/ibs-mvc/rest/config/languages'
        # payload = {'account':selectedAccount}
        # r = requests.post(url=URL, data=payload)
        # data = r.json()
        message = 'Il valore del conto ' + str(selectedAccount) + " è " + ' di ' + '300 euro'
        dispatcher.utter_message(str(message.decode("ascii", "ignore")))
        return []

class ActionAccountInfoRequest(Action):
    def name(self):
        return "ActionAccountInfoRequest"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("Da quale conto vuoi effettuare il pagamento?")
        return []

class ActionAccountSelection(Action):
    def name(self):
        return "ActionAccountSelection"

    def run(self, dispatcher, tracker, domain):
        if tracker.get_slot("selectedAccount") is None:
            dispatcher.utter_message("Potresti ripetere il conto da cui prelevare?")
            SlotSet("selectedAccount", value=None, timestamp=None)
        else:
            dispatcher.utter_message("Ora dovresti indicarmi il totale del pagamento e la valuta!")
        return []

class ActionAccountReciver(Action):
    def name(self):
        return "ActionAccountReciver"

    def run(self, dispatcher, tracker, domain):
        if tracker.get_slot("valuePayment") is None:
            dispatcher.utter_message("Mi manca il valore del pagamento, potresti ripetere?")
            SlotSet("valuePayment", value=None, timestamp=None)
            SlotSet("currencyPayment", value=None, timestamp=None)
        elif (tracker.get_slot("currencyPayment") is None):
            dispatcher.utter_message("Potresti ripetere il valore del pagamento con annessa valuta?")
            SlotSet("valuePayment", value=None, timestamp=None)
            SlotSet("currencyPayment", value=None, timestamp=None)
        else:
            dispatcher.utter_message("Ora dovresti darmi l'iban del conto di destinazione!")
        return []

class ActionSummaryPayment(Action):
    def name(self):
        return "ActionSummaryPayment"

    def run(self, dispatcher, tracker, domain):
        if ((tracker.get_slot("ibanReceiver") is None) and (tracker.get_slot("valuePayment") is None) and (tracker.get_slot("currencyPayment") is None) and (tracker.get_slot("selectedAccount") is None)):
            dispatcher.utter_message("Mi dispiace ma c'è qualcosa che manca dobbiamo ricominciare da capo!")
            Restarted(timestamp=None)
        else:
            message = 'Ok il pagamento di ' + tracker.get_slot("valuePayment") + ' ' + tracker.get_slot("currencyPayment")
            message += 'verso iban ' + tracker.get_slot("ibanReceiver") + ' usando il conto ' + tracker.get_slot("selectedAccount")
            message += ' è stato effettuato!'
            dispatcher.utter_message(str(message.decode("ascii", "ignore")))
        return []

class ActionPaymentRejected(Action):
    def name(self):
        return "ActionPaymentRejected"

    def run(self, dispatcher, tracker, domain):
        message = 'Hai annullato il pagamento! Verranno eliminati i dati memorizzati!'
        dispatcher.utter_message(str(message.decode("ascii", "ignore")))
        Restarted(timestamp=None)
        return []
