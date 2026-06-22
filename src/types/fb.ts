/**
 * Facebook user data containing authentication and profile information
 */
export interface CurrentUserInitialData {
  /**
   * Facebook Account ID (same as User ID)
   * @example
   * { ACCOUNT_ID: "100054768578341" }
   */
  ACCOUNT_ID: string;
  /**
   * Facebook User ID
   * @example
   * { USER_ID: "100054768578341" }
   */
  USER_ID: string;
  /**
   * Full Name of Account
   * @example 
   * { NAME: "Axera Team" }
   */
  NAME: string;
  /**
   * First Name of Account
   * @example
   * { SHORT_NAME: "Axera" }
   */
  SHORT_NAME: string;
  IS_BUSINESS_PERSON_ACCOUNT: boolean;
  HAS_SECONDARY_BUSINESS_PERSON: boolean;
  IS_FACEBOOK_WORK_ACCOUNT: boolean;
  IS_INSTAGRAM_BUSINESS_PERSON: boolean;
  IS_WABA_BUSINESS_PERSON: boolean;
  IS_MESSENGER_ONLY_USER: boolean;
  IS_DEACTIVATED_ALLOWED_ON_MESSENGER: boolean;
  IS_MESSENGER_CALL_GUEST_USER: boolean;
  IS_WORK_MESSENGER_CALL_GUEST_USER: boolean;
  IS_WORKROOMS_USER: boolean;
  /**
   * Facebook App ID
   * @example 
   * { APP_ID: "2220391788200892" }
   */
  APP_ID: string;
  IS_BUSINESS_DOMAIN: boolean;
}

/**
 * User's Analytics Data Collected by Meta
 */
export interface AnalyticsCoreData {
  /** 
   * @example
   * {
   *   "device_id": "fd.ARsfdgXZ4Xqk0dhaiJDmY9LsrRnYrXPP_eu55KKV6ixjG1AjV..."
   * }
   */
  device_id: string;
  /**
   * Facebook App ID
   * @example 
   * { app_id: "2220391788200892" }
   */
  app_id: string;
  /**
   * Facebook App Version
   * @example 
   * { app_version: "1036.907.157.0 (1036907157)" }
   */
  app_version: string;
  enable_bladerunner: true;
  enable_ack: true;
  /**
   * Push Phase
   * @example 
   * { push_phase: "C3" }
   */
  push_phase: string;
  enable_observer: false;
  enable_cmcd_observer: false;
  enable_dataloss_timer: false;
  enable_fallback_for_br: true;
  queue_activation_experiment: false;
  /** Default Value: 60000 */
  max_delay_br_queue: number;
  /** Default Value: 3 */
  max_delay_br_queue_immediate: number;
  /** Default Value: 3000 */
  max_delay_br_init_not_complete: number;
  consents: {};
  /** Default Value: 1 */
  app_universe: number;
  br_stateful_migration_on: true;
  enable_non_fb_br_stateless_by_default: false;
  use_falco_as_mutex_key: false;
  is_intern: false;
  identity: {
    fbIdentity: {
      /**
       * User ID of the Account (actorId)
       * @example "100054768578341"
       */
      actorId: string;
      /**
       * User ID of the Account (accountId)
       * @example "100054768578341"
       */
      accountId: string
    };
    /**
     * Claim Signature
     * @example "hmac_ttl.1775784956.AR2GdhgYHGD2Y..."
     */
    claim: string;
  };
  /** @example "fase.ARv_M6po6jbYHTY-RhZG38hp.. long string" */
  state_for_br: string;
  /** 
   * @example
   * 
    [
      "comet_metrics_viewable_impression",
      "web_time_spent_bit_array",
      "web_time_spent_navigation",
      "cloud_gaming_events",
      "cloud_gaming_session_event",
    ]
   *
   */
  stateful_events_list_for_br: string[];
}

interface MqttWebConfig {
  fbid: string;
  appID: number;
  endpoint: string;
  pollingEndpoint: string;
  subscribedTopics: any[];
  /** default: 10 */
  capabilities: number;
  /** default: 3 */
  clientCapabilities: number;
  chatVisibility: boolean;
  hostNameOverride: string;
}

interface MessengerWebRegion {
  regionNullable: string;
}

interface ServerAppID {
  app_id: `${number}`;
}

interface MqttWebDeviceID {
  clientID: string;
}

/** Yo! */
export interface ConfigTypeMap {
  /** BRO! */
  CurrentUserInitialData: CurrentUserInitialData;
  AnalyticsCoreData: AnalyticsCoreData;
  MqttWebConfig: MqttWebConfig;
  MessengerWebRegion: MessengerWebRegion;
  ServerAppID: ServerAppID;
  MqttWebDeviceID: MqttWebDeviceID;
}