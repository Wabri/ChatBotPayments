# coding=utf-8
import requests
import json
import time
import datetime
from rasa_core.actions import Action
from rasa_core.events import SlotSet
from rasa_core.events import Restarted


class ServerInfo():

    def __init__(self):
        self.serverIP = "192.168.13.15"
        self.serverPort = "8080"

    def getIP(self):
        return self.serverIP

    def getPort(self):
        return self.serverPort

    def getStringJsonValidatePayment(self):
        # attualmente sto considerando solo il pagamento a partire da un unico utente #
        dataDumps = json.dumps({"id":None,"debitAccountId":"0213184001000CHF","type":"SWISS","restWarnings":[],"execution":{"restCode":"UNIQUE","adviceType":"SN_SN","tagId":None,"description":None,"valueCompensated":None,"executionDate":None,"messageFromBank":None,"priority":"NORMAL"},"status":None,"creationDate":None,"modificationDate":None,"dtaId":None,"permanentId":None,"transactionSigningTimestamp":None,"dta":False,"billId":None,"paynetNumber":None,"contributors":[{"index":1,"date":None,"name":"GPUL","contribution":60}],"restSlips":[{"restType":"SWISS","type":"SWISS","beneficiaryAddress":{"lines":["prova test bot"]},"reason":{"lines":[]},"accountId":None,"bank":{"id":"8049747","sic":"09000","bic":"POFICHBEXXX","esrCode":None,"postAccountCode":None,"address":"SWISS POST-POSTFINANCE  BERNE","description":"SWISS POST-POSTFINANCE","ban":None,"category":"BANK","sepa":True},"id":None,"amount":{"value":None,"currency":{"isoCode":None,"ccyId":None,"priority":2,"fractionDigits":2,"euroParity":None,"roundingRule":0.05}},"warnings":[],"infos":[],"restWarnings":[]}]})
        return dataDumps

    def getUrlValidatePayment(self):
        return 'http://' + self.getIP() + ':' + self.getPort() + '/ibs-mvc/rest/payments/validatepayment'

    def getUrlTransactionProtection(self):
        return 'http://' + self.getIP() + ':' + self.getPort() + '/ibs-mvc/rest/payments/transactionprotection'

    def getUrlSavePaymentTransaction(self, transactionTokenKey):
        return 'http://' + self.getIP() + ':' + self.getPort() + '/ibs-mvc/rest/payments/savepaymenttransaction?transactionTokenKey=' + transactionTokenKey


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

    def run(self, dispatcher, tracker, domain):
        '''
        # questo if serve a selezionare il conto di partenza,
        # ma attualmente vengono effettuati pagamenti da un unico conto
        if (tracker.get_slot("selectedAccount") is None):
            dispatcher.utter_message("Per effettuare un pagamento ho bisogno di sapere il conto di partenza.")
        '''
        if (tracker.get_slot("valuePayment") is None) or (tracker.get_slot("currencyPayment") is None):
            dispatcher.utter_message("Per effettuare un pagamento ho bisogno di sapere il valore del pagamento.")
        elif tracker.get_slot("ibanReceiver") is None:
            dispatcher.utter_message("Per effettuare un pagamento ho bisogno di sapere il conto di destinazione.")
        else:
            message = "Tutti i dati sono stati completati! Pronuncia 'confermo la transazione' per continuare altrimenti 'rifiuto la transazione' per annullare!"
            dispatcher.utter_message(message.decode("ascii", "ignore"))
        return[]


