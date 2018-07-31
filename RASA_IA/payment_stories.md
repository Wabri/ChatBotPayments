# minimale : base
* startConversation
  - ActionGreetings
> check_start_conversation

## conversazione : base
> check_start_conversation
* thankYou OR endConversation
  - ActionGoodbye

## minimale : richiesta conti
> check_start_conversation
  - ActionGreetings
* bankAccountsList
  - ActionRequestListAccount
* endConversation OR thankYou
  - ActionGoodbye

## minimale senza errori : pagamento confermato
> check_start_conversation
* paymentRequest
  - ActionPaymentTracker
* bankAccountTotalValue{"selectedAccount":"43"}
  - ActionPaymentTracker
* totalValueOfPayment{"valuePayment":"400","currencyPayment":"euro"}
  - ActionPaymentTracker
* paymentRequestToIban{"ibanReceiver":"CH1498866415148361283"}
  - ActionPaymentTracker
* endConversation OR thankYou
  - ActionGoodbye
