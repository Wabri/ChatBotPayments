# minimale : base
* startConversation
  - ActionGreetings

# semplice : base
* startConversation
  - ActionGreetings
* thankYou OR endConversation
  - ActionGoodbye

# richiesta conti
* bankAccountsList
  - ActionRequestListAccount
  
# pagamento confermato
* paymentRequest
  - ActionPaymentTracker
* totalValueOfPayment{"valuePayment":"400","currencyPayment":"euro"}
  - ActionPaymentTracker
* paymentRequestToIban{"ibanReceiver":"CH1498866415148361283"}
  - ActionPaymentTracker
* confirm
  - ActionPaymentConfermation

# pagamento rifiutato
* paymentRequest
  - ActionPaymentTracker
* totalValueOfPayment{"valuePayment":"400","currencyPayment":"euro"}
  - ActionPaymentTracker
* paymentRequestToIban{"ibanReceiver":"CH1498866415148361283"}
  - ActionPaymentTracker
* reject
  - ActionPaymentReject
