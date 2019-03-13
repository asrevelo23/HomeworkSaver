//
// Example of a conversation with a menu that loops until explicitly stopped
//



module.exports = function (controller) {

    controller.hears([/^weather/], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {

            var question = "Here are your most important cities:";
            question += "<br/> `1)` Austin, Tx (**Austin**)";
            question += "<br/> `2)` Houston, Tx (**Houston**)";
            question += "<br/> `3)` San Salvador (**Salvador**)";
            question += "<br/> `4)` La Libertad (**Libertad**)";
            question += "\n\nWhat wearher do you want to check?<br/>_(type a number, a **bold keyword** or `stop`)_";
            convo.ask(question, [
                {
                    pattern: "1|Austin|austin",
                    callback: function (response, convo) {
                        convo.gotoThread('menu_1');
                    },
                }
                , {
                    pattern: "2|houston|Houston",
                    callback: function (response, convo) {
                        convo.gotoThread('menu_2');
                    },
                }
                , {
                    pattern: "3|San Salvador|Salvador|salvador",
                    callback: function (response, convo) {
                        convo.gotoThread('menu_3');
                    },
                }
                , {
                    pattern: "4|La Libertad|Libertad|libertad",
                    callback: function (response, convo) {
                        convo.gotoThread('menu_4');
                    },
                }
                , {
                    pattern: "cancel|stop",
                    callback: function (response, convo) {
                        convo.gotoThread('action_cancel');
                    },
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        convo.gotoThread('bad_response');
                    }
                }
            ]);

            // Menu option 1)
            convo.addMessage({
                text: "Lets see how Austin is doing today: now [discover Austin's weather](https://weather.com/weather/today/l/USTX0057:1:US). Be safe!",
                action: 'default'
            }, 'menu_1');

            // Menu option 2)
            convo.addMessage({
                text: "Lets see how HTown is doing today: now [discover Houston's weather](https://weather.com/weather/today/l/USTX0617:1:US). Be safe!",
                action: 'default'
            }, 'menu_2');

            // Menu option 3)
            convo.addMessage({
                text: "Lets see how San Salvador is doing today: now [discover San Salvador's weather](https://weather.com/weather/today/l/ESXX0003:1:ES). Be safe!",
                action: 'default'
            }, 'menu_3');
            
            // Menu option 4)
            convo.addMessage({
                text: "Lets see how San Miguel is doing today: now [discover San Miguel's weather](https://weather.com/weather/today/l/ESXX0007:1:ES). Be safe!",
                action: 'default'
            }, 'menu_4');

            // Cancel
            convo.addMessage({
                text: "Got it, cancelling...",
                action: 'stop', // this marks the converation as unsuccessful
            }, 'action_cancel');

            // Bad response
            convo.addMessage({
                text: "Sorry, I did not understand.",
                action: 'default',
            }, 'bad_response');

        });
    });
};
