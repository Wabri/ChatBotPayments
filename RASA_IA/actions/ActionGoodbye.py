# coding=utf-8
import requests
from rasa_core import utils
from rasa_core.actions import Action
from rasa_core.agent import Agent
from rasa_core.channels.console import ConsoleInputChannel
from rasa_core.events import SlotSet
from rasa_core.featurizers import (
    MaxHistoryTrackerFeaturizer,
    BinarySingleStateFeaturizer)
import json

class ActionGoodbye(Action):
    def name(self):
        return "ActionGoodbye"

    def run(self,dispatcher,tracker,domain):
        dispatcher.utter_message("Ciao, se hai altro da chiedere io sono qui!")
