//
// Simplest use of Botkit's conversation system
//
module.exports = function (controller) {

    controller.hears([/^homework$/], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {
            convo.say('This is a Botkit conversation sample.');

            convo.ask('Do you have any homework due? Enter due date.', function (response, convo) {
                convo.say("Your homework '" + response.text + "' has been saved");
                convo.next();
            });
        });

    });
};
