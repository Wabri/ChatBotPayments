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
        if (accountList is None):
            URL = 'http://192.168.41.32:8080/ibs-mvc/rest/config/languages'
            r = requests.get(url=URL)
            data = r.json()
            accountList = str(data["languages"])
            SlotSet("accountList", accountList)
        # nel caso in cui nella chiamata alla lista degli account c'è anche il valore dei conti basta estrapolare il dato da quella chiamata
        selectedAccount = 0
        # questa sotto non è ovviamente la chiamata da fare, ma non sapendo URL e payload ho fatto così
        # URL = 'http://192.168.41.32:8080/ibs-mvc/rest/config/languages'
        # payload = {'account':selectedAccount}
        # r = requests.post(url=URL, data=payload)
        # data = r.json()
        message = 'Il valore del conto ' + str(selectedAccount) + ' è di ' + '300 euro'
        dispatcher.utter_message(str(message.decode("ascii", "ignore")))
        return []
