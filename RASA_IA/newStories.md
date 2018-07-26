## conversazione : base 1
* startConversation
  - ActionReplyStartConversation
* thankYou
  - ActionReplyThankYou

## conversazione : base 2
* startConversation
  - ActionReplyStartConversation
* endConversation
  - ActionReplyEndConversation

## minimale : richiesta conti
  * bankAccountsList
  - ActionGetBankAccountList

## conversazione : richiesta conti 1
* startConversation
  - ActionReplyStartConversation
* bankAccountsList
  - ActionGetBankAccountList
* endConversation
  - ActionReplyEndConversation

## conversazione : richiesta conti 2
* startConversation
  - ActionReplyStartConversation
* bankAccountsList
  - ActionGetBankAccountList
* thankYou
  - ActionReplyThankYou

## minimale : richiesta valore conto
  * bankAccountTotalValue{"selectedAccount": "11"}
  - ActionGetTotalValueOfBankAccount

## conversazione : richiesta valore conto 1
* startConversation
  - ActionReplyStartConversation
* bankAccountTotalValue{"selectedAccount":"0"}
  - ActionGetTotalValueOfBankAccount
* endConversation
  - ActionReplyEndConversation

## conversazione : richiesta valore conto 2
* startConversation
  - ActionReplyStartConversation
* bankAccountTotalValue{"selectedAccount":"32"}
  - ActionGetTotalValueOfBankAccount
* thankYou
  - ActionReplyThankYou

## minimale : richiesta lista conti e richiesta valore conto
* bankAccountsList
  - ActionGetBankAccountList
* bankAccountTotalValue{"selectedAccount":"33"}
  - ActionGetTotalValueOfBankAccount

## conversazione : richiesta lista conti e richiesta valore conto 1
* startConversation
  - ActionReplyStartConversation
* bankAccountsList
  - ActionGetBankAccountList
* bankAccountTotalValue{"selectedAccount":"5"}
  - ActionGetTotalValueOfBankAccount
* endConversation
  - ActionReplyEndConversation

## conversazione : richiesta lista conti e richiesta valore conto 2
* startConversation
  - ActionReplyStartConversation
* bankAccountsList
  - ActionGetBankAccountList
* bankAccountTotalValue{"selectedAccount":"15"}
  - ActionGetTotalValueOfBankAccount
* thankYou
  - ActionReplyThankYou

## minimale : pagamento confermato
* paymentRequest
  - ActionAccountInfoRequest
* bankAccountTotalValue{"selectedAccount":"43"}
  - ActionAccountSelection
* totalValueOfPayment{"valuePayment":"400","currencyPayment":"euro"}
  - ActionAccountReciver
* paymentRequestToIban{"ibanReceiver":"CH1498866415148361283"}
  - ActionSummaryConfirmationRequest
* confirm
  - ActionSummaryPayment

## conversazione : richiesta di pagamento confermato 1
* startConversation
  - ActionReplyStartConversation
* paymentRequest
  - ActionAccountInfoRequest
* bankAccountTotalValue{"selectedAccount":"1"}
  - ActionAccountSelection
* totalValueOfPayment{"valuePayment":"15","currencyPayment":"franchi svizzeri"}
  - ActionAccountReciver
* paymentRequestToIban{"ibanReceiver":"CH5738657659731827735"}
  - ActionSummaryConfirmationRequest
* confirm
  - ActionSummaryPayment
* endConversation
  - ActionReplyEndConversation

## conversazione : richiesta di pagamento confermato 2
* startConversation
  - ActionReplyStartConversation
* paymentRequest
  - ActionAccountInfoRequest
* bankAccountTotalValue{"selectedAccount":"3"}
  - ActionAccountSelection
* totalValueOfPayment{"valuePayment":"1000","currencyPayment":"franchi"}
  - ActionAccountReciver
* paymentRequestToIban{"ibanReceiver":"FR1130066968176977944812348"}
  - ActionSummaryConfirmationRequest
* confirm
  - ActionSummaryPayment
* thankYou
  - ActionReplyThankYou

## minimale : pagamento rifiutato
* paymentRequest
  - ActionAccountInfoRequest
* bankAccountTotalValue{"selectedAccount":"88"}
  - ActionAccountSelection
* totalValueOfPayment{"valuePayment":"10","currencyPayment":"franchi"}
  - ActionAccountReciver
* paymentRequestToIban{"ibanReceiver":"IT40U0300203280425587676546"}
  - ActionSummaryConfirmationRequest
* reject
  - ActionPaymentRejected

## conversazione : richiesta di pagamento rifiutato 1
* startConversation
  - ActionReplyStartConversation
* paymentRequest
  - ActionAccountInfoRequest
* bankAccountTotalValue{"selectedAccount":"99"}
  - ActionAccountSelection
* totalValueOfPayment{"valuePayment":"33","currencyPayment":"euro"}
  - ActionAccountReciver
* paymentRequestToIban{"ibanReceiver":"FR4430066747193565343922864"}
  - ActionSummaryConfirmationRequest
* confirm
  - ActionSummaryPayment
* endConversation
  - ActionReplyEndConversation

## conversazione : richiesta di pagamento confermato 2
* startConversation
  - ActionReplyStartConversation
* paymentRequest
  - ActionAccountInfoRequest
* bankAccountTotalValue{"selectedAccount":"31"}
  - ActionAccountSelection
* totalValueOfPayment{"valuePayment":"300","currencyPayment":"franchi"}
  - ActionAccountReciver
* paymentRequestToIban{"ibanReceiver":"CH1949497933486292448"}
  - ActionSummaryConfirmationRequest
* confirm
  - ActionSummaryPayment
* thankYou
  - ActionReplyThankYou
