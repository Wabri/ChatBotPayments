## banale botta e risposta
  * startConversation
    - ActionReplyStartConversation
  * endConversation
    - ActionReplyEndConversation

## richiesta della lista dei conti
  * startConversation
    - ActionReplyStartConversation
  * bankAccountsList
    - ActionGetBankAccountList
  * endConversation
    - ActionReplyEndConversation

## richiesta del valore di un conto
  * startConversation
    - ActionReplyStartConversation
  * bankAccountsList
    - ActionGetBankAccountList
  * bankAccountTotalValue{"selectedAccount":"0"}
    - ActionGetTotalValueOfBankAccount
  * endConversation
    - ActionReplyEndConversation

## richiesta del valore di un conto senza lista conti
  * startConversation
    - ActionReplyStartConversation
  * bankAccountTotalValue{"selectedAccount":"1"}
    - ActionGetTotalValueOfBankAccount
  * endConversation
    - ActionReplyEndConversation
