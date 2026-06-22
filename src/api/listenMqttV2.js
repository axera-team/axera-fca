//@ts-nocheck
"use strict";
import mqtt from 'mqtt';
import websocket from 'websocket-stream';
import EventEmitter from 'node:events';
import { HttpsProxyAgent } from 'https-proxy-agent';

import { formatID, parseDelta, parseAndCheckLogin, generatePresence, getType, Logger } from '../utils/index';

const logger = new Logger({ scope: "MQTT Listener", color: 'retro' });

class ListenMQTTError extends Error {
    constructor(message, originalError) {
        super(message);
        this.originalError = originalError;
    }
}

 class MessageEmitter extends EventEmitter {
    stop() {
        globalCallback = () => {};
        if (reconnectInterval) {
            clearTimeout(reconnectInterval);
            reconnectInterval = null;
        }
        if (ctx.mqttClient) {
            ctx.mqttClient.end();
            ctx.mqttClient = undefined;
        }
        this.emit('stop');
    }
}

class MQTTUtils {
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    static getRandomReconnectTime() {
        const min = 26 * 60 * 1000;
        const max = 60 * 60 * 1000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static calculate(previousTimestamp, currentTimestamp){
        return Math.floor(previousTimestamp + (currentTimestamp - previousTimestamp) + 300);
    }

    static markAsRead(ctx, api, threadID) {
        if (ctx.globalOptions.autoMarkRead && threadID) {
            api.markAsRead(threadID, (err) => {
                if (err) logger.error("autoMarkRead", err);
            });
        }
    }
}

class MQTTListener {
    static topics = [
        "/legacy_web", "/webrtc", "/rtc_multi", "/onevc", "/br_sr", "/sr_res",
        "/t_ms", "/thread_typing", "/orca_typing_notifications", "/notify_disconnect",
        "/orca_presence", "/inbox", "/mercury", "/messaging_events",
        "/orca_message_notifications", "/pp", "/webrtc_response"
    ];

    constructor(defaultFuncs, api, ctx) {
        this.messageEmitter = new MessageEmitter();

        this.form = {};
        this.getSeqID = null;
        this.globalCallback = (error, message) => {
            if (error) return msgEmitter.emit("error", error);
            if (message.type === "message" || message.type === "message_reply") {
                markAsRead(ctx, api, message.threadID);
            }
            msgEmitter.emit("message", message);
        };
        this.reconnectInterval = null;

        this.defaultFuncs = defaultFuncs;
        this.api = api;
        this.ctx = ctx;
    }

    async getSeqID() {
        try {
            this.form = {
                "queries": JSON.stringify({
                    "o0": {
                        "doc_id": "3336396659757871",
                        "query_params": {
                            "limit": 1,
                            "before": null,
                            "tags": ["INBOX"],
                            "includeDeliveryReceipts": false,
                            "includeSeqID": true
                        }
                    }
                })
            };

            const resData = await this.defaultFuncs.post({
                url: "https://www.facebook.com/api/graphqlbatch/", 
                context: this.ctx,
                form: this.form
            });

            console.dir({ intercept: resData.body });
            await parseAndCheckLogin(ctx, defaultFuncs)(resData);
            if (getType(resData) != "Array" || (resData.error && resData.error !== 1357001)) throw resData;

            this.ctx.lastSeqId = resData[0].o0.data.viewer.message_threads.sync_sequence_id;

            this.listenMqtt(defaultFuncs, api, ctx, globalCallback);
        } catch (err) {
            return this.globalCallback(new ListenMQTTError("Failed to get sequence ID. This is often caused by an invalid appstate. Please try generating a new appstate.json file.", err));
        }
    };

