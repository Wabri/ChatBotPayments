from rasa_core.events import SlotSet
from rasa_core import utils
from rasa_core.actions import Action

class ActionAccountList(Action):
    def name(self):
        return 'action_get_account_list_from_server'

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("Get account list data from server")
        // chiamata al server
        // Json con le informazioni dell'account
        // inserimento in formato string della risposta in accountList
        return [SlotSet("accountList",accountList)]

class ActionTotalValueAccount(Action):
    def name(self):
        return 'action_get_value_of_account_from_server'

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("Get account total value data from server")
        // chiamata al server
        // Json con le informazioni dell'account
        // inserimento in formato string della risposta in accountList
        return [SlotSet("currentTotalAccount",totalValue)]
