# coding=utf-8
from rasa_core import utils
from rasa_core.actions import Action
from rasa_core.agent import Agent

class ActionGreetings(Action):
    def name(self):
        return "ActionGreetings"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("Salve, sono BVBot! Come posso aiutare?")
        return []
