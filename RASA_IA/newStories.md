# minimale : base
* startConversation
  - ActionReplyStartConversation
> check_start_conversation

## conversazione : base
> check_start_conversation
* thankYou OR endConversation
  - ActionReplyEndConversation

## minimale : richiesta conti
> check_start_conversation
* bankAccountsList
  - ActionGetBankAccountList
* endConversation OR thankYou
  - ActionReplyEndConversation

## minimale senza errori : richiesta valore conto
> check_start_conversation
* bankAccountTotalValue{"selectedAccount": "11"}
  - ActionGetTotalValueOfBankAccount
* endConversation OR thankYou
  - ActionReplyEndConversation

## minimale senza errori : pagamento confermato
> check_start_conversation
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
* endConversation OR thankYou
  - ActionReplyEndConversation

## minimale senza errori : pagamento rifiutato
> check_start_conversation
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
* endConversation OR thankYou
  - ActionReplyEndConversation
