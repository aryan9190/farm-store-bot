import config from "../config.json";

import { App as BagApp } from "@hackclub/bag";
import { BlockAction, App as SlackApp } from "@slack/bolt";

// create slack app using socket mode
const slackApp = new SlackApp({
    token: config.SLACK_BOT_TOKEN,
    appToken: config.SLACK_APP_TOKEN,
    socketMode: true
});

let bagApp: BagApp;

// listen for us being pinged
slackApp.event("app_mention", async ({ event, client }) => {
    console.log("Mentioned")
    // send a message to the channel containing our greeting and the items we're selling, as well as a button aying "buy"
    const blocks = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: config.greetingText
            }
        },
        {
            type: "divider"
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: config.itemsToSell.map(item => `*${item.id}*: ${item.price} :-gp:`).join("\n")
            }
        },
        {
            type: "divider"
        },
        {
            type: "actions",
            block_id: "buy_actions",
            elements: [
                {
                    "type": "static_select",
                    "action_id": "item",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select an item to buy"
                    },
                    "options": config.itemsToSell.map(item => ({
                        "text": {
                            "type": "plain_text",
                            "text": `${item.id}: ${item.price} :-gp:`
                        },
                        "value": item.id
                    }))
                },
                {
                    type: "static_select",
                    action_id: "quantity",
                    placeholder: {
                        type: "plain_text",
                        text: "Select a quantity"
                    },
                    "options": [...Array(10).keys()].map(i => ({
                        "text": {
                            "type": "plain_text",
                            "text": `${i + 1}`
                        },
                        "value": `${i + 1}`
                    }))
                },
                {
                    type: "button",
                    action_id: "buy",
                    text: {
                        type: "plain_text",
                        text: `Buy`
                    },
                    value: "buy"
                }
            ]
        }
    ]

    await client.chat.postMessage({
        channel: event.channel,
        blocks: blocks,
        text: `${config.greetingText}\n ${config.itemsToSell.map(item => `*${item.id}*: ${item.price} :-gp:`).join("\n")}`
    });
    console.log(`Message sent in response to user ${event.user} in channel ${event.channel}`)
});


// acknowledge when a user changes the select menus
slackApp.action("item", async ({ ack }) => {
    await ack();
});
slackApp.action("quantity", async ({ ack }) => {
    await ack();
});

// handle when a user clicks the buy button
slackApp.action("buy", async ({ ack, body, client }) => {
    await ack();
    console.log("Buy button clicked")

    if(body.user.id === config.YOUR_USER_ID) {
        await client.chat.postEphemeral({
            channel: body.channel!.id!,
            user: body.user.id,
            text: "You can't buy items from yourself. If you're trying to test the bot, ask a friend to help you out or make an alt account."
        })
        return;
    }

    const values = (body as BlockAction).state?.values.buy_actions;
    if(!values) {
        console.error("No values found. Body:")
        console.error(JSON.stringify(body, null, 2))
        return;
    }
    const itemId = values.item.selected_option?.value
    const quantity = values.quantity.selected_option?.value
    console.log(`User ${body.user.id} wants to buy ${quantity} of item ${itemId}`)
    if(!itemId || !quantity) {
        console.error("Item id or quantity not found. Values: ")
        console.error(JSON.stringify(values, null, 2))
        return;
    }

    const itemPrice = config.itemsToSell.find(item => item.id === itemId)?.price
    if(!itemPrice){
        await client.chat.postEphemeral({
            channel: body.channel!.id!,
            user: body.user.id,
            text: "Item not found."
        })
        console.error(`Item with id ${itemId} not found in config`)
        return;
    }

    // make them an offer via bag
    bagApp.makeOffer({
        sourceIdentityId: config.YOUR_USER_ID,
        targetIdentityId: body.user.id,
        offerToGive: [
            {
                itemName: itemId,
                quantity: parseInt(quantity)
            }
        ],
        offerToReceive: [
            {
                itemName: "gp",
                quantity: itemPrice * parseInt(quantity)
            }
        ],

    })

    // send a message to the user
    await client.chat.postEphemeral({
        channel: body.channel!.id!,
        user: body.user.id,
        text: `Sent you an offer for ${quantity} of item ${itemId} for ${itemPrice * parseInt(quantity)} :-gp:! Check your DMs.`
    })

});

(async () => {
    // connect to Bag
    bagApp = await BagApp.connect({ appId: config.BAG_APP_ID, key: config.BAG_APP_KEY })
    console.log("Connected to Bag")

    // connect to Slack
    await slackApp.start();
    console.log("Connected to Slack")

})();