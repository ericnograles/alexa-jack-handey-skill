/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');
const ContentfulService = require('./contentful');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Deep Thoughts by Jack Handey',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, tell me a quote about humanity? ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Deep Thoughts About %s.',
            HELP_MESSAGE: "You can ask a question like, tell me a quote about humanity? ... Now, what can I help you with?",
            HELP_REPROMPT: "You can ask a question like, tell me a quote about humanity? ... Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            DEEP_THOUGHTS_REPEAT_MESSAGE: 'Try saying repeat.',
            DEEP_THOUGHTS_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            DEEP_THOUGHTS_NOT_FOUND_WITH_ITEM_NAME: 'a deep thought for %s. ',
            DEEP_THOUGHTS_NOT_FOUND_WITHOUT_ITEM_NAME: 'that subject. ',
            DEEP_THOUGHTS_NOT_FOUND_REPROMPT: 'What else can I help with?',
            DEEP_THOUGHTS_NO_SUBJECT_MATCH: `Hmm, I don't know a deep thought about %s. Here's one you might like ... `
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'JackHandeyIntent': function () {
        // TODO: Verify that we need to do a self reference, e.g. if we lose lexical "this"
        const self = this;
        const subjectSlot = this.event.request.intent.slots.Subject;
        let itemName;
        console.log(subjectSlot);
        if (subjectSlot && subjectSlot.value) {
            itemName = subjectSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);

        console.log('Calling Contentful');
        ContentfulService.deepThoughts()
            .then(deepThoughts => {
                console.log(JSON.stringify(deepThoughts));
                let deepThought = deepThoughts[itemName];
                let noMatch = !deepThought;

                // If we can't find a category match, just pluck a random one
                if (!deepThought && Object.keys(deepThoughts).length > 0) {
                    let categories = Object.keys(deepThoughts);
                    let randomCategoryIndex = Math.floor(Math.random() * (categories.length));
                    deepThought = deepThoughts[categories[randomCategoryIndex]];
                    console.log(`No category match, going to try ${categories[randomCategoryIndex]} in ${JSON.stringify(deepThoughts)} from ${JSON.stringify(categories)}`);
                }

                // Respond back
                if (deepThought) {
                    let index = Math.floor(Math.random() * (deepThought.length));
                    console.log('Getting a deep thought at index ' + index);
                    console.log(`No category match: ${noMatch}`);
                    
                    // Specify if we had match
                    let speechOutput = noMatch && itemName ? self.t('DEEP_THOUGHTS_NO_SUBJECT_MATCH', itemName) + deepThought[index]: deepThought[index];
                    self.attributes.speechOutput = speechOutput;
                    self.attributes.repromptSpeech = self.t('DEEP_THOUGHTS_REPEAT_MESSAGE');
                    self.emit(':askWithCard', speechOutput, self.attributes.repromptSpeech, cardTitle, speechOutput);
                } else {
                    console.log(`Could not find a deepThought for ${itemName} in ${JSON.stringify(deepThoughts)}. Tried ${JSON.stringify(deepThought)}`);
                    let speechOutput = self.t('DEEP_THOUGHTS_NOT_FOUND_MESSAGE');
                    const repromptSpeech = self.t('DEEP_THOUGHTS_NOT_FOUND_REPROMPT');
                    if (itemName) {
                        speechOutput += self.t('DEEP_THOUGHTS_NOT_FOUND_WITH_ITEM_NAME', itemName);
                    } else {
                        speechOutput += self.t('DEEP_THOUGHTS_NOT_FOUND_WITHOUT_ITEM_NAME');
                    }
                    speechOutput += repromptSpeech;

                    self.attributes.speechOutput = speechOutput;
                    self.attributes.repromptSpeech = repromptSpeech;
                    self.emit(':ask', speechOutput, repromptSpeech);
                }
            })
            .catch(error => {
                console.log(`Error accessing Contentful: ${JSON.stringify(error)}`);
                let speechOutput = self.t('DEEP_THOUGHTS_NOT_FOUND_MESSAGE');
                const repromptSpeech = self.t('DEEP_THOUGHTS_NOT_FOUND_REPROMPT');
                if (itemName) {
                    speechOutput += self.t('DEEP_THOUGHTS_NOT_FOUND_WITH_ITEM_NAME', itemName);
                } else {
                    speechOutput += self.t('DEEP_THOUGHTS_NOT_FOUND_WITHOUT_ITEM_NAME');
                }
                speechOutput += repromptSpeech;

                self.attributes.speechOutput = speechOutput;
                self.attributes.repromptSpeech = repromptSpeech;
                self.emit(':ask', speechOutput, repromptSpeech);
            });
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
