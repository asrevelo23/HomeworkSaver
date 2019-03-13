//
// Simplest use of Botkit's conversation system
//
module.exports = function (controller) {

    controller.hears([/^start/], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {
            convo.say('This is a Botkit conversation sample.');

            convo.ask('Do you have any homework due?.', function (response, convo) {
                convo.say("I can remind you about your '" + response.text + "' homework. Please type **menu** to see all my options.");
                convo.next();
            });
        });

    });
};
