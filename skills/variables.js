//
// Threaded conversation where variables are set to store user choices
//
module.exports = function (controller) {

    controller.hears([/^variables$/], "direct_message,direct_mention", function (bot, message) {

        bot.startConversation(message, function (err, convo) {

            convo.ask("What is your least important homework?", [
                {
                    pattern: "^EE316|EE313|EE325|EE333T|EE422C$",
                    callback: function (response, convo) {
                        convo.gotoThread("confirm_choice");
                    },
                },
                {
                    default: true,
                    callback: function (response, convo) {
                        convo.gotoThread('bad_response');
                    }
                }
            ], { key: "answer" });


            // Bad response
            convo.addMessage({
                text: "Sorry, I don't know this class.<br/>_Tip: try EE316, EE422C, EE333T, EE313 or EE325!_",
                action: 'default',
            }, 'bad_response');

            // Confirmation thread
            convo.addMessage(
                "You picked '{{responses.answer}}'",
                "confirm_choice");

            convo.addQuestion("Please, confirm your choice ? (yes|no)", [
                {
                    pattern: "^yes|hey|oui|si|da$",
                    callback: function (response, convo) {
                        var pickedColor = convo.extractResponse('answer');
                        convo.setVar("color", pickedColor);
                        convo.gotoThread("success");
                    },
                },
                {
                    default: true,
                    callback: function (response, convo) {
                        convo.transitionTo("default", "Got it, let's try again...");
                    }
                }
            ], {}, "confirm_choice");

            // Success thread
            convo.addMessage(
                "I will remind you about your '{{vars.color}}' homework",
                "success");
        });
    });
};
