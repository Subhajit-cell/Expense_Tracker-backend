import os
from dotenv import load_dotenv

from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI

from service.Expense import Expense


class LLMService:

    def __init__(self):

        load_dotenv()

        self.prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert extraction algorithm. "
                "Extract transaction data from bank SMS. "
                "Return null if unknown."
            ),
            ("human", "{text}")
        ]
        )

        self.apiKey = os.getenv("MISTRAL_API_KEY")

        self.llm = ChatMistralAI(
            api_key=self.apiKey,
            model="mistral-large-latest",
            temperature=0
        )

        self.runnable = self.prompt | self.llm.with_structured_output(Expense)


    def runLLM(self, message):

        return self.runnable.invoke({
            "text": message
        })