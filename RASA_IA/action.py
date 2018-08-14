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


class ServerInfo():

    def __init__(self):
        self.serverIP = "192.168.13.15"
        self.serverPort = "8080"

    def getIP(self):
        return self.serverIP

    def getPort(self):
        return self.serverPort

    def getStringJsonPayment(self):
        # attualmente sto considerando solo il pagamento a partire da un unico utente #
        dataDumps = json.dumps({"debitAccountId":"0213184001000CHF","type":"SWISS","restWarnings":[],"execution":{"restCode":"UNIQUE","executionDate":1534370400000,"adviceType":"SN_SN","tagId":None},"status":None,"creationDate":None,"modificationDate":None,"dtaId":None,"permanentId":None,"transactionSigningTimestamp":None,"dta":False,"billId":None,"paynetNumber":None,"contributors":[{"index":1,"date":1534258326552,"name":"GPUL","contribution":60}],"restSlips":[{"restType":"SWISS","type":"SWISS","beneficiaryAddress":{"lines":["swiss"]},"reason":{"lines":[]},"accountId":"CH06 4319 9252 7512 5895 8","bank":{"id":"8049747","sic":"09000","bic":"POFICHBEXXX","esrCode":None,"postAccountCode":None,"address":"SWISS POST-POSTFINANCE BERNE","description":"SWISS POST-POSTFINANCE","ban":None,"category":"BANK","sepa":True},"amount":{"value":100,"currency":{"isoCode":"CHF","ccyId":"CHF","priority":2,"fractionDigits":2,"euroParity":None,"roundingRule":0.05}},"warnings":[],"infos":[],"restWarnings":[]}]})
        return dataDumps

serverInfo = ServerInfo()


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
            message += str(tracker.get_slot("ibanReceiver")) + "! Pronuncia 'confermo il pagamento' per continuare altrimenti 'rifiuto il pagamento' per annullare!"
            dispatcher.utter_message(str(message.decode("utf_8", "ignore")))
        return[]


class ActionPaymentConfermation(Action):

    def name(self):
        return "ActionPaymentConfermation"

    def run(self,dispatcher,tracker,domain):
        if (tracker.get_slot("selectedAccount") is None):
            message = "Prima di confermare il pagamento per favore seleziona il conto!"
        elif (tracker.get_slot("valuePayment") is None ) and (tracker.get_slot("currencyPayment") is None):
            message = "Prima di confermare il pagamento per favore indica il valore del pagamento e in che valuta!"
        elif (tracker.get_slot("ibanReceiver") is None):
            message = "Prima di confermare il pagamento per favore inserisci il conto di destinazione!"
        else:
            dataDumps = serverInfo.getStringJsonPayment()
            data = json.loads(dataDumps)
            data["restSlips"][0]["amount"]["value"] = int(tracker.get_slot("valuePayment"))
            data["restSlips"][0]["accountId"] = str(tracker.get_slot("ibanReceiver"))
            data["restSlips"][0]["amount"]["currency"]["isoCode"] = str(tracker.get_slot("currencyPayment"))
            data["restSlips"][0]["amount"]["currency"]["ccyId"] = str(tracker.get_slot("currencyPayment"))
            URL = 'http://' + serverInfo.getIP() + ':' + serverInfo.getPort() + '/ibs-mvc/rest/domain/customers'
            jsessionid = str(tracker.get_slot("jsessionid"))
            xcsrftoken = str(tracker.get_slot("xcsrftoken"))
            cookie = {'JSESSIONID': jsessionid, 'XSRF-TOKEN': xcsrftoken}
            r = requests.get(url=URL,  data=json.loads(dataPayment) , cookies=cookie)
            data = r.json()
            if (r.status_code == 200):
                message = "Pagamento preso in carico correttamente!"
            else:
                message = "Pagamento non riuscito, riprovare!"
        dispatcher.utter_message(str(message.decode("utf_8", "ignore")))
        return[]


class ActionPaymentReject(Action):

    def name(self):
        return "ActionPaymentReject"

    def run(self,dispatcher,tracker,domain):
        SlotSet('selectedAccount', value=None, timestamp=None)
        SlotSet('valuePayment', value=None, timestamp=None)
        SlotSet('currencyPayment', value=None, timestamp=None)
        SlotSet('ibanReceiver', value=None, timestamp=None)
        message = "Pagamento annullato!"
        dispatcher.utter_message(str(message.decode("utf_8", "ignore")))
        return[]


class ActionRequestListAccount(Action):

    def name(self):
        return "ActionRequestListAccount"

    def run(self,dispatcher,tracker,domain):
        data = tracker.get_slot('accountList')
        if data is None:
            URL = 'http://' + serverInfo.getIP() + ':' + serverInfo.getPort() + '/ibs-mvc/rest/domain/customers'
            jsessionid = str(tracker.get_slot("jsessionid"))
            xcsrftoken = str(tracker.get_slot("xcsrftoken"))
            cookie = {'JSESSIONID': jsessionid, 'XSRF-TOKEN': xcsrftoken}
            r = requests.get(url=URL, cookies=cookie)
            data = r.json()
        message = "La lista dei conti è: "
        index = 0
        for account in data:
            message += "" + str(index).encode('utf8') + "." + account["description"].encode('utf8') + " "
            index = index + 1
        dispatcher.utter_message(message.decode("utf_8", "ignore"))
        return[SlotSet('accountList', value=data, timestamp=None)]


class ActionRequestTotalAccountValue(Action):

    def name(self):
        return "ActionRequestTotalAccountValue"

    def run(self,dispatcher,tracker,domain):
        if tracker.get_slot("selectedAccount") is not None:
            if tracker.get_slot("accountList") is None:
                URL = 'http://' + serverInfo.getIP() + ':' + serverInfo.getPort() + '/ibs-mvc/rest/domain/customers'
                jsessionid = str(tracker.get_slot("jsessionid"))
                xcsrftoken = str(tracker.get_slot("xcsrftoken"))
                cookie = {'JSESSIONID': jsessionid, 'XSRF-TOKEN': xcsrftoken}
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
