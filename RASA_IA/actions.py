# coding=utf-8
from rasa_core.domain import TemplateDomain

from rasa_core.actions import Action
from rasa_core.events import SlotSet
from rasa_core.events import Restarted

class ActionGreeting(Action):
    def name(self):
        return "ActionGreeting"

    def run(self,dispatcher, tracker, domain):
        dispatcher.utter_message("Ciao (action saluta)")
        return []
