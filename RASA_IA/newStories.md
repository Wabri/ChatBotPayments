## conversazione base 1 : saluto, fine conversazione
* startConversation
  - ActionReplyStartConversation
* thankYou
  - ActionReplyThankYou

## conversazione base 2 : saluto, fine conversazione
* startConversation
  - ActionReplyStartConversation
* endConversation
  - ActionReplyEndConversation

## conversazione media 1 : saluto, richiesta conti, fine conversazione
* startConversation
  - ActionReplyStartConversation
* bankAccountsList
  - ActionGetBankAccountList
* endConversation
  - ActionReplyEndConversation

## conversazione media 2 : saluto, richiesta conti, fine conversazione
* startConversation
  - ActionReplyStartConversation
* bankAccountsList
  - ActionGetBankAccountList
* thankYou
  - ActionReplyThankYou

## conversazione minima 1 : richiesta conti
* bankAccountsList
  - ActionGetBankAccountList