class ActionPaymentConfermation(Action):

    def name(self):
        return "ActionPaymentConfermation"

    def run(self, dispatcher, tracker, domain):
        if (tracker.get_slot("valuePayment") is None ) and (tracker.get_slot("currencyPayment") is None):
            message = "Prima di confermare il pagamento per favore indica il valore del pagamento e in che valuta!"
        elif (tracker.get_slot("ibanReceiver") is None):
            message = "Prima di confermare il pagamento per favore inserisci il conto di destinazione!"
        else:
            payload = json.loads(serverInfo.getStringJsonValidatePayment())
            payload["restSlips"][0]["amount"]["value"] = int(tracker.get_slot("valuePayment"))
            payload["restSlips"][0]["accountId"] = str(tracker.get_slot("ibanReceiver"))
            payload["restSlips"][0]["amount"]["currency"]["isoCode"] = str(tracker.get_slot("currencyPayment")).upper()
            payload["restSlips"][0]["amount"]["currency"]["ccyId"] = str(tracker.get_slot("currencyPayment")).upper()
            payload["execution"]["executionDate"] = int(round(time.time() * 1000 + 604800000))
            payload["contributors"][0]["date"] = payload["execution"]["executionDate"]
            url = serverInfo.getUrlValidatePayment()
            cookies = {'JSESSIONID': str(tracker.get_slot("jsessionid")), 'XSRF-TOKEN': str(tracker.get_slot("xcsrftoken")), 'ls.lastAccess': 'tabSMS'}
            headers = {'X-XSRF-TOKEN': str(tracker.get_slot("xcsrftoken")), 'Content-Type': 'application/json;charset=UTF-8'}
            r = requests.post(url=url, data=json.dumps(payload), cookies=cookies, headers=headers)
            print(r.json())
            if r.status_code == requests.codes.ok:
                url = serverInfo.getUrlTransactionProtection()
                r = requests.post(url=url, data=json.dumps(payload), cookies=cookies, headers=headers)
                print(r.json())
                if r.status_code == requests.codes.ok:
                    headers = {'X-XSRF-TOKEN': str(tracker.get_slot("xcsrftoken"))}
                    url = serverInfo.getUrlSavePaymentTransaction(r.json()["transactionTokenKey"])
                    print(url)
                    r = requests.get(url=url, cookies=cookies, headers=headers)
                    if r.status_code == requests.codes.ok:
                        message = "Pagamento preso in carico!"
                    else:
                        message = "Impossibile confermare il pagamento, riprovare!"
                    print(r.status_code)
                    print(r.text)
                else:
                    message = "Il pagamento ha transaction protection, impossibile continuare!"
            else:
                message = "Validazione del pagamento non riuscito, riprovare!"
        dispatcher.utter_message(message.decode("ascii", "ignore"))
        return[]


class ActionPaymentReject(Action):

    def name(self):
        return "ActionPaymentReject"

    def run(self, dispatcher, tracker, domain):
        message = "Pagamento annullato!"
        dispatcher.utter_message(message.decode("ascii", "ignore"))
        return[Restarted(timestamp=None)]


class ActionRequestListAccount(Action):

    def name(self):
        return "ActionRequestListAccount"

    def run(self, dispatcher, tracker, domain):
        data = tracker.get_slot('accountList')
        if data is None:
            URL = 'http://' + serverInfo.getIP() + ':' + serverInfo.getPort() + '/ibs-mvc/rest/domain/customers'
            jsessionid = str(tracker.get_slot("jsessionid"))
            xcsrftoken = str(tracker.get_slot("xcsrftoken"))
            cookie = {'JSESSIONID': jsessionid, 'XSRF-TOKEN': xcsrftoken}
            r = requests.get(url=URL, cookies=cookie)
            data = r.json()
        message = "Il tuo conto è: " + data[0]["description"].encode('utf8')
        dispatcher.utter_message(message.decode("ascii", "ignore"))
        return[SlotSet('accountList', value=data, timestamp=None)]


'''
# questa azione del bot servirebbe per ricavarsi la lista dei conti dell'utente, 
# ho disabilitato questa funzionalità dato che per il prototipo usiamo solo l'utente con un solo account bancario 
class ActionRequestTotalAccountValue(Action):

    def name(self):
        return "ActionRequestTotalAccountValue"

    def run(self, dispatcher, tracker, domain):
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
        dispatcher.utter_message(message.decode("ascii", "ignore"))
        return []
'''

class ActionGoodbye(Action):

    def name(self):
        return "ActionGoodbye"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("Ciao, se hai altro da chiedere io sono qui!")
