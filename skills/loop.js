//
// Example of a conversation with a menu that loops until explicitly stopped
//
module.exports = function (controller) {

    controller.hears([/^loop$/], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {

            var question = "Here are a few school tips:";
            question += "<br/> `1)` How to handle stress (**stress**)";
            question += "<br/> `2)` How to become a good test-taker (**test**)";
            question += "<br/> `3)` check Upcoming Events at UT (**events**)";
            question += "\n\nWhat do you want to check?<br/>_(type a number, a **bold keyword** or `stop`)_";
            convo.ask(question, [
                {
                    pattern: "1|stress|Stress",
                    callback: function (response, convo) {
                        convo.gotoThread('menu_1');
                    },
                }
                , {
                    pattern: "2|test|taker|test-taker",
                    callback: function (response, convo) {
                        convo.gotoThread('menu_2');
                    },
                }
                , {
                    pattern: "3|event|express",
                    callback: function (response, convo) {
                        convo.gotoThread('menu_3');
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
                text: "Sorry to hear that you are stressed: now [discover how to handle it](https://www.learnpsychology.org/student-stress-anxiety-guide/) online, and keep working hard...",
                action: 'default'
            }, 'menu_1');

            // Menu option 2)
            convo.addMessage({
                text: "Good taske-takers follow this instructions. [the learnings tracks](https://www.floridacareercollege.edu/blog/study-tips-to-become-a-better-test-taker) and become the best in your class!",
                action: 'default'
            }, 'menu_2');

            // Menu option 3)
            convo.addMessage({
                text: "Nothing's like meeting in person at a conference, training or a hackathon. Check the list of [DevNet events](https://calendar.utexas.edu/).",
                action: 'default'
            }, 'menu_3');

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
