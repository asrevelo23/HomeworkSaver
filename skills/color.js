//
// Simplest use of Botkit's conversation system
//
module.exports = function (controller) {

    controller.hears([/^start/], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {
            convo.say('This is a Botkit conversation sample.');

            convo.ask('What homework do you have due?', function (response, convo) {
                convo.say("I can remind you about your '" + response.text + "' homework! Please type **help** to see al my functions.");
                convo.next();
            });
        });

    });
};

