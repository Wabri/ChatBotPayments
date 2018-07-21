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

## richiesta della lista dei conti
  * startConversation
    - ActionReplyStartConversation
  * bankAccountsList
    - ActionGetBankAccountList
  * thankYou
    - ActionReplyEndConversation

## richiesta del valore di un conto con fine discussione
  * startConversation
    - ActionReplyStartConversation
  * bankAccountsList
    - ActionGetBankAccountList
  * bankAccountTotalValue{"selectedAccount":"0"}
    - ActionGetTotalValueOfBankAccount
  * endConversation
    - ActionReplyEndConversation

## richiesta del valore di un conto con ringraziamento
  * startConversation
    - ActionReplyStartConversation
  * bankAccountsList
    - ActionGetBankAccountList
  * bankAccountTotalValue{"selectedAccount":"0"}
    - ActionGetTotalValueOfBankAccount
  * thankYou
    - ActionReplyEndConversation

## richiesta del valore di un conto senza lista conti con fine discussione
  * startConversation
    - ActionReplyStartConversation
  * bankAccountTotalValue{"selectedAccount":"1"}
    - ActionGetTotalValueOfBankAccount
  * endConversation
    - ActionReplyEndConversation

## richiesta del valore di un conto senza lista conti con ringraziamento
  * startConversation
    - ActionReplyStartConversation
  * bankAccountTotalValue{"selectedAccount":"1"}
    - ActionGetTotalValueOfBankAccount
  * thankYou
    - ActionReplyEndConversation

## richiesta di pagamento con conferma verso iban senza lista dei conti con fine discussione
  * startConversation
    - ActionReplyStartConversation
  * paymentRequest
    - ActionAccountInfoRequest
  * bankAccountTotalValue{"selectedAccount":"1"}
    - ActionAccountSelection
  * totalValueOfPayment{"valuePayment":"300", "currencyPayment":"franchi svizzeri"}
    - ActionAccountReciver
  * paymentRequestToIban{"ibanReceiver":"CH1498866415148361283"}
    - ActionSummaryConfirmationRequest
  * confirm
    - ActionSummaryPayment
  * endConversation
    - ActionReplyEndConversation

## richiesta di pagamento con rifiuto verso iban senza lista dei conti con fine discussione
  * startConversation
    - ActionReplyStartConversation
  * paymentRequest
    - ActionAccountInfoRequest
  * bankAccountTotalValue{"selectedAccount":"9"}
    - ActionAccountSelection
  * totalValueOfPayment{"valuePayment":"10", "currencyPayment":"euro"}
    - ActionAccountReciver
  * paymentRequestToIban{"ibanReceiver":"IT40U0300203280425587676546"}
    - ActionSummaryConfirmationRequest
  * reject
    - ActionSummaryPayment
  * endConversation
    - ActionReplyEndConversation

## richiesta di pagamento con conferma verso iban senza lista dei conti con ringraziamento
  * startConversation
    - ActionReplyStartConversation
  * paymentRequest
    - ActionAccountInfoRequest
  * bankAccountTotalValue{"selectedAccount":"5"}
    - ActionAccountSelection
  * totalValueOfPayment{"valuePayment":"200", "currencyPayment":"euro"}
    - ActionAccountReciver
  * paymentRequestToIban{"ibanReceiver":"IT48G0300203280236662722766"}
    - ActionSummaryConfirmationRequest
  * confirm
    - ActionSummaryPayment
  * thankYou
    - ActionReplyEndConversation

## richiesta di pagamento con rifiuto verso iban senza lista dei conti con ringraziamento
  * startConversation
    - ActionReplyStartConversation
  * paymentRequest
    - ActionAccountInfoRequest
  * bankAccountTotalValue{"selectedAccount":"7"}
    - ActionAccountSelection
  * totalValueOfPayment{"valuePayment":"1000", "currencyPayment":"franchi svizzeri"}
    - ActionAccountReciver
  * paymentRequestToIban{"ibanReceiver":"CH5738657659731827735"}
    - ActionSummaryConfirmationRequest
  * reject
    - ActionSummaryPayment
  * thankYou
    - ActionReplyEndConversation
