class MessagesUtil:

    def isBankSms(self, message):

        keywords = [
            "debited",
            "credited",
            "spent",
            "rs",
            "inr",
            "card"
        ]

        message = message.lower()

        for word in keywords:

            if word in message:
                return True

        return False