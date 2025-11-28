from abc import ABC, abstractmethod
from typing import List
from event import Event

class Detector(ABC):
    @abstractmethod
    def fit(self, events: List[Event]):
        pass

    @abstractmethod
    def predict(self, events: List[Event]):
        pass