    async listenMqtt(defaultFuncs, api, ctx, globalCallback) {
        const region = ctx.region;
        const foreground = false;
        const sessionID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1;
        const cid = ctx.clientID;

        const username = {
            u: ctx.userID,
            s: sessionID,
            chat_on: true,
            fg: foreground,
            d: cid,
            ct: 'websocket',
            aid: ctx.mqttAppID,
            mqtt_sid: '',
            cp: 3,
            ecp: 10,
            st: [],
            pm: [],
            dc: '',
            no_auto_fg: true,
            gas: null,
            pack: [],
            a: ctx.globalOptions.userAgent
        };
        const cookies = ctx.jar.getCookiesSync('https://www.facebook.com').join('; ');

        let host;
        const domain = "wss://edge-chat.messenger.com/chat";
        if (region) {
            host = `${domain}?region=${region.toLowerCase()}&sid=${sessionID}&cid=${cid}`;
        } else {
            host = `${domain}?sid=${sessionID}&cid=${cid}`;
        }

        logger.debug("Connecting to MQTT with new IDs...", host);

        const options = {
            clientId: 'mqttwsclient',
            protocolId: 'MQIsdp',
            protocolVersion: 3,
            username: JSON.stringify(username),
            clean: true,
            wsOptions: {
                headers: {
                    'Cookie': cookies,
                    'Origin': 'https://www.messenger.com',
                    'User-Agent': username.a,
                    'Referer': 'https://www.messenger.com/',
                    'Host': new URL(host).hostname
                },
                origin: 'https://www.messenger.com',
                protocolVersion: 13,
                binaryType: 'arraybuffer'
            },
            keepalive: 10,
            reschedulePings: true,
            connectTimeout: 60000,
            reconnectPeriod: 1000
        };

        if (ctx.globalOptions.proxy) options.wsOptions.agent = new HttpsProxyAgent(ctx.globalOptions.proxy);

        const mqttClient = new mqtt.Client(_ => websocket(host, options.wsOptions), options);
        mqttClient.publishSync = mqttClient.publish.bind(mqttClient);
        mqttClient.publish = (topic, message, opts = {}, callback = () => {}) => new Promise((resolve, reject) => {
                mqttClient.publishSync(topic, message, opts, (err, data) => {
                if (err) {
                    callback(err);
                    reject(err);
                }
                callback(null, data);
                resolve(data);
            });
        });
        ctx.mqttClient = mqttClient;
        
        mqttClient.on('error', (err) => {
            logger.error("listenMqtt", err);
            mqttClient.end();
            if (ctx.globalOptions.autoReconnect) getSeqID();
            else globalCallback({ type: "stop_listen", error: "Connection refused" });
        });

        mqttClient.on('connect', async () => {
            topics.forEach(topic => mqttClient.subscribe(topic));
            const queue = { sync_api_version: 10, max_deltas_able_to_process: 1000, delta_batch_size: 500, encoding: "JSON", entity_fbid: ctx.userID };
            let topic;
            if (ctx.syncToken) {
                topic = "/messenger_sync_get_diffs";
                queue.last_seq_id = ctx.lastSeqId;
                queue.sync_token = ctx.syncToken;
            } else {
                topic = "/messenger_sync_create_queue";
                queue.initial_titan_sequence_id = ctx.lastSeqId;
                queue.device_params = null;
            }
            logger.info(`Successfully connected to MQTT.`);
            const { name: botName = "Facebook User", uid = ctx.userID } = await api.getBotInitialData();
            logger.info(`Hello, ${botName} (${uid})`);
            mqttClient.publish(topic, JSON.stringify(queue), { qos: 1, retain: false });
        });

        let presenceInterval;
        if (ctx.globalOptions.updatePresence) {
            presenceInterval = setInterval(() => {
                if (mqttClient.connected) {
                    const presencePayload = generatePresence(ctx.userID);
                    mqttClient.publish('/orca_presence', JSON.stringify({ "p": presencePayload }), (err) => {
                        if (err) {
                            logger.error("Failed to send presence update:", err);
                        }
                    });
                }
            }, 50000);
        }

        mqttClient.on('message', async (topic, message, _packet) => {
            try {
                const jsonMessage = JSON.parse(message.toString());
                //const packet = JSON.parse(_packet.payload.toString());
                if (topic === "/t_ms") {
                    if (jsonMessage.lastIssuedSeqId){
                        ctx.lastSeqId = parseInt(jsonMessage.lastIssuedSeqId);
                    }
                    if (jsonMessage.deltas) {
                        for (const delta of jsonMessage.deltas) {
                            parseDelta(defaultFuncs, api, ctx, globalCallback, { delta });
                        }
                    }
                } else if (topic === "/thread_typing" || topic === "/orca_typing_notifications") {
                    const typ = {
                        type: "typ",
                        isTyping: !!jsonMessage.state,
                        from: jsonMessage.sender_fbid.toString(),
                        threadID: formatID((jsonMessage.thread || jsonMessage.sender_fbid).toString())
                    };
                    globalCallback(null, typ);
                }
            } catch (ex) {
                logger.error("listenMqtt: onMessage", ex);
            }
        });
    }

    async run(callback) {
        if (typeof callback === 'function') {
            this.globalCallback = callback;
        }

        if (!ctx.firstListen || !ctx.lastSeqId) {
            await this.getSeqID();
        } else {
            this.listenMqtt(this.defaultFuncs, this.api, this.ctx, this.globalCallback);
        }

        this.ctx.firstListen = false;

        const scheduleReconnect = () => {
            if (this.reconnectInterval) return;
            const time = MQTTUtils.getRandomReconnectTime();
            logger.info(`Scheduled reconnect in ${Math.floor(time / 60000)} minutes...`);
            this.reconnectInterval = setTimeout(() => {
                logger.info(`Reconnecting MQTT with new clientID...`);
                if (this.ctx.mqttClient) this.ctx.mqttClient.end(true);
                this.ctx.clientID = MQTTUtils.generateUUID();
                this.listenMqtt(defaultFuncs, api, ctx, globalCallback);
                scheduleReconnect();
            }, time);
        }

        scheduleReconnect();

        return msgEmitter;
    }
}

/**
 * 
 * @param {ReturnType<import('../types').ApiClient['getApiClient']>} defaultFuncs 
 * @param {*} api 
 * @param {*} ctx 
 * @returns 
 */
module.exports = (defaultFuncs, api, ctx) => {
    const mqttListener = new MQTTListener(defaultFuncs, api, ctx);
    return (callback) => mqttListener.run(callback);
};