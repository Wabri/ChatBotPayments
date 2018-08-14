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

# richiesta conti e totale di un account
* bankAccountsList
  - ActionRequestListAccount
* bankAccountTotalValue{"selectedAccount": "11"}
  - ActionRequestTotalAccountValue

# richiesta conti e totale di un account
* bankAccountsList
  - ActionRequestListAccount
* bankAccountTotalValue
  - ActionRequestTotalAccountValue

# pagamento confermato
* paymentRequest
  - ActionPaymentTracker
* bankAccountTotalValue{"selectedAccount":"43"}
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
* bankAccountTotalValue{"selectedAccount":"43"}
  - ActionPaymentTracker
* totalValueOfPayment{"valuePayment":"400","currencyPayment":"euro"}
  - ActionPaymentTracker
* paymentRequestToIban{"ibanReceiver":"CH1498866415148361283"}
  - ActionPaymentTracker
* reject
  - ActionPaymentReject
