//
// Stores a user choice in Botkit 'users' storage, so that the value can be retreived later
//
module.exports = function (controller) {

    controller.hears([/^remember$/], 'direct_message,direct_mention', function (bot, message) {

        // Check if a User preference already exists
        var userId = message.raw_message.actorId;
        controller.remember.users.get(userId, function (err, data) {
            if (err) {
                bot.reply(message, 'could not access homeworks storaged, err: ' + err.message, function (err, message) {
                    bot.reply(message, 'sorry, I am not feeling well \uF613! try again later...');
                });
                return;
            }

            // User preference found
            if (data) {
                // Show user preference
                showUserPreference(controller, bot, message, userId, data.value);
                return;
            }

            // Ask for prefrence
            askForUserPreference(controller, bot, message, userId);
        });
    });
}

function showUserPreference(controller, bot, message, userId, color) {
    bot.startConversation(message, function (err, convo) {

        // [GOOD TO KNOW] Mentions are now failing in 1-1 spaces
        //convo.sayFirst(`Hey, I know you <@personId:${userId}>!<br/> '${color}' is your favorite color.`);
        convo.sayFirst(`Hey, I know have ! **'${homework}'** due soon.`);

        convo.ask("Should I erase your preference? (yes/**no**)", [
            {
                pattern: "^yes|ya|da|si|oui$",
                callback: function (response, convo) {

                    // [WORKAROUND] use storage.users.delete if in-memory storage and storage.users.remove if redis storage
                    controller.remember.users.delete(userId, function (err) {
                        if (err) {
                            // [TODO] Turn into a thread or simply stop the current conversation
                            // convo.say(message, 'sorry, could not access storage, err: ' + err.message);
                            convo.repeat();
                            return;
                        }

                        convo.say("Successfully save your upcoming homework.");
                        convo.next();
                    });

                },
            },
            {
                default: true,
                callback: function (response, convo) {
                    convo.say("Got it, leaving your preference as is.");
                    convo.next();
                }
            }
        ]);
    });
}

function askForUserPreference(controller, bot, message, userId) {
    bot.startConversation(message, function (err, convo) {

        convo.ask("What is your least important homework?", [
            {
                pattern: "^EE316|EE325|EE333T|EE313$",
                callback: function (response, convo) {

                    // Store color as user preference
                    var pickedColor = convo.extractResponse('answer');
                    var userPreference = { id: userId, value: pickedColor };
                    controller.remember.users.save(userPreference, function (err) {
                        if (err) {
                            convo.say(message, 'sorry, could not access homeworks storaged, err: ' + err.message);
                            convo.next();
                            return;
                        }

                        convo.transitionTo("success", "_successfully stored user preference_");
                    });

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
            text: "Sorry, I don't know this color.<br/>_Tip: try blue, green, pink, red or yellow!_",
            action: 'default',
        }, 'bad_response');

        // Success thread
        convo.addMessage(
            "Cool, I'll reming you about '{{responses.answer}}' homework",
            "success");
    });
}
