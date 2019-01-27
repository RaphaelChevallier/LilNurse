// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const fetch = require("node-fetch");
const rp = require('request-promise');
const moment = require ('moment');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome to Little Nurse, which helps keep track of your medication. You can ask me about your pills, or say "Help"';
        return handlerInput.responseBuilder
            .speak(speechText)
            // .speak('Please check the Alexa app to grant this skill permission to set reminders.')
            // .withAskForPermissionsConsentCard(['alexa::alerts:reminders:skill:readwrite'])
            // .withShouldEndSession(true)
            .reprompt()
            .getResponse();
    }
};
const SetReminderHandler = {
   canHandle(handlerInput) {
       return handlerInput.requestEnvelope.request.type === 'IntentRequest'
           && handlerInput.requestEnvelope.request.intent.name === 'SetReminders';
   },
   async handle(handlerInput) {

       console.log("hello");
       const token = handlerInput.requestEnvelope.context.System.apiAccessToken;

       let success = await saveReminder(handlerInput);

       if(success === 'OK') {
           return handlerInput.responseBuilder
           .speak("Reminder was set!")
           //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
           .getResponse();
       }
       else {
            return handlerInput.responseBuilder
            .speak('Please check the Alexa app to grant this skill permission to set reminders.')
            .withAskForPermissionsConsentCard(['alexa::alerts:reminders:skill:readwrite'])
            .withShouldEndSession(true)
            .getResponse();
       }
   }
};

