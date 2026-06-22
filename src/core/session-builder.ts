// src/core/session-builder.ts
import { CookieJar } from "tough-cookie";
import { UserSessionContext } from "../types";
import { 
  UserIDExtractor,
  MQTTEndpointExtractor,
  AppIDExtractor,
  DeviceIDExtractor,
  ClientIDExtractor,
  CheckpointDetector,
  RegionSelector
} from "./extractors";

export interface SessionBuilder {
  build(html: string, jar: CookieJar): Promise<UserSessionContext>;
}

export class DefaultSessionBuilder implements SessionBuilder {
  constructor(
    private userIDExtractor: UserIDExtractor,
    private mqttExtractor: MQTTEndpointExtractor,
    private appIDExtractor: AppIDExtractor,
    private deviceIDExtractor: DeviceIDExtractor,
    private clientIDExtractor: ClientIDExtractor,
    private checkpointDetector: CheckpointDetector,
    private regionSelector: RegionSelector
  ) {}

  async build(html: string, jar: CookieJar): Promise<UserSessionContext> {
    // Check for checkpoint
    if (this.checkpointDetector.detect(html)) {
      throw new Error("FB Checkpoint detected");
    }

    // Extract user ID
    const cookies = await jar.getCookies('https://www.facebook.com');
    let userID = this.userIDExtractor.extractFromCookies(cookies);
    
    if (!userID) {
      userID = this.userIDExtractor.extractFromHTML(html);
    }

    if (!userID) {
      throw new Error("Failed to retrieve userID");
    }

    // Extract MQTT info
    const mqttResult = this.mqttExtractor.extract(html);
    let region = mqttResult.region || this.regionSelector.select();

    // Extract other identifiers
    const appID = this.appIDExtractor.extract(html);
    const deviceID = this.deviceIDExtractor.extract(html);
    const clientID = this.clientIDExtractor.extract(html);

    // Build context
    return {
      mqttEndpoint: mqttResult.mqttEndpoint,
      region,
      appID,
      userID,
      deviceID,
      clientID,
      sessionID: this.generateSessionID(),
      lastSeqId: mqttResult.irisSeqID,
      firstListen: true,
      loggedIn: true,
      access_token: "NONE",
      clientMutationId: 0,
      mqttClient: undefined,
      syncToken: undefined,
      wsReqNumber: 0,
      wsTaskNumber: 0,
      reqCallbacks: {}
    };
  }

  private generateSessionID(): string {
    return (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1).toString();
  }
}