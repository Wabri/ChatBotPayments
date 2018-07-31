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

## minimale con errori : richiesta valore conto
> check_start_conversation
* bankAccountTotalValue
  - ActionMissunderstanding
* bankAccountTotalValue{"selectedAccount": "45"}
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

## minimale senza errori (livello 0) : pagamento confermato
> check_start_conversation
* paymentRequest
  - ActionAccountInfoRequest
* bankAccountTotalValue                               <!-- errore livello 0 -->
  - ActionMissunderstanding
* bankAccountTotalValue{"selectedAccount":"87"}
  - ActionAccountSelection
* totalValueOfPayment{"valuePayment":"123","currencyPayment":"franchi svizzeri"}
  - ActionAccountReciver
* paymentRequestToIban{"ibanReceiver":"CH1498866415148361283"}
  - ActionSummaryConfirmationRequest
* confirm
  - ActionSummaryPayment
* endConversation OR thankYou
  - ActionReplyEndConversation

## minimale con errori (livello 1) : pagamento confermato
> check_start_conversation
* paymentRequest
  - ActionAccountInfoRequest
* bankAccountTotalValue
  - ActionMissunderstanding
* bankAccountTotalValue{"selectedAccount":"43"}
  - ActionAccountSelection
* totalValueOfPayment                                 <!-- errore livello 1 -->
  - ActionMissunderstanding
* totalValueOfPayment{"currencyPayment":"franchi"}    <!-- errore livello 1 -->
  - ActionMissunderstanding
* totalValueOfPayment{"valuePayment":"765"}           <!-- errore livello 1 -->
  - ActionMissunderstanding
* totalValueOfPayment{"valuePayment":"765","currencyPayment":"franchi"}
  - ActionAccountReciver
* paymentRequestToIban{"ibanReceiver":"CH1498866415148361283"}
  - ActionSummaryConfirmationRequest
* confirm
  - ActionSummaryPayment
* endConversation OR thankYou
  - ActionReplyEndConversation

## minimale con errori (livello 2) : pagamento confermato
> check_start_conversation
* paymentRequest
  - ActionAccountInfoRequest
* bankAccountTotalValue{"selectedAccount":"67"}
  - ActionAccountSelection
* totalValueOfPayment{"valuePayment":"400","currencyPayment":"euro"}
  - ActionAccountReciver
* paymentRequestToIban                              <!-- errore livello 2 -->
  - ActionMissunderstanding
* paymentRequestToIban{"ibanReceiver":"IT06U0300203280575372477655"}
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