function saveReminder(handlerInput) {
   //setMedReminder(handlerInput);

     const alert = {};
     const event = handlerInput.requestEnvelope;
     const timezone = 'America/Los_Angeles';

        //getmedicationTime returns the start time of the
        //medication  in Pacific time
       // GET MEDICATION TIME HERE getMedication()
       //const time = moment().utc().local().add(1, 'm');//.calendar();
       const time = moment().local().subtract(8, 'h').add(1, 'm');

        console.log(time);

         // Lop off trailing Z from string
         let start = time.toISOString();
         if (start.substring(start.length - 1) === 'Z') {
           start = start.substring(0, start.length - 1);
         }



      //Set locale to English so recurrence.byDay is properly set
         moment.locale('en');
         alert.requestTime = start;
         alert.trigger = {
           type: 'SCHEDULED_ABSOLUTE',
           scheduledTime: start,
           timeZoneId: timezone,
           recurrence: {
             freq: 'WEEKLY',
             byDay: [moment(time).format('dd').toUpperCase()],
           },
         };
         alert.alertInfo = {
           spokenInfo: {
             content: [{
               locale: event.request.locale,
               text: 'It\'s time to take your medicine! When you are ready say "ask little nurse for my prescriptions".',
             }],
           },
         };
         alert.pushNotification = {
           status: 'ENABLED',
};

   const params = {
       url: event.context.System.apiEndpoint + '/v1/alerts/reminders',
       method: 'POST',
       headers: {
       'Authorization': 'Bearer ' + event.context.System.apiAccessToken,
                },
        json: alert,
   };
   console.log(params);

   return rp(params).then((body) => {
       // Reminder was set OK
       console.log('SetReminder alert: ' + JSON.stringify(body));
       return 'OK';
   })
   .catch((err) => {
       console.log('SetReminder error ' + err.error.code);
       console.log('SetReminder alert: ' + JSON.stringify(alert));
      return handlerInput.responseBuilder
      .speak('Please check the Alexa app to grant this skill permission to set reminders.')
      .withAskForPermissionsConsentCard(['alexa::alerts:reminders:skill:readwrite'])
      .withShouldEndSession(true)
      .getResponse();
       
   });

}
const ThanksIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'thanks';
    },
    handle(handlerInput) {
        const speechText = 'I <emphasis level="strong">got</emphasis> you fam!';
        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hello World!';
        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const AllPrescriptionsIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AllPrescriptions';
    },
    async handle(handlerInput) {
        const token = handlerInput.requestEnvelope.context.System.apiAccessToken;
        //const userID = "567823" //Homer Simpson
        const userID = "12345"; //Jason Bourne
        //const userID = "23489"; //Patrick Star
        const url = "https://hwhackslilnurse.azurewebsites.net/findUser?user=" + userID ;
        const res = await fetch(url);
        const data = await res.json();
        
        var medications = "";
        var count = 0;
        for(var i = 0; i < Object.keys(data).length; i++){
            medications += data[i].quantity + " of " + data[i].medName + ". ";
            count++;
        }
        var header = "You have " + count + " prescriptions. ";
        if (count === 0) {
            header = "You have no prescriptions. ";
        }else if (count === 1) {
            header = "You have one prescription. ";
        }
        
        const speechText = header + medications;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt()
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can ask me things like - what are my pills for dinner? - or - list out all my medications. ';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const RepeatIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent';
    },
    handle(handlerInput) {
        //const speechText = this.attributes.lastMsg;
        const speechText = "no."
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'sheeeesh... okay.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

const GetMedicineIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GetMedicine';
    },
    async handle(handlerInput) {
        console.log(handlerInput.requestEnvelope.request.intent);//printInten object
        //console.log(JSON.stringify(handlerInput.requestEnvelope.session.context.System));
        // console.log(handlerInput.requestEnvelope.context.System.apiAccessToken);
        // console.log(JSON.stringify(handlerInput.requestEnvelope.context.System));
        //ping database//
        //const url = "https://14e41a3d-0c6b-461b-af4f-2f1338abc54a.mock.pstmn.io/1";
        const time = handlerInput.requestEnvelope.request.intent.slots.currentTime.value;
        //console.log(time);
        var upperbound = 0;
        var lowerbound = 0;
        var meal;
        /*
        Times   Keyword                 Scaled - 4 
        4-10 breakfast/morning/dawn -> 0 - 6
        11-16 lunch/afternoon/tea/midday -> 7 - 12
        17-22 dinner/dusk/evening -> 13 - 18
        23-3 night/bed/midnight/supper 19 - 23
        */
        switch (time) {
            case "morning":
            case "dawn":
            case "breakfast":
                upperbound = 6;
                lowerbound = 0;
                meal = "breakfast";
                break;
            case "lunch":
            case "tea":
            case "noon":
            case "midday":
                upperbound = 12;
                lowerbound = 7;
                meal = "lunch";
                break;
            case "dinner":
            case "evening":
            case "dusk":
                upperbound = 18;
                lowerbound = 13;
                meal = "dinner";
                break;
            case "night":
            case "bed":
            case "midnight":
            case "supper":
                upperbound = 23;
                lowerbound = 19;
                meal = "supper";
                break;
        }
        console.log(time);
        console.log(meal);
        
        const token = handlerInput.requestEnvelope.context.System.apiAccessToken;
        const userID = "12345"; //one lunch one dinner
        //const userID = "23489"; //two at the same time
        const url = "https://hwhackslilnurse.azurewebsites.net/findUser?user=" + userID ;
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        //const jsonObject = JSON.parse(data);
        //console.log(jsonObject.msg);
        var medications = "";
        var count = 0;
        for(var i = 0; i < Object.keys(data).length;i++){
            console.log(JSON.stringify(data[i]));
            let scaledTime = (parseInt(data[i].dosage) - 4) % 24;
            if (scaledTime <= upperbound && scaledTime >= lowerbound) { //if within meal time
                if (((upperbound + lowerbound) / 2 ) - scaledTime < 0) {
                    var before = " after ";
                }else{
                    before = " before ";
                }
                var instructions = data[i].specialInstructions;
                if (data[i].specialInstructions === 'none') {
                    instructions = " ";
                }
                
                medications += "Take " + data[i].quantity + " of " + data[i].medName + before + meal + ". " + instructions;
                count++;
            }
            
        }
        var header = "You have " + count + " prescriptions for " + meal + ". ";
        if (count === 0) {
            header = "You have no prescriptions for "+ meal + ". ";
        }else if (count === 1) {
            header = "You have one prescription for "+ meal + ". ";
        }
        //console.log(jsonObject);
        //console.log(data.msg);
        const speechText = header + medications;
        //this.attributes.lastMsg=speechText;
        return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt('')
        .getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SetReminderHandler,
        AllPrescriptionsIntentHandler,
        HelloWorldIntentHandler,
        GetMedicineIntentHandler,
        HelpIntentHandler,
        RepeatIntentHandler,
        ThanksIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
