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
        dispatcher.utter_message("Salve \r\n Sono BVBot! Come posso aiutare?")
        return []

class ActionReplyThankYou:
    def name(self):
        return "ActionReplyThankYou"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("E' un piacere aiutarti \r\n Se hai bisogno di altro io sono qui")
        return []

class ActionReplyEndConversation:
    def name(self):
        return "ActionReplyEndConversation"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("E' stato un piacere aiutarti")
        tracker._reset()
        return []

class ActionGetBankAccountList(Action):
    def name(self):
        return "ActionGetBankAccountList"

    def run(self, dispatcher, tracker, domain):
        # chiamata get che deve prendere la lista dei conti dell'utente
        URL = 'http://192.168.41.32:8080/ibs-mvc/rest/config/languages'
        r = requests.get(url=URL)
        data = r.json()
        accountList = str(''.join(data["languages"]))
        dispatcher.utter_message(accountList)
        return [SlotSet("accountList", accountList)]

class ActionGetTotalValueOfBankAccount(Action):
    def name(self):
        return "ActionGetTotalValueOfBankAccount"

    def run(self, dispatcher, tracker, domain):
        # chiamata get che deve prendere la lista dei conti dell'utente
        accountList = tracker.get_slot("accountList")
        selectedAccount = tracker.get_slot("selectedAccount")
        if (accountList is None):
            URL = 'http://192.168.41.32:8080/ibs-mvc/rest/config/languages'
            r = requests.get(url=URL)
            data = r.json()
            accountList = str(data["languages"])
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
        dispatcher.utter_message("ActionAccountInfoRequest non ancora implementato")
        return []

class ActionAccountSelection(Action):
    def name(self):
        return "ActionAccountSelection"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("ActionAccountSelection non ancora implementato")
        return []

class ActionAccountReciver(Action):
    def name(self):
        return "ActionAccountReciver"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("ActionAccountReciver non ancora implementato")
        return []

class ActionSummaryConfirmationRequest(Action):
    def name(self):
        return "ActionSummaryConfirmationRequest"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("ActionSummaryConfirmationRequest non ancora implementato")
        return []

class ActionSummaryPayment(Action):
    def name(self):
        return "ActionSummaryPayment"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("ActionSummaryPayment non ancora implementato")
        return []
