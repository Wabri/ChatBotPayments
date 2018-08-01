# minimale : base
* startConversation
  - ActionGreetings

# semplice : base
* startConversation
  - ActionGreetings
* thankYou OR endConversation
  - ActionGoodbye

# semplice : richiesta conti
* bankAccountsList
  - ActionRequestListAccount

# semplice : richiesta conti e totale di un account
* bankAccountsList
  - ActionRequestListAccount
* bankAccountTotalValue{"selectedAccount": "11"}
  - ActionRequestTotalAccountValue

# semplice : richiesta conti e totale di un account
* bankAccountsList
  - ActionRequestListAccount
* bankAccountTotalValue
  - ActionRequestTotalAccountValue

# semplice : pagamento confermato
* paymentRequest
  - ActionPaymentTracker
* bankAccountTotalValue{"selectedAccount":"43"}
  - ActionPaymentTracker
* totalValueOfPayment{"valuePayment":"400","currencyPayment":"euro"}
  - ActionPaymentTracker
* paymentRequestToIban{"ibanReceiver":"CH1498866415148361283"}
  - ActionPaymentTracker
