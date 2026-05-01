interface ServerAppID {
  app_id: "2220391788200892";
}
interface UJLCometConfig {
  enabledUseCases: {};
  autoStartUseCases: [];
  autoEndUseCases: [];
}
interface WebBloksVersioningID {
  versioningID: "ffa98ae2b9b0ee7550fe316efcb87fcc5ae987d69dbe0f8fadf9cbc84c0722c7";
}

interface LSPlatformDGWHostnameOverride {
  useHostNameOverride: false;
  hostNameOverride: null;
}
interface DGWWebConfig {
  appId: "2220391788200892";
  appVersion: "0";
  dgwVersion: "2";
  endpoint: "";
  fbId: "100054303594421";
  authType: "";
}

interface CometFeedTailLoadBufferHeight {
  EXCELLENT: 2570;
  GOOD: 2933;
  MODERATE: 3227;
  POOR: 4948;
}

interface MRequestConfig {
  dtsg: {
    token: "NAfs4pZoF32mwChCz96nfDN1WtSHkJJLg3L9o2IS_-6pjZeFQVItXoA:38:1771302979";
    valid_for: 86400;
    expire: 1775754357;
  };
  dtsg_ag: {
    token: "Ad2V6EEseLxhnmKhEf0unn4Ldxh9O_zdDuiooCPqW8CjGioC:38:1771302979";
    valid_for: 604800;
    expire: 1776272757;
  };
  checkResponseOrigin: true;
  checkResponseToken: true;
  cleanFinishedRequest: false;
  cleanFinishedPrefetchRequests: false;
  ajaxResponseToken: {
    secret: "dpB_PiruCKI3JgE6640VTockVk5WlWB6";
    encrypted: "AYwAyKfuNGLLW2Ai1uu7ESPxGSoYpSE21kx_GjqNDZADBXs5QDPNi5-78JzTZ2W5oHs93_elpqbZO4-yuMCJU8ibT-Fs1ZKYteI";
  };
}

interface MessengerWebRegion {
  regionNullable: "PRN";
}
interface MqttWebConfig {
  fbid: "100054303594421";
  appID: 219994525426954;
  endpoint: "wss:\/\/edge-chat.facebook.com\/chat?region=prn";
  pollingEndpoint: "https:\/\/edge-chat.facebook.com\/mqtt\/pull?region=prn";
  subscribedTopics: [];
  capabilities: 10;
  clientCapabilities: 3;
  chatVisibility: false;
  hostNameOverride: "";
}

interface CurrentUserInitialData {
  ACCOUNT_ID: string;
  USER_ID: string;
  NAME: string;
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
  APP_ID: string | "2220391788200892";
  IS_BUSINESS_DOMAIN: boolean;
}

interface DTSGInitialData {
  token: string;
}
interface LSD {
  token: string;
}
interface ServerNonce {
  ServerNonce: string;
}

interface SiteData {
  server_revision: number;
  client_revision: number;
  push_phase: "C3";
  pkg_cohort: string | "HCSV2:comet_pkg";
  haste_session: string | "20551.HCSV2:comet_pkg.2.1...0";
  pr: number | 1;
  manifest_base_uri: string | "https:\/\/static.xx.fbcdn.net";
  manifest_origin: string | "facebook";
  manifest_version_prefix: string | "hcsv2";
  be_one_ahead: boolean;
  is_rtl: boolean;
  is_experimental_tier: boolean;
  is_jit_warmed_up: boolean;
  hsi: string;
  semr_host_bucket: string | "6";
  bl_hash_version: string | 2;
  comet_env: string | 15;
  wbloks_env: boolean;
  /** Current route the fb user is in (feed, friend's profile, account settings, etc),
   * @description a good example is `CometProfileTimelineListViewRoute` which is FB's timeline.
   */
  ef_page: string;
  compose_bootloads: boolean;
  spin: number;
  /** @description A random ten digit number like `1036907157` */
  __spin_r: number;
  /** @description It's still unclear what this is, but it usually has a value of `trunk` */
  __spin_b: string | "trunk";
  /** @description A random ten digit number like `1775667956` */
  __spin_t: number;
  /** @description The Virtual IP address of a Facebook/Meta server in a specific region. 
   * @example 
   ```markdown
    A load-balanced public-facing IP that represents a server cluster.
    When you connect to something like:

    ** Facebook, Inc.
    ** Meta Platforms Ireland Limited

    You’re not connecting to one physical server.

    You’re connecting to:
        Client → DNS → VIP (Virtual IP) → Load Balancer → One of many backend servers
    
    Example: `57.144.228.1` is geolocated in the PH then goes to Load Balancer then a backend cluster of Meta somewhere in Ireland.
   ```
   */
  vip: string;
}

interface SprinkleConfig {
  param_name: "jazoest";
  version: 2;
  should_randomize: false;
}

interface JSErrorLoggingConfig {
  appId: 2220391788200892;
  extra: [];
  reportInterval: 50;
  sampleWeight: null;
  sampleWeightKey: "__jssesw";
  projectBlocklist: [];
}

interface DTSGInitData {
  token: "NAfs4pZoF32mwChCz96nfDN1WtSHkJJLg3L9o2IS_-6pjZeFQVItXoA:38:1771302979";
  async_get_token: "Ad2V6EEseLxhnmKhEf0unn4Ldxh9O_zdDuiooCPqW8CjGioC:38:1771302979";
}

interface UriNeedRawQuerySVConfig {
  uris: [
    "dms.netmng.com",
    "doubleclick.net",
    "r.msn.com",
    "watchit.sky.com",
    "graphite.instagram.com",
    "www.kfc.co.th",
    "learn.pantheon.io",
    "www.landmarkshops.in",
    "www.ncl.com",
    "s0.wp.com",
    "www.tatacliq.com",
    "bs.serving-sys.com",
    "kohls.com",
    "lazada.co.th",
    "xg4ken.com",
    "technopark.ru",
    "officedepot.com.mx",
    "bestbuy.com.mx",
    "booking.com",
    "nibio.no",
    "myworkdayjobs.com",
    "united-united.com",
    "gcc.gnu.org",
  ];
}

interface WebConnectionClassServerGuess {
  connectionClass: "EXCELLENT" | "GOOD" | "MODERATE" | "POOR";
}

interface BootloaderEndpointConfig {
  retryEnabled: false;
  debugNoBatching: false;
  maxBatchSize: -1;
  endpointURI: "https:\/\/www.facebook.com\/ajax\/bootloader-endpoint\/";
  adsManagerReadRegions: false;
}

interface MAWGK {"armadillo_web_debug_logging":false,"armadillo_web_process_futureproof":false,"armadillo_web_test_gk":false,"msgr_reaction_thread_bump_dogfooding":false}

interface IntlCurrentLocale {
  code: "en_US";
}
interface RelayAPIConfigDefaults {
  accessToken: "";
  actorID: "100054303594421";
  customHeaders: {};
  enableNetworkLogger: false;
  enableVerboseNetworkLogger: false;
  fetchTimeout: 30000;
  graphURI: "\/api\/graphql\/";
  retryDelays: [1000, 3000];
  useXController: true;
  xhrEncoding: null;
  subscriptionTopicURI: null;
  withCredentials: false;
  isProductionEndpoint: false;
  workRequestTaggingProduct: null;
  encryptionKeyParams: null;
  graphBatchURI: "\/api\/graphqlbatch\/";
}
interface WebDriverConfig {
  isTestRunning: false;
  isJestE2ETestRun: false;
  isXRequestConfigEnabled: false;
  auxiliaryServiceInfo: {};
  testPath: null;
  originHost: null;
  experiments: null;
}

interface ServerTimeData {
  serverTime: 1775667957109;
  timeOfRequestStart: 1775667956727.5;
  timeOfResponseStart: 1775667957105.3;
}

interface CookieDomain {
  domain: "facebook.com";
}

interface IntlVariationHoldout {
  disable_variation: false;
}

interface CometUrlTransformsConfig {
  should_remove_trailing_slash: true;
}

interface IntlNumberTypeProps {
  module: { __m: "IntlCLDRNumberType05" };
}

interface JSSelfProfilerTrackedInteractions {
  interactions: [
    { action: "*"; tracePolicy: "*" },
    { action: "*"; tracePolicy: "*" },
  ];
}

interface NewsRegulationErrorMessageData {
  errorCodeToRegType: { "2216007": "c18"; "2216012": "coppa" };
  learnMoreLink: {
    regulated_user: "https:\/\/www.facebook.com\/help\/787040499275067";
    user: "https:\/\/www.facebook.com\/help\/2579891418969617";
  };
  appealLinks: {
    c18: "https:\/\/www.facebook.com\/help\/contact\/419859403337390";
  };
}

interface MWJewelEntrypoint {
  entrypoint: "RESTORE_OR_PIN_UPSELL";
}
interface CometRouterConfig {
  bulkRouteFetchBatchSize: 15;
}

interface FBFamilyCenterCometUserCapabilities {
  is_supervised_or_in_cooldown: false;
  is_teen_account: false;
}

interface WorkerConfig {
  worker: "shared";
}
interface ZenonApp {
  isSocialPlugin: false;
}
interface ClickIDURLPrefixBlocklistSVConfig {
  block_list_url_prefix: [
    "https:\/\/facebook.csod.com\/",
    "https:\/\/fb.zoom.us\/",
    "https:\/\/bluejeans.com\/premium-numbers",
    "https:\/\/tinyurl.com\/3hakpctd",
    "https:\/\/stecu.short.gy\/zqp5ir",
    "https:\/\/sn.tg-need.com\/EaXp6M",
    "https:\/\/tinyurl.com\/csvjk5sx",
    "https:\/\/tinyurl.com\/mpu3p59x",
    "https:\/\/tinyurl.com\/z47xusj",
    "https:\/\/sinarabadi.xyz\/M01McZ",
    "http:\/\/tinyurl.com\/3hakpctd",
    "http:\/\/stecu.short.gy\/zqp5ir",
    "http:\/\/sn.tg-need.com\/EaXp6M",
    "http:\/\/tinyurl.com\/csvjk5sx",
    "http:\/\/tinyurl.com\/mpu3p59x",
    "http:\/\/tinyurl.com\/z47xusj",
    "http:\/\/sinarabadi.xyz\/M01McZ",
  ];
}

interface CookieCoreConfig {
  alsfid: { s: "Lax" };
  c_user: { t: 31536000; s: "None" };
  cppo: { t: 86400; s: "None" };
  dpr: { t: 604800; s: "None" };
  fbl_st: { t: 31536000; s: "Strict" };
  hckd: { s: "None" };
  i_user: { t: 31536000; s: "None" };
  locale: { t: 604800; s: "None" };
  m_ls: { t: 34560000; s: "None" };
  m_pixel_ratio: { t: 604800; s: "None" };
  noscript: { s: "None" };
  presence: { t: 2592000; s: "None" };
  sfau: { s: "None" };
  usida: { s: "None" };
  vpd: { t: 5184000; s: "Lax" };
  wd: { t: 604800; s: "Lax" };
  wl_cbv: { t: 7776000; s: "None" };
  "x-referer": { s: "None" };
  "x-src": { t: 1; s: "None" };
}
interface CurrentEnvironment {
  facebookdotcom: boolean;
  messengerdotcom: boolean;
  workplacedotcom: boolean;
  instagramdotcom: boolean;
  workdotmetadotcom: boolean;
  horizondotmetadotcom: boolean;
  developersdotmetadotcom: boolean;
  devicemanagerdotmetadotcom: boolean;
}

interface DateFormatConfig {
  numericDateOrder: ["m", "d", "y"];
  numericDateSeparator: "\/";
  shortDayNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  narrowDayNames: ["M", "T", "W", "T", "F", "S", "S"];
  timeSeparator: ":";
  weekStart: 6;
  formats: {
    D: "D";
    "D g:ia": "D g:ia";
    "D M d": "D M d";
    "D M d, Y": "D M d, Y";
    "D M j": "D M j";
    "D M j, g:ia": "D M j, g:ia";
    "D M j, y": "D M j, y";
    "D M j, Y g:ia": "D M j, Y g:ia";
    "D, M j, Y": "D, M j, Y";
    "F d": "F d";
    "F d, Y": "F d, Y";
    "F g": "F g";
    "F j": "F j";
    "F j, Y": "F j, Y";
    "F j, Y \u0040 g:i A": "F j, Y \u0040 g:i A";
    "F j, Y g:i a": "F j, Y g:i a";
    "F jS": "F jS";
    "F jS, g:ia": "F jS, g:ia";
    "F jS, Y": "F jS, Y";
    "F Y": "F Y";
    "g A": "g A";
    "g:i": "g:i";
    "g:i A": "g:i A";
    "g:i a": "g:i a";
    "g:iA": "g:iA";
    "g:ia": "g:ia";
    "g:ia F jS, Y": "g:ia F jS, Y";
    "g:iA l, F jS": "g:iA l, F jS";
    "g:ia M j": "g:ia M j";
    "g:ia M jS": "g:ia M jS";
    "g:ia, F jS": "g:ia, F jS";
    "g:iA, l M jS": "g:iA, l M jS";
    "g:sa": "g:sa";
    "H:I - M d, Y": "H:I - M d, Y";
    "h:i a": "h:i a";
    "h:m:s m\/d\/Y": "h:m:s m\/d\/Y";
    j: "j";
    "l F d, Y": "l F d, Y";
    "l g:ia": "l g:ia";
    "l, F d, Y": "l, F d, Y";
    "l, F j": "l, F j";
    "l, F j, Y": "l, F j, Y";
    "l, F jS": "l, F jS";
    "l, F jS, g:ia": "l, F jS, g:ia";
    "l, M j": "l, M j";
    "l, M j, Y": "l, M j, Y";
    "l, M j, Y g:ia": "l, M j, Y g:ia";
    "M d": "M d";
    "M d, Y": "M d, Y";
    "M d, Y g:ia": "M d, Y g:ia";
    "M d, Y ga": "M d, Y ga";
    "M j": "M j";
    "M j, Y": "M j, Y";
    "M j, Y g:i A": "M j, Y g:i A";
    "M j, Y g:ia": "M j, Y g:ia";
    "M jS, g:ia": "M jS, g:ia";
    "M Y": "M Y";
    "M y": "M y";
    "m-d-y": "m-d-y";
    "M. d": "M. d";
    "M. d, Y": "M. d, Y";
    "j F Y": "j F Y";
    "m.d.y": "m.d.y";
    "m\/d": "m\/d";
    "m\/d\/Y": "m\/d\/Y";
    "m\/d\/y": "m\/d\/y";
    "m\/d\/Y g:ia": "m\/d\/Y g:ia";
    "m\/d\/y H:i:s": "m\/d\/y H:i:s";
    "m\/d\/Y h:m": "m\/d\/Y h:m";
    n: "n";
    "n\/j": "n\/j";
    "n\/j, g:ia": "n\/j, g:ia";
    "n\/j\/y": "n\/j\/y";
    Y: "Y";
    "Y-m-d": "Y-m-d";
    "Y\/m\/d": "Y\/m\/d";
    "y\/m\/d": "y\/m\/d";
    "j \/ F \/ Y": "j \/ F \/ Y";
  };
  ordinalSuffixes: {
    "1": "st";
    "2": "nd";
    "3": "rd";
    "4": "th";
    "5": "th";
    "6": "th";
    "7": "th";
    "8": "th";
    "9": "th";
    "10": "th";
    "11": "th";
    "12": "th";
    "13": "th";
    "14": "th";
    "15": "th";
    "16": "th";
    "17": "th";
    "18": "th";
    "19": "th";
    "20": "th";
    "21": "st";
    "22": "nd";
    "23": "rd";
    "24": "th";
    "25": "th";
    "26": "th";
    "27": "th";
    "28": "th";
    "29": "th";
    "30": "th";
    "31": "st";
  };
}

interface IntlPhonologicalRules {
  meta: { "\/_B\/": "([.,!?\\s]|^)"; "\/_E\/": "([.,!?\\s]|$)" };
  patterns: {
    "\/\u0001(.*)('|&#039;)s\u0001(?:'|&#039;)s(.*)\/": "\u0001$1$2s\u0001$3";
    "\/_\u0001([^\u0001]*)\u0001\/": "javascript";
  };
}
interface IntlViewerContext {
  GENDER: 1;
  regionalLocale: null;
}
interface NumberFormatConfig {
  decimalSeparator: ".";
  numberDelimiter: ",";
  minDigitsForThousandsSeparator: 4;
  standardDecimalPatternInfo: { primaryGroupSize: 3; secondaryGroupSize: 3 };
  numberingSystemData: null;
}
interface UserAgentData {
  browserArchitecture: "64";
  browserFullVersion: "146.0.0.0";
  browserMinorVersion: 0;
  browserName: "Chrome";
  browserVersion: 146;
  deviceName: "Unknown";
  engineName: "Blink";
  engineVersion: "146.0.0.0";
  platformArchitecture: "64";
  platformName: "Windows";
  platformVersion: "10";
  platformFullVersion: "10";
}
type ZeroCategoryHeader = Record<string, any>; // this is just {} when in desktop..
interface CookieCoreLoggingConfig {
  maximumIgnorableStallMs: 16.67;
  sampleRate: 9.7e-5;
  sampleRateClassic: 1.0e-10;
  sampleRateFastStale: 1.0e-8;
}
interface WebDevicePerfClassData {
  deviceLevel: "mod-high";
  yearClass: null;
}

/** This is very interesting.. (WebLoomConfig) */
interface WebLoomConfig {
  adaptive_config: {
    interactions: {
      modules: {
        "455": 1;
        "467": 1;
        "744": 1;
        "980": 1;
        "2543": 1;
        "6797": 1;
        "12149": 1;
      };
      events: {
        "1056839232": 1;
        "29818881.comet.auth_platform.afad": 1.6;
        "29818881.comet.caa.account_recovery.account_search": 3.8;
        "29818881.comet.error": 16.2;
        "29818881.comet.event.public.about": 1.3;
        "29818881.comet.friending.suggestions": 3.1;
        "29818881.comet.gaming.games.play": 5.5;
        "29818881.comet.group": 37.8;
        "29818881.comet.group.about": 1.2;
        "29818881.comet.group.permalink": 12.2;
        "29818881.comet.home": 640.7;
        "29818881.comet.marketplace.composer": 4;
        "29818881.comet.marketplace.composer.create": 2.5;
        "29818881.comet.marketplace.composer.edit": 2.8;
        "29818881.comet.marketplace.home": 11.1;
        "29818881.comet.marketplace.item": 20.5;
        "29818881.comet.marketplace.search": 2.8;
        "29818881.comet.marketplace.sellerhub": 2.8;
        "29818881.comet.marketplace.you.selling": 3.7;
        "29818881.comet.mediaviewer.photo": 29.7;
        "29818881.comet.messenger.inbox": 38.4;
        "29818881.comet.pc.policy": 2;
        "29818881.comet.post.single_dialog": 93.8;
        "29818881.comet.profile.collection.photos": 1.2;
        "29818881.comet.profile.collection.reels_tab": 13.5;
        "29818881.comet.profile.contextual_profile": 4.5;
        "29818881.comet.profile.logged_out": 5.7;
        "29818881.comet.profile.plus_logged_out": 39.8;
        "29818881.comet.profile.timeline.list": 160.9;
        "29818881.comet.reels.home": 10.7;
        "29818881.comet.reels.unified.player": 41.4;
        "29818881.comet.search_results.default_tab": 5.3;
        "29818881.comet.settings.landing_page": 7.4;
        "29818881.comet.stories.viewer": 2.1;
        "29818881.comet.watch.injection": 18.4;
        "29818881.comet.watch.live.injection": 1.7;
        "29818881.public_chat_share_to_feed": 2.4;
        "29818881.two_step_verification.pre_authentication": 19.1;
        "29818881.two_step_verification.two_factor_login": 3.8;
        "29818881.two_step_verification.two_factor_login.remember_browser": 2;
        "29818882.comet.ActivityLog.CometActivityLogMainContentRoute": 4.3;
        "29818882.comet.birthday": 2.4;
        "29818882.comet.caa_account_recovery.code_entry": 1.4;
        "29818882.comet.caa_account_recovery.initiate_view": 2.6;
        "29818882.comet.event.public.about": 3;
        "29818882.comet.friending": 7.4;
        "29818882.comet.friending.friendrequests": 5;
        "29818882.comet.friending.suggestions": 17.1;
        "29818882.comet.gaming.games": 4.3;
        "29818882.comet.gaming.games.play": 9.2;
        "29818882.comet.group": 69.3;
        "29818882.comet.group.about": 1.1;
        "29818882.comet.group.media.photos": 2.9;
        "29818882.comet.groups.feed": 4.2;
        "29818882.comet.groups.pending_posts": 1.1;
        "29818882.comet.home": 842.8;
        "29818882.comet.marketplace.composer": 4.9;
        "29818882.comet.marketplace.composer.create": 3.3;
        "29818882.comet.marketplace.composer.edit": 2.7;
        "29818882.comet.marketplace.home": 69.6;
        "29818882.comet.marketplace.item": 64.6;
        "29818882.comet.marketplace.rentals": 1.1;
        "29818882.comet.marketplace.search": 57.3;
        "29818882.comet.marketplace.sellerProfileDialog": 4.6;
        "29818882.comet.marketplace.sellerhub": 2.4;
        "29818882.comet.marketplace.you.selling": 7.2;
        "29818882.comet.mediaviewer.photo": 1059.5;
        "29818882.comet.mediaviewer.video": 9.6;
        "29818882.comet.memories": 4.9;
        "29818882.comet.messenger.inbox": 116.8;
        "29818882.comet.most_recent_feed": 2;
        "29818882.comet.post.single_dialog": 425.9;
        "29818882.comet.profile.collection.about": 8.3;
        "29818882.comet.profile.collection.directory_personal_details": 1.2;
        "29818882.comet.profile.collection.followers": 1.6;
        "29818882.comet.profile.collection.friends": 8.9;
        "29818882.comet.profile.collection.friends_all": 1.5;
        "29818882.comet.profile.collection.photos": 62.1;
        "29818882.comet.profile.collection.photos_albums": 3.1;
        "29818882.comet.profile.collection.photos_by": 8.6;
        "29818882.comet.profile.collection.reels_tab": 13;
        "29818882.comet.profile.content.insights": 1.2;
        "29818882.comet.profile.contextual_profile": 12.3;
        "29818882.comet.profile.media_set": 5.9;
        "29818882.comet.profile.plus_logged_out": 4.3;
        "29818882.comet.profile.professional_dashboard": 2.3;
        "29818882.comet.profile.timeline.list": 244;
        "29818882.comet.reels.home": 3.4;
        "29818882.comet.reels.tab": 10.9;
        "29818882.comet.reels.unified.player": 101.4;
        "29818882.comet.save.saveDashboard": 3.8;
        "29818882.comet.search_results.default_tab": 67.1;
        "29818882.comet.search_results.entity_scoped": 8.7;
        "29818882.comet.sharedmediaviewer.media": 15.9;
        "29818882.comet.stories.create": 1.2;
        "29818882.comet.stories.viewer": 45.7;
        "29818882.comet.videos.tahoe": 4.5;
        "29818882.comet.watch.injection": 5.1;
        "30605340.comet.group": 18.1;
        "30605354.comet.app": 812.5;
        "30605360.comet.profile.timeline.list": 10.1;
        "30605361.cds.dialog.confirmation": 2.6;
        "30605361.comet.composer.feed": 8.7;
        "30605361.comet.composer.group": 19.1;
        "30605361.comet.composer.profile": 11.5;
        "30605361.comet.composer.shareFeedToFeed": 4.1;
        "30605361.comet.dialog.BirthdayCometTodaysBirthdaysDialog.react": 4.9;
        "30605361.comet.dialog.CAAFetaAYMHPasswordDialog.react": 21.1;
        "30605361.comet.dialog.CAAFetaAYMHRemoveDialog.react": 1.3;
        "30605361.comet.dialog.CometComposerSaveAsDraftDialog.react": 1.1;
        "30605361.comet.dialog.CometEditFeedComposerDialog.react": 4.2;
        "30605361.comet.dialog.CometFocusedStoryDialogViewRoot.react": 4.3;
        "30605361.comet.dialog.CometIXTFacebookContentTriggerRoot.react": 1.4;
        "30605361.comet.dialog.CometLoggedOutPopupCTA.react": 7.4;
        "30605361.comet.dialog.CometMediaViewerDeleteConfirmationDialog.react": 2.1;
        "30605361.comet.dialog.CometMessengerResharesUpdatedDialog.react": 1.3;
        "30605361.comet.dialog.CometOnBeforeUnloadDialog.react": 5;
        "30605361.comet.dialog.CometPrivacySelectorDialog.react": 3.2;
        "30605361.comet.dialog.CometSaveSelectCollectionDialog.react": 4.4;
        "30605361.comet.dialog.CometUFIReactionsDialog.react": 18.9;
        "30605361.comet.dialog.CometUnifiedShareSheetDialog.react": 54;
        "30605361.comet.dialog.FDSConfirmationDialogImpl.react": 25.9;
        "30605361.comet.dialog.MWChatForwardDialog.react": 3.6;
        "30605361.comet.dialog.MarketplaceBuyLocationDialog.react": 1.6;
        "30605361.comet.dialog.MarketplaceYourListingDialog.react": 2.7;
        "30605361.comet.dialog.ProfileCometDirectoryAuthenticityModal.react": 4;
        "30605361.comet.dialog.ProfileCometDirectoryPostClickDialog.react": 1.8;
        "30605361.comet.dialog.WhatsAppCometPagesComposerInterceptionDialog.react": 2.4;
        "30605361.comet.emojipicker": 3.9;
        "30605361.comet.feed.story.menu": 40.9;
        "30605361.comet.jewel.megamenu": 4.8;
        "30605361.comet.jewel.messenger": 334.3;
        "30605361.comet.jewel.notification": 232.8;
        "30605361.comet.jewel.settings": 77.8;
        "30605361.comet.popover.CometActivityLogActionMenu.react": 5.4;
        "30605361.comet.popover.CometHomeChatSettings.react": 4.2;
        "30605361.comet.popover.CometMarketplaceYouFeedCardMoreMenu.react": 5.2;
        "30605361.comet.popover.CometNotificationsActionsMenu.react": 2.5;
        "30605361.comet.popover.CometNotificationsDropdownMenuContainer.react": 7.7;
        "30605361.comet.popover.CometSaveSavableMoreActionsMenu.react": 1.9;
        "30605361.comet.popover.CometStickerPickerCard.react": 2.2;
        "30605361.comet.popover.CometUFICommentMenu.react": 6.5;
        "30605361.comet.popover.CometUFICommentRenderingIntentSelectorMenu.react": 20.1;
        "30605361.comet.popover.CometUFIEmojiPickerPopoverForLexical.react": 5;
        "30605361.comet.popover.CometUFIShareActionLinkMenu.react": 9.1;
        "30605361.comet.popover.CometVerificationBadgeInfoPopover.react": 22.3;
        "30605361.comet.popover.FDSTabMenu.react": 6.6;
        "30605361.comet.popover.FriendingCometFriendListItemMoreMenu.react": 33.3;
        "30605361.comet.popover.GroupsCometFeedSortingSwitcherMenu.react": 1.8;
        "30605361.comet.popover.GroupsCometMoreActionMenu.react": 1.2;
        "30605361.comet.popover.MWChatReactionsMenu.react": 73.7;
        "30605361.comet.popover.MWThreadListHoverButtonDropdownMenu.react": 10.5;
        "30605361.comet.popover.MWV2ComposerEmojiPickerForJSResource": 17.9;
        "30605361.comet.popover.MWV2ContextualActionsMenu.react": 77.3;
        "30605361.comet.popover.MWV2HeaderSettingsMenu.react": 15.4;
        "30605361.comet.popover.MarketplaceComposerCategoryDropdown.react": 4.8;
        "30605361.comet.popover.ProfileCometActiveFriendMenu.react": 4.5;
        "30605361.comet.popover.ProfileCometAppCollectionMediaActionsMenu.react": 2.5;
        "30605361.comet.popover.ProfileCometHeaderActionBarMoreMenu.react": 7.4;
        "30605361.comet.popover.ProfileCometLockedProfilePopover.react": 2.7;
        "30605361.comet.popover.ProfileCometProfilePictureEditMenu.react": 3.2;
        "30605361.comet.popover.ProfileCometProfilePictureViewMenu.react": 4.9;
        "30605361.comet.popover.marketplace.pdpSaveButton": 3.4;
        "30605361.comet.search_scoped.group": 2.7;
        "30605361.comet.unified_video.menu": 8.1;
        "30605361.mwp.dialog.MWChatDeleteConversationDialog.react": 6.2;
        "30605361.mwp.dialog.MWV2MediaViewer.react": 42.3;
        "30605361.mwp.dialog.MWV2RemoveMessageDialog.react": 62.3;
        "30605361.mwp.dialog.MWXConfirmationDialog.react": 2.8;
        "30605374.comet.home": 2.5;
        "30605374.comet.mediaviewer.photo": 2.3;
        "30605374.comet.post.single_dialog": 3.3;
        "30605374.comet.profile.timeline.list": 6.4;
        "30605380.comet.app": 437.7;
        "30605380.comet.friending.allfriends": 31.9;
        "30605380.comet.home": 28.7;
        "30605380.comet.marketplace.item": 4.8;
        "30605380.comet.messenger.chat_tab.cutover": 5.4;
        "30605380.comet.messenger.chat_tab.open": 91.3;
        "30605380.comet.messenger.chat_tab.secure": 166.8;
        "30605380.comet.profile.timeline.list": 12;
        "30605380.comet.reels.unified.player": 8.1;
        "30605384.comet.app": 766.5;
        "30605384.comet.home": 6.8;
        "30605384.comet.messenger.inbox": 153.6;
        "30605384.comet.reels.unified.player": 9.5;
        "30607516.comet.jewel.message_requests": 3.1;
        "30608422.comet.app": 2.4;
        "30609204.comet.app": 62.5;
        "30609204.comet.messenger.chat_tab.open": 9.9;
        "30609204.comet.messenger.chat_tab.secure": 20.6;
        "30611078.comet.profile.timeline.list": 3;
        "30612548.comet.reels.reel": 57.4;
        "30612548.comet.reels.unified.reel": 1216.5;
        "30612737.comet.lwi.ad_preview_load": 4.6;
        "30614323.comet.lwi.validation_complete": 3.7;
        "30615205.comet.app": 783.6;
        "30615365.comet.profile.timeline.list": 9.2;
        "30615438.comet.group": 4.4;
        "30615438.comet.home": 16.1;
        "30616158.comet.app": 806.2;
        "445457621.comet.fx.accounts_center.profiles": 1.2;
        "445457621.comet.fx.accounts_center.section": 2.9;
        "445457621.comet.wa.help.content": 2.4;
        "445464117.comet.fx.accounts_center.home": 1.7;
        "445464117.comet.gaming.games.canvas_player": 36.8;
        "445464117.comet.wa.help.content": 22.2;
        "64231865.zenon.groupcall": 19.3;
      };
    };
    qpl: { modules: {}; events: {} };
    modules: null;
    events: null;
  };
}

interface CometDarkModeSetting {
  initialGuessForDarkModeOnClient: true;
  initialClientStateGuess: true;
  initialSetting: "ENABLED";
}

interface IsInternSite {
  is_intern_site: false;
}

interface MessengerWebPresenceCookieData {
  cookie: 'C{"lm3":"g.25742992745315795","t3":[],"utc3":1775490198397,"v":1}';
}

interface MqttWebDeviceID {
  clientID: "5addd8c7-da46-4a66-8e6e-73f985afcab1";
}

interface IsInternSite {"is_intern_site":false}
interface MessengerWebPresenceCookieData {"cookie":"C{\"lm3\":\"g.25742992745315795\",\"t3\":[],\"utc3\":1775490198397,\"v\":1}"}

interface EmojiConfig {
  pixelRatio: "1";
  schemaAuth: "https:\/\/static.xx.fbcdn.net\/images\/emoji.php\/v9";
  hasEmojiPickerSearch: false;
}
interface LSPlatformMessengerSyncParams {
  mailbox: '{"bloks_version":"f3802a249b3559b37c55450024a71bf22d3d054d102334d3d14e7d7fb5fdfe19","full_height":200,"locale":"en_US","preview_height":360,"preview_height_large":360,"preview_width":480,"preview_width_large":480,"scale":1,"snapshot_num_threads_per_page":15}';
  contact: '{"locale":"en_US"}';
  e2ee: '{"locale":"en_US"}';
  communityExclusive: '{"locale":"en_US"}';
}

interface MessengerWebImageUploadUrl {
  upload_url: "https:\/\/upload.facebook.com\/ajax\/mercury\/upload.php";
}

interface AsyncRequestConfig {
  retryOnNetworkError: "1";
  useFetchStreamAjaxPipeTransport: true;
}

interface PaddedStickerConfig {
  ChatPaddedAnimatedStickerGK: true;
}

interface SessionNameConfig {
  seed: "1jQV";
}

interface VideoUploadConfig {
  videoExtensions: {
    gif: 1;
    mov: 1;
    qt: 1;
    wmv: 1;
    avi: 1;
    mpe: 1;
    mpg: 1;
    mpeg: 1;
    asf: 1;
    mp4: 1;
    m4v: 1;
    mpeg4: 1;
    "3gpp": 1;
    "3gp": 1;
    "3g2": 1;
    mkv: 1;
    flv: 1;
    vob: 1;
    ogm: 1;
    ogv: 1;
    nsv: 1;
    mod: 1;
    tod: 1;
    dat: 1;
    mts: 1;
    m2ts: 1;
    dv: 1;
    divx: 1;
    f4v: 1;
    ts: 1;
    tmp: 1;
    rmvb: 1;
    webm: 1;
  };
  allowMultimedia: true;
  showMultimediaNUX: false;
}

interface WebWorkerConfig {
  logging: { enabled: false; config: "WebWorkerLoggerConfig" };
  evalWorkerURL: "\/rsrc.php\/v4\/yy\/r\/z_4h5fP15Ht.js?_nc_eui2=AeFUUWnH4Vw25Vh0203qdgkWpRNeZMfYehSlE15kx9h6FPYjKd0gid_OtTZGPnLRHbs3y7WeYZbs2tu62zyGn2ko";
}

interface TimeSliceInteractionSV {
  on_demand_reference_counting: true;
  on_demand_profiling_counters: true;
  default_rate: 1000;
  lite_default_rate: 100;
  interaction_to_lite_coinflip: {
    ADS_INTERFACES_INTERACTION: 0;
    ads_perf_scenario: 0;
    ads_wait_time: 0;
    Event: 1;
  };
  interaction_to_coinflip: {
    ADS_INTERFACES_INTERACTION: 1;
    ads_perf_scenario: 1;
    ads_wait_time: 1;
    Event: 100;
  };
  enable_heartbeat: false;
  maxBlockMergeDuration: 0;
  maxBlockMergeDistance: 0;
  enable_banzai_stream: true;
  user_timing_coinflip: 50;
  banzai_stream_coinflip: 0;
  compression_enabled: true;
  ref_counting_fix: false;
  ref_counting_cont_fix: false;
  also_record_new_timeslice_format: false;
  force_async_request_tracing_on: false;
}

interface SphericalPhotoTypedConfig {
  spherical_photo_www_album_toggle: true;
  spherical_photo_www_billable_click: true;
  show_fallback_renderer: true;
  is_parallax_on: true;
  allow_ambient_audio: false;
  enable_stereograph_renderer: false;
  upload_size_limit: 17408;
  upload_bytes_limit: 36700160;
  is_www_perceived_perf_on: false;
  www_can_viewer_tag: true;
  should_snowlift_fit_to_screen: false;
  is_www_tap_to_click_on: true;
  is_www_img_retry_on: true;
  should_recompress: true;
  reuse_dom_data_in_snowlift: false;
  show_new_renderer: false;
  is_renderer_projection_update_allowed: true;
}

interface DataStoreConfig {
  expandoKey: "__FB_STORE";
  useExpando: true;
}

interface ClickIDDomainBlacklistSVConfig {
  domains: [
    "craigslist",
    "tfbnw.net",
    "canadiantire.ca",
    "o2.co.uk",
    "archive.org",
    "reddit.com",
    "redd.it",
    "gmail.com",
    "cvk.gov.ua",
    "electoralsearch.in",
    "yahoo.com",
    "cve.mitre.org",
    "usenix.org",
    "ky.gov",
    "voteohio.gov",
    "vote.pa.gov",
    "oversightboard.com",
    "wi.gov",
    "pbs.twimg.com",
    "media.discordapp.net",
    "vastadeal.com",
    "theaustralian.com.au",
    "alloygator.com",
    "elsmannimmobilien.de",
    "news.com.au",
    "dennisbonnen.com",
    "stoett.com",
    "investorhour.com",
    "perspectivasur.com",
    "bonnegueule.fr",
    "firstent.org",
    "twitpic.com",
    "kollosche.com.au",
    "nau.edu",
    "arcourts.gov",
    "lomberg.de",
    "network4.hu",
    "balloonrace.com",
    "awstrack.me",
    "ic3.gov",
    "sos.wyo.gov",
    "cnpq.br",
    "0.discoverapp.com",
    "apple.com",
    "apple.co",
    "applecard.apple",
    "services.apple",
    "appletvplus.com",
    "applepay.apple",
    "wallet.apple",
    "apple.com.br",
    "apple.us",
    "apple.se",
    "apple.jp",
    "apple.com.br",
    "apple.in",
    "apple.com.my",
    "apple.ca",
    "beatsbydre.com",
    "dinn.com.mx",
    "soriana.com",
    "facebook.sso.datasite.com",
    "fycextras.com",
    "rik.parlament.gov.rs",
    "elections.delaware.gov",
    "dge.sn",
    "facebook.co1.qualtrics.com",
    "instagram.qualtrics.com",
    "ec.europa.eu",
    "www.wyoroad.info",
  ];
}
interface ClickIDURLBlocklistSVConfig {
  block_list_url: [
    "https:\/\/www.youtube.com\/watch?v=f1J38FlDKxo",
    "https:\/\/www.youtube.com\/watch?v=6xt7nTuO85A",
    "https:\/\/tinyurl.com\/3hakpctd",
    "https:\/\/stecu.short.gy\/zqp5ir",
    "https:\/\/sn.tg-need.com\/EaXp6M",
    "https:\/\/tinyurl.com\/csvjk5sx",
    "https:\/\/tinyurl.com\/mpu3p59x",
    "https:\/\/tinyurl.com\/z47xusj",
    "https:\/\/sinarabadi.xyz\/M01McZ",
    "http:\/\/stecu.short.gy\/zqp5ir",
    "https:\/\/tinyurl.com\/3hakpctd\/",
    "https:\/\/stecu.short.gy\/zqp5ir\/",
    "https:\/\/sn.tg-need.com\/EaXp6M\/",
    "https:\/\/tinyurl.com\/csvjk5sx\/",
    "https:\/\/tinyurl.com\/mpu3p59x\/",
    "https:\/\/tinyurl.com\/z47xusj\/",
    "https:\/\/sinarabadi.xyz\/M01McZ\/",
    "http:\/\/stecu.short.gy\/zqp5ir\/",
  ];
}

interface TransportSelectingClientContextualConfig {
  rawConfig: '{"name":"rti\/web_rs_transport_selecting_client","cctype":"dense","version":1,"policy_id":"static","sample_rate":1000,"contexts":[{"name":"method","type":"STRING","callsite":true,"buckets":[{"name":"rollout_group_1","strategy":"in","values":["FBGQLS:FEEDBACK_LIKE_SUBSCRIBE","Falco","FBLQ:comet_notifications_live_query_experimental"]},{"name":"rollout_group_6","strategy":"in","values":["FBGQLS:COMMENT_CREATE_SUBSCRIBE","FBGQLS:COMMENT_LIKE_SUBSCRIBE","FBGQLS:FEEDBACK_COMMENT_PERMISSION_TOGGLE_SUBSCRIBE","FBGQLS:FEEDBACK_TYPING_SUBSCRIBE"]},{"name":"rollout_group_4","strategy":"regex","values":["FBGQLS:.*"]},{"name":"rollout_group_3","strategy":"regex","values":["FBLQ:.*"]},{"name":"skywalker","strategy":"in","values":["SKY:test_topic","live\/api\/copyright","intern_notify","locplat\/ttm","rti_widget_dashboard","srt\/user_metrics_counter","media_manager_instagram_composer_create_update","cubism_annotations\/fleet_health","srt\/notifications","ads\/reporting\/snapshot","unidash\/widget","cubism_annotations","ads\/reporting\/export","pubx\/notification\/update","ads\/powereditor\/import","lwi_async_create","video_edit","metric_graph_realtime","vcc_video_posting_www","cms\/object_archive_copy_created","cms\/branch_updated","cms\/object_saved","codeless_event_tracking","srt\/job_updated","video_broadcast","video\/broadcast\/error","vcpanel\/api","lwi_everywhere_plugin","commercial_break_v2","advanced_analytics\/query","cubism_annotations\/ads_mastercook_models","gqls\/comment_like_subscribe","live\/api\/copyright","shiba\/mock_bot_error","shiba\/save_state","video_list_publishing_progress_update","assistant_wizard","gizmo\/manage","collab\/presentation\/request","snaptu\/push_notif"]},{"name":"skywalker_bulletin","strategy":"in","values":["www\/sr\/hot_reload"]},{"name":"rollout_group_5","strategy":"regex","values":["Collabri|RealtimeClientSync:.*"]},{"name":"default","strategy":"catch_all"}]}],"outputs":[{"name":"group","type":"STRING"},{"name":"dgwUpsampleMultiplier","type":"FLOAT"}],"vector":["group1","0.01","group6","0.001","group4","1.0","group3","1.0","skywalker","1.0","skywalker_bulletin","1.0","group5","1.0","default_group","1.0"],"vectorDefaults":["default_group","1.0"],"timestamp":1663366072}';
}

interface RtiWebRequestStreamClient {
  overrideHeaders: {};
}
interface RequestStreamE2EClientSamplingConfig {
  sampleRate: 500000;
  methodToSamplingMultiplier: {
    RTCSessionMessage: 10000;
    Presence: 0.01;
    "FBGQLS:VOD_TICKER_SUBSCRIBE": 0.01;
    "FBGQLS:STORIES_TRAY_SUBSCRIBE": 100;
    Collabri: 0.1;
    "FBGQLS:WORK_AVAILABILITY_STATUS_FANOUT_SUBSCRIBE": 0.1;
    "FBGQLS:GROUP_UNSEEN_ACTIVITY_SUBSCRIBE": 0.1;
    "FBGQLS:GROUP_RESET_UNSEEN_ACTIVITY_SUBSCRIBE": 0.1;
    "FBGQLS:INTERN_CALENDAR_UPDATE_SUBSCRIBE": 0.1;
    "SKY:gizmo_manage": 10000;
    "FBGQLS:XFB_HZW_CHALLENGE_COMPLETE_SUBSCRIBE": 10;
    FalcoMobile: 1;
    "FBGQLS:FEEDBACK_LIKE_SUBSCRIBE": 10;
    "FBLQ:ios_huddle_listener": 1000;
    "FBGQLS:HUDDLE_USERS_REQUESTED_TO_SPEAK_COUNT_SUBSCRIBE": 1000;
  };
}

interface FbtResultGK {
  shouldReturnFbtResult: true;
  inlineMode: "NO_INLINE";
}
interface FBDomainsSVConfig {
  domains: {
    __map: [
      ["www.facebook.com", 1],
      ["tfbnw.net", 1],
      ["m.beta.facebook.com", 1],
      ["touch.beta.facebook.com", 1],
      ["www.dev.facebook.com", 1],
      ["fb.me", 1],
      ["s.fb.com", 1],
      ["m.fbjs.facebook.com", 1],
      ["facebook.com.es", 1],
      ["www.fbjs.facebook.com", 1],
      ["m.facebook.com", 1],
      ["facebook.fr", 1],
      ["fbsbx.com", 1],
      ["embed.fbsbx.com", 1],
      ["attachment.fbsbx.com", 1],
      ["lookaside.fbsbx.com", 1],
      ["web.facebook.com", 1],
      ["fb.com", 1],
      ["messenger.com", 1],
      ["secure.facebook.com", 1],
      ["secure.my-od.facebook.com", 1],
      ["www.my-od.facebook.com", 1],
    ];
  };
}

interface TimeSpentWWWCometConfig {
  CONFIG: { "0_delay": 0; "0_timeout": 8; delay: 1000; timeout: 64 };
}
interface CometMaxEnqueuedToastsSitevarConfig {
  max: 2;
}
interface ImmediateActiveSecondsConfig {
  sampling_rate: 2003;
  ias_bucket: 1092;
}
interface InstagramUserAgent {
  is_chrome: true;
  is_edge: false;
  is_edge_chromium_based: false;
  is_edge_legacy: false;
  is_firefox: false;
  is_ig_carbon: false;
  is_ig_lite: false;
  is_ig_webview: false;
  is_barcelona_webview: false;
  is_igtv_webview: false;
  is_in_app_browser: false;
  is_ios: false;
  is_android: false;
  is_windows_nt: true;
  is_ipad: false;
  is_macos: false;
  is_mobile: false;
  is_mobile_safari: false;
  is_oculus_browser: false;
  is_opera: false;
  is_safari: false;
  is_supported_browser: true;
  is_twitter_webview: false;
  is_uc_browser: false;
  is_vapid_eligible: true;
  is_webview: false;
  is_windows_pwa: false;
  is_igvr: false;
  is_airwave: false;
  user_agent: "Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/146.0.0.0 Safari\/537.36";
  is_ios_mmse_supported_browser: false;
}

interface PolarisSiteData {
  country_code: null;
  device_id: "";
  machine_id: "";
  send_device_id_header: false;
  e2e_config: null;
  use_server_machine_id: false;
  cross_site_request_url: "";
}

interface BDSignalCollectionData {
  sc: '{"t":1775667956,"c":[[30000,838801],[30001,838801],[30002,838801],[30003,838801],[30004,838801],[30005,838801],[30006,573585],[30007,838801],[30008,838801],[30012,838801],[30013,838801],[30015,806033],[30018,806033],[30021,540823],[30022,540817],[30040,806033],[30093,806033],[30094,806033],[30095,806033],[30101,541591],[30102,541591],[30103,541591],[30104,541591],[30106,806039],[30107,806039],[38000,541427],[38001,806643]]}';
  fds: 60;
  fda: 60;
  i: 60;
  sbs: 1;
  dbs: 100;
  bbs: 100;
  hbi: 60;
  rt: 262144;
  hbcbc: 2;
  hbvbc: 0;
  hbbi: 30;
  sid: 38;
  hbv: "6539661510206829399";
}

interface MessengerURIConstants {
  ARCHIVED_PATH: "\/archived";
  COMPOSE_SUBPATH: "\/new";
  E2EE_PATH: "\/e2ee";
  FOLDERS_PATH: "\/folders";
  GALLERY_PATH: "\/gallery";
  GROUPS_PATH: "\/groups";
  PAYMENT_PATH: "\/p";
  PAYMENT_PAY_PATH: "\/pay";
  PEOPLE_PATH: "\/people";
  SEARCH_PATH: "\/search";
  SUPPORT_PATH: "\/support";
  FILTERED_REQUESTS_PATH: "\/filtered";
  MESSAGE_REQUESTS_PATH: "\/requests";
  TEAMWORK_GROUP_VIEW: "\/all-groups";
  TEAMWORK_ANNOUNCEMENT_GROUP_VIEW: "\/all-announcement-groups";
  TEAMWORK_UNREAD_VIEW: "\/all-unread";
  TEAMWORK_CHAT_VIEW: "\/all-chats";
  THREAD_PREFIX: "\/t\/";
  INSTAGRAM_DIRECT_PATH: "\/direct\/inbox";
  GROUP_PREFIX: "group-";
  FACEBOOK_PREFIX: "\/messages";
}

interface SupportAISitevarConfig {
  support_ai_bot_id: "1335037274590159";
}

interface UFICommentFileInputAcceptValues {
  both: "video\/*,  video\/x-m4v, video\/webm, video\/x-ms-wmv, video\/x-msvideo, video\/3gpp, video\/flv, video\/x-flv, video\/mp4, video\/quicktime, video\/mpeg, video\/ogv, .ts, .mkv, image\/*, image\/heic, image\/heif";
  photos: "image\/*, image\/heic, image\/heif";
  videos: "video\/*, video\/x-m4v, video\/webm, video\/x-ms-wmv, video\/x-msvideo, video\/3gpp, video\/flv, video\/x-flv, video\/mp4, video\/quicktime, video\/mpeg, video\/ogv, .ts, .mkv";
  files: "application\/*, application\/pdf, application\/x-pdf, application\/x-bzpdf, application\/x-gzpdf, application\/msword, application\/vnd.openxmlformats-officedocument.wordprocessingml.document, application\/vnd.ms-powerpoint, application\/vnd.openxmlformats-officedocument.presentationml.presentation, application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application\/vnd.ms-excel, text\/*, image\/*, image\/heic, image\/heif, model\/*, video\/*, video\/x-m4v, video\/webm, video\/x-ms-wmv, video\/x-msvideo, video\/3gpp, video\/flv, video\/x-flv, video\/mp4, video\/quicktime, video\/mpeg, video\/ogv, .ts, .mkv";
}

interface FBCookieSettingsLoggedOutConfig {
  should_show_cookie_settings: false;
}

interface WebStorageMonsterLoggingURI {
  uri: "\/ajax\/webstorage\/process_keys\/?state=0";
}

interface CookieConsentIFrameConfig {
  consent_param: "FQAREiIVABn1jAEC5ALSAiQuPkBGSEpMTlBUWFxeYGJkamxydHh6gAGCAYQBhgGIAYoBjAGUAZwBngGgAaQBuAHOAdoC3gHgAeIB6gHsAe4B8AH0Af4BgAKGApYCmgKgArACBAYKDA4QEhYYHB4gIiYoKiwwMjY4OjyyAkJE6gJmbnB2vgJ8jgGQAcICkgGWAZgBmgHmAqIByAK6AqgBrAGuAbABsgG0Ac4CugG+AdYCwAHCAcoCxgHIAcoBzAHMAtAB1AHYAdoB6ALUAvIC8ALkAegB+AH6AeAC\/AGKAsYCjAKOApAC2AKYAqICGAxGYWNlYm9va0hvc3QYA3dlYhgdWENvbWV0UHJvZmlsZVZhbml0eUNvbnRyb2xsZXIA.Aao2lcnlQPW5fLyJWcJ8NEsr1ncXRy5rFCaXujROodoot0E8";
  allowlisted_iframes: [];
  is_checkpointed: false;
}

interface MessengerMSplitFlag {
  is_msplit_account: false;
  is_dma_consent_declined: false;
}

interface ZeroRewriteRules {
  rewrite_rules: {};
  whitelist: {
    "\/hr\/r": 1;
    "\/hr\/p": 1;
    "\/zero\/unsupported_browser\/": 1;
    "\/zero\/policy\/optin": 1;
    "\/zero\/optin\/write\/": 1;
    "\/zero\/optin\/legal\/": 1;
    "\/zero\/optin\/free\/": 1;
    "\/about\/privacy\/": 1;
    "\/about\/privacy\/update\/": 1;
    "\/privacy\/explanation\/": 1;
    "\/zero\/toggle\/welcome\/": 1;
    "\/zero\/toggle\/nux\/": 1;
    "\/zero\/toggle\/settings\/": 1;
    "\/fup\/interstitial\/": 1;
    "\/work\/landing": 1;
    "\/work\/login\/": 1;
    "\/work\/email\/": 1;
    "\/ai.php": 1;
    "\/js_dialog_resources\/dialog_descriptions_android.json": 0;
    "\/connect\/jsdialog\/MPlatformAppInvitesJSDialog\/": 0;
    "\/connect\/jsdialog\/MPlatformOAuthShimJSDialog\/": 0;
    "\/connect\/jsdialog\/MPlatformLikeJSDialog\/": 0;
    "\/qp\/interstitial\/": 1;
    "\/qp\/action\/redirect\/": 1;
    "\/qp\/action\/close\/": 1;
    "\/zero\/support\/ineligible\/": 1;
    "\/zero_balance_redirect\/": 1;
    "\/zero_balance_redirect": 1;
    "\/zero_balance_redirect\/l\/": 1;
    "\/l.php": 1;
    "\/lsr.php": 1;
    "\/ajax\/dtsg\/": 1;
    "\/checkpoint\/block\/": 1;
    "\/exitdsite": 1;
    "\/zero\/balance\/pixel\/": 1;
    "\/zero\/balance\/": 1;
    "\/zero\/balance\/carrier_landing\/": 1;
    "\/zero\/flex\/logging\/": 1;
    "\/tr": 1;
    "\/tr\/": 1;
    "\/sem_campaigns\/sem_pixel_test\/": 1;
    "\/bookmarks\/flyout\/body\/": 1;
    "\/zero\/subno\/": 1;
    "\/confirmemail.php": 1;
    "\/policies\/": 1;
    "\/mobile\/internetdotorg\/classifier\/": 1;
    "\/zero\/dogfooding": 1;
    "\/xti.php": 1;
    "\/zero\/fblite\/config\/": 1;
    "\/hr\/zsh\/wc\/": 1;
    "\/ajax\/bootloader-endpoint\/": 1;
    "\/mobile\/zero\/carrier_page\/": 1;
    "\/mobile\/zero\/carrier_page\/education_page\/": 1;
    "\/mobile\/zero\/carrier_page\/feature_switch\/": 1;
    "\/mobile\/zero\/carrier_page\/settings_page\/": 1;
    "\/aloha_check_build": 1;
    "\/upsell\/zbd\/softnudge\/": 1;
    "\/mobile\/zero\/af_transition\/": 1;
    "\/mobile\/zero\/af_transition\/action\/": 1;
    "\/mobile\/zero\/freemium\/": 1;
    "\/mobile\/zero\/freemium\/redirect\/": 1;
    "\/mobile\/zero\/freemium\/zero_fup\/": 1;
    "\/privacy\/policy\/": 1;
    "\/privacy\/center\/": 1;
    "\/data\/manifest\/": 1;
    "\/cmon": 1;
    "\/cmon\/": 1;
    "\/zero\/minidt\/": 1;
    "\/diagnostics": 1;
    "\/diagnostics\/": 1;
    "\/payments\/stablecoin\/link\/complete\/": 1;
    "\/4oh4.php": 1;
    "\/autologin.php": 1;
    "\/birthday_help.php": 1;
    "\/checkpoint\/": 1;
    "\/contact-importer\/": 1;
    "\/cr.php": 1;
    "\/legal\/terms\/": 1;
    "\/login.php": 1;
    "\/login\/": 1;
    "\/mobile\/account\/": 1;
    "\/n\/": 1;
    "\/remote_test_device\/": 1;
    "\/upsell\/buy\/": 1;
    "\/upsell\/buyconfirm\/": 1;
    "\/upsell\/buyresult\/": 1;
    "\/upsell\/promos\/": 1;
    "\/upsell\/continue\/": 1;
    "\/upsell\/h\/promos\/": 1;
    "\/upsell\/loan\/learnmore\/": 1;
    "\/upsell\/purchase\/": 1;
    "\/upsell\/promos\/upgrade\/": 1;
    "\/upsell\/buy_redirect\/": 1;
    "\/upsell\/loan\/buyconfirm\/": 1;
    "\/upsell\/loan\/buy\/": 1;
    "\/upsell\/sms\/": 1;
    "\/wap\/a\/channel\/reconnect.php": 1;
    "\/wap\/a\/nux\/wizard\/nav.php": 1;
    "\/wap\/appreg.php": 1;
    "\/wap\/birthday_help.php": 1;
    "\/wap\/c.php": 1;
    "\/wap\/confirmemail.php": 1;
    "\/wap\/cr.php": 1;
    "\/wap\/login.php": 1;
    "\/wap\/r.php": 1;
    "\/zero\/datapolicy": 1;
    "\/a\/timezone.php": 1;
    "\/a\/bz": 1;
    "\/bz\/reliability": 1;
    "\/r.php": 1;
    "\/mr\/": 1;
    "\/reg\/": 1;
    "\/registration\/log\/": 1;
    "\/terms\/": 1;
    "\/f123\/": 1;
    "\/expert\/": 1;
    "\/experts\/": 1;
    "\/terms\/index.php": 1;
    "\/terms.php": 1;
    "\/srr\/": 1;
    "\/msite\/redirect\/": 1;
    "\/fbs\/pixel\/": 1;
    "\/contactpoint\/preconfirmation\/": 1;
    "\/contactpoint\/cliff\/": 1;
    "\/contactpoint\/confirm\/submit\/": 1;
    "\/contactpoint\/confirmed\/": 1;
    "\/contactpoint\/login\/": 1;
    "\/preconfirmation\/contactpoint_change\/": 1;
    "\/help\/contact\/": 1;
    "\/survey\/": 1;
    "\/upsell\/loyaltytopup\/accept\/": 1;
    "\/settings\/": 1;
    "\/lite\/": 1;
    "\/zero_status_update\/": 1;
    "\/operator_store\/": 1;
    "\/upsell\/": 1;
    "\/wifiauth\/login\/": 1;
  };
}

interface BrowserPushPubKey {
  appServerKey: "BIBn3E_rWTci8Xn6P9Xj3btShT85Wdtne0LtwNUyRQ5XjFNkuTq9j4MPAVLvAFhXrUU1A9UxyxBA7YIOjqDIDHI";
}

interface InitialCookieConsent {
  initialConsent: [1, 2];
  noCookies: false;
  shouldShowCookieBanner: false;
  shouldWaitForDeferredDatrCookie: false;
  optedInIntegrations: [
    "adobe_marketo_rest_api",
    "apple_pay",
    "brightedge",
    "chili_piper_api",
    "cloudfront_cdn",
    "giphy_api",
    "giphy_media",
    "google_ads_pixel_frame_legacy",
    "google_ads_pixel_img_legacy",
    "google_ads_pixel_legacy",
    "google_ads_remarketing_tag",
    "google_ads_services",
    "google_analytics_4_tag",
    "google_apis",
    "google_cached_img",
    "google_double_click_loading",
    "google_double_click_redirecting",
    "google_double_click_uri_connect",
    "google_double_click_uri_frame",
    "google_double_click_uri_img",
    "google_fonts",
    "google_fonts_font",
    "google_img",
    "google_maps",
    "google_paid_ads_frame",
    "google_paid_ads_img",
    "google_tag",
    "google_translate",
    "google_universal_analytics_legacy",
    "google_universal_analytics_legacy_img",
    "google_universal_analytics_legacy_script",
    "google_uri_frame",
    "google_uri_script",
    "jio",
    "linkedin_insight",
    "linkedin_insight_img",
    "mapbox_maps_api",
    "medallia_digital_experience_analytics",
    "nytimes_oembed",
    "reachtheworld_s3",
    "salesforce_mcp_beacon",
    "soundcloud_oembed",
    "spotify_oembed",
    "spreaker_oembed",
    "ted_oembed",
    "tenor_api",
    "tenor_images",
    "tenor_media",
    "tiktok_oembed",
    "twitter_analytics_pixel",
    "twitter_analytics_pixel_img",
    "twitter_legacy_embed",
    "vimeo_oembed",
    "youtube_embed",
    "youtube_oembed",
    "kochava",
    "advertiser_hosted_pixel",
    "airbus_sat",
    "amazon_media",
    "apps_for_office",
    "arkose_captcha",
    "aspnet_cdn",
    "autodesk_fusion",
    "bing_maps",
    "bing_widget",
    "boku_wallet",
    "bootstrap",
    "box",
    "cardinal_centinel_api",
    "chromecast_extensions",
    "cloudflare_cdnjs",
    "cloudflare_datatables",
    "cloudflare_relay",
    "conversions_api_gateway",
    "demandbase_api",
    "digitalglobe_maps_api",
    "dlocal",
    "dropbox",
    "esri_sat",
    "fastly_relay",
    "gmg_pulse_embed_iframe",
    "google_ads_conversions_tag",
    "google_cast_receiver",
    "google_drive",
    "google_fonts_legacy",
    "google_hosted_libraries",
    "google_oauth_api",
    "google_oauth_api_v2",
    "google_recaptcha",
    "here_map_ext",
    "hive_streaming_video",
    "iproov",
    "isptoolbox",
    "jquery",
    "js_delivr",
    "kbank",
    "mastercard_click_to_pay",
    "mathjax",
    "meshy",
    "metacdn",
    "microsoft_excel",
    "microsoft_office_addin",
    "microsoft_onedrive",
    "microsoft_speech",
    "microsoft_teams",
    "mmi_tiles",
    "oculus",
    "open_street_map",
    "paypal_billing_agreement",
    "paypal_fastlane_sdk",
    "paypal_oauth_api",
    "payu",
    "payu_india",
    "plaid",
    "platformized_adyen_checkout",
    "plotly",
    "pydata",
    "razorpay",
    "recruitics",
    "rstudio",
    "salesforce_lighting",
    "salesforce_miaw",
    "salesforce_miaw_fbsbx_only",
    "shopify_app_bridge",
    "shopify_app_polaris",
    "sierra_voice_api",
    "stripe",
    "team_center",
    "tripshot",
    "trustly_direct_debit_ach",
    "turbo_gala",
    "twilio_voice",
    "unifier",
    "unpkg",
    "unsplash_api",
    "unsplash_image_loading",
    "vega",
    "whatsapp_arkose_captcha",
    "yoti_api",
    "youtube_oembed_api",
  ];
  hasGranularThirdPartyCookieConsent: true;
  exemptedIntegrations: [
    "advertiser_hosted_pixel",
    "airbus_sat",
    "amazon_media",
    "apps_for_office",
    "arkose_captcha",
    "aspnet_cdn",
    "autodesk_fusion",
    "bing_maps",
    "bing_widget",
    "boku_wallet",
    "bootstrap",
    "box",
    "cardinal_centinel_api",
    "chromecast_extensions",
    "cloudflare_cdnjs",
    "cloudflare_datatables",
    "cloudflare_relay",
    "conversions_api_gateway",
    "demandbase_api",
    "digitalglobe_maps_api",
    "dlocal",
    "dropbox",
    "esri_sat",
    "fastly_relay",
    "gmg_pulse_embed_iframe",
    "google_ads_conversions_tag",
    "google_cast_receiver",
    "google_drive",
    "google_fonts_legacy",
    "google_hosted_libraries",
    "google_oauth_api",
    "google_oauth_api_v2",
    "google_recaptcha",
    "here_map_ext",
    "hive_streaming_video",
    "iproov",
    "isptoolbox",
    "jquery",
    "js_delivr",
    "kbank",
    "mastercard_click_to_pay",
    "mathjax",
    "meshy",
    "metacdn",
    "microsoft_excel",
    "microsoft_office_addin",
    "microsoft_onedrive",
    "microsoft_speech",
    "microsoft_teams",
    "mmi_tiles",
    "oculus",
    "open_street_map",
    "paypal_billing_agreement",
    "paypal_fastlane_sdk",
    "paypal_oauth_api",
    "payu",
    "payu_india",
    "plaid",
    "platformized_adyen_checkout",
    "plotly",
    "pydata",
    "razorpay",
    "recruitics",
    "rstudio",
    "salesforce_lighting",
    "salesforce_miaw",
    "salesforce_miaw_fbsbx_only",
    "shopify_app_bridge",
    "shopify_app_polaris",
    "sierra_voice_api",
    "stripe",
    "team_center",
    "tripshot",
    "trustly_direct_debit_ach",
    "turbo_gala",
    "twilio_voice",
    "unifier",
    "unpkg",
    "unsplash_api",
    "unsplash_image_loading",
    "vega",
    "whatsapp_arkose_captcha",
    "yoti_api",
    "youtube_oembed_api",
  ];
  nonBlockingBannerPage: false;
  consentRequiredForMetaPixel: false;
}

interface BizKitConfigDynamicFields {
  is_cm_reverse_shim_eligible: false;
  is_diode_opt_out: false;
  is_ig_login: false;
  is_ig_only: false;
  is_ig_login_multi_admin: false;
  is_mma_login: false;
  is_waba_login: false;
  waba_account_id: "";
  can_see_mbs_account_switch: false;
}

interface AnalyticsCoreData {
  device_id: "fd.ARuvhmk6hVIo8APLfHXX8ELStzov0Ri8PtskJSasR_OYSZ4Xqk0DGTpwkmmY9LsrRnYrXPP_eu55KKV6ixjG1AjV";
  app_id: "2220391788200892";
  app_version: "1036.907.157.0 (1036907157)";
  enable_bladerunner: true;
  enable_ack: true;
  push_phase: "C3";
  enable_observer: false;
  enable_cmcd_observer: false;
  enable_dataloss_timer: false;
  enable_fallback_for_br: true;
  queue_activation_experiment: false;
  max_delay_br_queue: 60000;
  max_delay_br_queue_immediate: 3;
  max_delay_br_init_not_complete: 3000;
  consents: {};
  app_universe: 1;
  br_stateful_migration_on: true;
  enable_non_fb_br_stateless_by_default: false;
  use_falco_as_mutex_key: false;
  is_intern: false;
  identity: {
    fbIdentity: { actorId: "100054303594421"; accountId: "100054303594421" };
    claim: "hmac_ttl.1775667956.AR2GdosEUGZ2YrOosyYs_yrrfy-gRCIGKpLsCvB2InxsrM2R";
  };
  state_for_br: "fase.ARvA7AYXUkzHfwW2BwTST_M6po6jbYHTY-RhZG38hqCWmj0z0FgqkInjpIH4EvcH3K95dr2FteqEd-f5UybClXDnsTQkf_RjJjV3NF5BKQsKaTxPypPJAffhEV9QHeO_CvnevHzpjiE23giihCzgD6dXjtZv80NeHiW_oHpDZ9lVTVvjYDLF12RbNljzCByOZtkWBf8U9O3OxgmaPMSdBsMScvYlklIqPamRn9JRSoP0BCFE4KiWvmoGBrgCgPdA-hRzJ4XnL6dXCOVE7qNwWeRv1t98ekid2GZJOMxFytlhKgGnbZegJ2MoL0j-iIqnvP2fkEPV6OzN7DwMjYn9_0OfPcnTonogNwFFVA4UHQ4VvPIYz-2suyZmQMv6TU5xEeLIDGUQphpAOMqulolGcEc98IlmaMTwMzQns7gcMmX_kerxqQtWlKcn8mvFB2hSD-vYfQd9rSEEO_MGO_a12NtuZjYprZ_5mflp_ullbn59EMMgCBAEjuqMxkrd7jjqKiR8WJVIxRNsG1krsuY9g4qecEMYFrZPVh3AH4AU0OV7_IqusH4llcPY9E6SSGd8UP3SP-VU0Q0rBKteAm6_y6h9gEcokety3cQfF1BnAeqBSdM3XnBcLSRQiBGjzD7bcfHPreqAoyuGmuwWjhd4d7Xbhoqb60GCN1A3zX1pmGKyw51wGVQWjwewO73wDf9TL75ZPJvaGVAb_8xVeYrUmWxVlvPh3C92WFF7I4OC5xa_i-p4M3PW-VOYVEhz3RiHLEeOhcvPf8jtutfpd87WTS395UdTzxdfAgxMptD6387q1cP4a66x6Q6QpJzq8S94XytB8Ip6GlWpbKeoMmlbfgZ8EeKJU47699cds9uKm43OxRZlK636a1xMrQo6NBTpHohClQpep_YuWa7x3Diaw-X468JpHevo76JiTKn1vULFnSgwAUmTEZEJ9loo4-C9HJtAnB7_NlNTBjygycNnxiEe-bxHQce-A41zDsiX6KuwnodG1C_Dwi3pSl8RU9BUiRgVWYQP-xiDT5wr7ldz6w-EbIZ4rTTL7FrkQ9qdRbwkYVDHdU1nkXSmkkDyLhsTk5pjBLgc-eyS-T-IxOv-j2_fnY3XC6UM40R6jbE1CPOU2GFP-2ozi5_lSMVSGSPd-VnG4kB9rqr52ZPOc2cRT5Subrv3SFmpO-bfYbP0g3yIxonT-rW_xHtl8Ehko48AeeEDeC0Vuidn_NiHU25cDt5_qY-YxBsdPxQOi5Pgt84nvstoJ3sL7thy2eBStGygTT8cwsVVJafWyKVrAI-jUb08orxLGuwZ_oOfYpZbLubsi_1JjG2E4M5x4YHzd7fSZCQkIDXOK5M2LRkl0DHuYg5Kjg05X7qBSicax8PbMl3nxuOJ7VKadZ2K6LxzvecYca-NgEpHNJFcfCVwDKEbJq79HyTOTpA_BWYv2vSWTBU4UtRMnqZIi-fuNrVT2HtC1ZMtlxGBUFtzPX-AStGNMBFeV1HZ5W_iIjgsSljS9la3RUqYFT_K8yQcVl5RZzYdfEgMxB5-RRcw36BRVrAs-ly1jIDzcQruR6hnGYd4GmgPhZW2OukFH8Q-nvFEdb61BwIqXBTIZg6vSsXcEtbbMbWqk_a_sm57_PyhT0ZLm0qUBfsIrVk69KRn43v3K1LO8BQgHyBgyB6BPXOofAY1jlt5Q_qtCtSYfU-O-Vh0OXqqdqQE_jTtiph6FWs1UWggnlqVnMiaHooiVSno5YGMhAsWeTgJ_Cj5prNT45Kt3Sstn2mSzPkUeuvJDsz8ufmoBRBhEyV4fEaXpZgaE4C0mZ6SeEukdFpoTtzHa-5dOrmjXSx1-x9uJzF3Mh3kRPBVgqYsudYc9_hlN29PDIWltwmqTTDGf2Z-AZOmf9Pta8J7khdlJ8e_BM25SBMLi0AJFjNWTOBS-DJxndVkQNrHd0LEsxRqAK0RU-8ZhMcQxaSeUV1lhMeEtaSwoQhnJcnTPS7Zp56eAan6_AUuVm77NYTAqWFCrl6u3tVTkuiuixSUkz1As7EZyI4GqaV19H794zYa7Mr0YSuDxYJy4H3Ak55-ms5X6R1oghL3E7gjGDIZKlVJHYWMNiSVP7OWr5poZZRlkSxKXbr0m2kYv9HkRZJYSGa9lt5g4Frbderp-UOqo6lyvoVePDs1tLGJKr55ZJjqe_JirofvTIyCxPUh31KKE-6GDylBCexHpHa37Ra0ZHQyXCKJh0pKE8iKTCpHKKUgyagucCMT_Wv0wMtck8X8Zib3rCPzZF323LjQJOaZtAzgaIbZ5qdIlxgwW9_Ak-kLSyEaaBGazrBnJPVfLXz1ALMvIDWQ0fo6vthWXXqVwcM4SyHuG177FU8s2yFaDxc71xFKei8zAfk-U-Irj8CInUvpmpuiQEyBZqEHxgKpR6DAgupwp0pIwO9jtCYQd2utVqBIj1w4JKIyN0FWYg4vDUQGSCIJ9Gx8Rdp8tuawERiLAIHAr8vnKVUsRiiht8YVl-f87WsZvWayzNCdFEJzGe6pMf6RnxX4M0USzs80-3bd9Dz0CnoHEa9yf9KOdyqtQ9SCbc6z-OhzCAxm9RitFa0AgPcFeYdeDUldPYoJ4jrJB-crEFzpj0qr7k1Q8kxLy9Q1MSRXeC0PDHMZeDVPmD-sd3Pu1eAwaAN-mar5m17AJTWCH0dJrHHys2KkIt-A-64DqcyPo7hHq_VXJG5NfGJUBHKL-58bS4R7u2ZvwjdYVea5a2pxLw33Am5C3iCoxLTeKM_0cnD7-9vUX2YxoNmy7E6r-WQuyX6g_3cShIc6Ywbq6IcwGKsvwFqh4tetSAMawyO7OTyEE4zkUZwFNLZsUSwCm61Cvk2mv8OHMPeyY21zo3dAemthc0U6-e8wNc2HrqYaCjjALt1vXljCwnf3hXowtHEUWR-i6Y8Zy9QNtkUenGUmW9A6UKhLzne4pmY8PH1PPlZERY3WKIGlRHOEpeaG0SlCIHxUvgo8fv1bZ8F8wpGPES2-r18Eeei4hIv2YQh8XVvJ0VuSn0DTqz69V9h0pi5QbQ_x3goqJfx5252q8AbrTMmbHKb2uQaVHy_m0Xa3IO2n-Pup86dWYAQs5VR-JdFOq_4rq9xXBDtqqeCRPniZ8MToIvGqIAtU-hnuJ1mssTRbkYRS2xjBwKhkq_yZIrZ8JKrOXjB-OaTOKYbVHOyKuMaRZ1CCDcnIFZbscedWzbWNiP9Z9iHw6cu0kt2F2qFCBiDHNkZRdD3zhegeUDpdN2S67n-bKfKdt8enrZdS7tEvmPB8KTpzIQrti7eMdMTmuXWAAtcZqYeiGPhVEUYvTqGv5218D71r_7iXlyLX-zFuxPkgL8DWBfRLU1ePG0GsuWEJ1UR4D-W9YOqbadWtrWDFU3-9Ou3B5FLFhy2efxB6yRHb9KUYL0Qkq68Tjy7KgqTM8TzeHR3gGn0jHA5SpSG-N_xdjlBzMYybMtsU9HMAblxocbBZgv5v6Bn02t51WwfSCqSMOzh0xpDIluDlkoohokWQqWqsPEF0fsUqL8230ZoZKVMFZEKhMU_zL_OBO0NaageYE_IuFDvIOPagQCU1UiC8pOq9SL1PAF_bwJaRGQnbqq-HiQLUQZLO0VCjLjFLkP1h5RuAdgNqd6D-t8WEms1qK_EBQKT_XPJg4q2zPRSvfUsXP6Am4BnPaReOQ2OlvLb131tdudm8RQyxFB8QIV8LjZMZMkQ_7MnbGBAXgjjIWpMT02gvKJ0eBofFbgLPi2rppG-tP2F37gF0Yzp-e9Z85jYVHl9bHCjI75FP-NpQQMWePqSYfJE7lfWK_r1ZSgK22_uAFSKkAvwXi6c6fpxGqt-BKYXmvgDyUnNvkgsb-LGoV0zBMJ--NmOx1OMsLcudXqUT1P54BzH4-8prE_S0L0b_Obfv5rN2mjFjWxelOXpOsdsHCDlKvouuqaQd7QIsqxVZPW45UWgBNvTeT9CgE_k6c24CxGPAQLMKarDv_DRRQCdrr7Ut9XIMHLuR9pG4OKR5AWbecbR2aI-jXU3qV2TlHwdWe7-lThE_T8-Hj_KDecNzDyEixHQX-K5B-gustbsVnBcdRP9uBIWTgUo9nruoFf2N3yaKamjp3cc6qpiZzA47juMvGebtbOCOOAbjEO9u58PH2A3pew8YNYT4aAICjR2CNZsc87GmHZfLpX5B4hKI-hrKVTlzKX5ob2rq7QzH59QvZBtejBYowfKPQhhYZSjS99AtasZwZAju7hp9PjlrV6f2pAekP8GGiA7ik4Jb_GMjgdy85ePG8WDgjpYGIFgJXrzeTU6GWm2md2q3L-CK49aJ0CpahKVeyFTrIPh7Ifpu1wVO70YYy2xGe5tkbhHS1KnhkY1DDKr15KzxWd7oYCtMJxgetZjmqQ_CxR_8DzFI7lrrchH-SI425BCKybu5oGSVsqCxOD5wU3MhAAt1ChvTX6P49uwfaza91Yh7aNe6T1YDLlZje6SQOOVSU99lWSHiAA7XVLMoo1acKfWrGGOzQojA3H9jsRMFrfKSmUGjrKm7sXJ1Dd2v_hKXedwAyf9WEz0y9W2sAtej1NsmGGrlPYmvrjGEkrM2t2KcAYliUkWsxXDmUZ07D2QKfLxcNAUG8bfM-k-8gpWoItS-KJ82nxolRu2tyuVKM94Zi_4UFFsW_ZtWXM2x2g5LM9CD_3pequoFlD_3GOgcBKyTFlj6nZ_bGJEYP7Be8mszYC_U-SgxbXoKmIjNl_ldKYQ8_oetE7BcwjiaRWc6Np5p5mxrKHLDSpbaCmcQcNvBxkt0t8WPHrQen1FGNl63nzPQm5qHMZLYfy1drZySSfcX5Ez14ajkt9GMq2VO3lrMYuBkPUNKVsm4Ukz9lDDHXhfW-DsU6tbOVlylzU-EBU2VSCGyq-S4pw11PPGQE_o4QzwxL7aoJRNBNfOljj77WhgpA-0nMrWeqJucVVPpzl0uA_cloDQVrAn2GsTdu7dBCD-kCXhcM07rR0YDOsEO6gxOkiBbhUht-OgsuZpHiJGXDcnaSGupeja9BvPRZ5Lktw_CDdRY3SRvBatFb5qaZNWinxyFHTCbNf93X3Gg0EacQgSz9sL_ofaGy_RSTfmTZslWDHZb5RcZQroJ6-vb2flgDvMvRdcL9jTSs8j6JRDdfaOWyMgO3PVZ-xpjLPdIcMz0bu3uqwBkgUV2ib21MDXcqVewhOUBBVaJz9oUcFi7KVCdXWYltXN7lav6vFKw8_YzRK9EwdAAXfoyZwTWagkeXMHDAEkbdjwwLSxwQc7ikHzdSYw-2Bc8zf7bkYq9dlKbdQ_Koq-MUAlnmIKrM0ZQqG4vkQInSYznyHDNlu52gPhEqRCqYSgeDbiQwSz6dO_lKx5lFgXnTjKpTL5xXVB20RJxqJqGpL4bois1QjcLbY0ft27d-yztw_MnrKujlm78t29yXc5PEmE5G2o67WvZZpwT-bnGQoQTS8m1g_NOe3SxL1O37ZTV-QLaq9LVzIUcAgmXaK0N3iW31p71HZbYhTr9rh6JLMQuARiiJwIDbWVk8LHivaRt8iuvHwR6g8c7NNSKxnLchLRiYzWNksqiUUEGYa9zJdmXspZedRDw6yHkZHO2ZNTl9tYZFu44953HJw4ed1JzxX_fKoUlvheAyA";
  stateful_events_list_for_br: [
    "comet_metrics_viewable_impression",
    "web_time_spent_bit_array",
    "web_time_spent_navigation",
    "cloud_gaming_events",
    "cloud_gaming_session_event",
  ];
}

interface MessengerWebGenAIConsentStatus {
  contextual_chat_consented: false;
  chat_consented: false;
  nux_scope: "ROW";
  inline_disclosure_text: {
    text: "By using Meta AI, you agree to the AI terms. Your interactions with AIs will be used to improve AI at Meta.";
    ranges: [
      {
        offset: 35;
        length: 8;
        url: "https:\/\/www.facebook.com\/legal\/ai-terms";
      },
      {
        offset: 96;
        length: 10;
        url: "https:\/\/www.facebook.com\/privacy\/guide\/generative-ai";
      },
    ];
  };
  training_message_text: null;
}

/**
 * ["cr:886",["useMessengerWebThreadSeenLogging"],{"__rc":["useMessengerWebThreadSeenLogging",null]},-1]
 * ["cr:236",["useOpenThreadAfterJoin"],{"__rc":["useOpenThreadAfterJoin",null]},-1],["cr:112",["MWInboxHeaderBroadcastChannelSubText.react"],{"__rc":["MWInboxHeaderBroadcastChannelSubText.react",null]},-1]
 *
 * they follow this convention..
 */

interface FbtQTOverrides {
  overrides: {
    "1_000b6572c6a3f7fe9312e5879dd2e75b": "You'll need to login with Workplace to continue this video chat";
    "1_023ac1e3f0ce2980598584f26a784b9f": "Ignore Messages";
    "1_028dc427119e6bfbfcd5eb2dd83b2a9e": "View Page Status";
    "1_075684469438a60ae5f6813949e94a0d": "Get Quote";
    "1_0778dc4cf3fe167942881fecddd5dee2": "LEARN MORE";
    "1_08a3224cc0fd966f2bb0e780c51e6a0b": "New Poll";
    "1_0a090165a1d0654210eb444114aabd7c": "Switch Between Accounts";
    "1_0b9af3d5b6a4de6cb2b17ad5a0beec3a": "Learn More";
    "1_0d0b40d72cd2adc492a402e98e18896f": "Chat Notifications";
    "1_0ea6e742163878d88375800514788740": "Invite Link";
    "1_0ea7de82b669cced737b30875f15309a": "Local Event from Facebook";
    "1_0f008d2991187964d472eceaf9ba28d6": "Featured Sticker Packs";
    "1_0f48efb82ce58bf43dec6a98dcadc874": "Add Your New Number";
    "1_0f9fceeb2e66627d9e346dd24e0d6916": "Remove From Channel";
    "1_0fee0283487e0259495a07f9e315ad8f": "Your Home in Messenger";
    "1_1068c1352d8cbb8919cc2b4a0dbcd9f3": "HIDE CONTACT";
    "1_10811a6ece4ca15b10dc22f89805a347": "Customize your conversation with {short-name}.";
    "1_117fb24f8ee951759e9435520cc71e70": "More Options";
    "1_1248a8548f1b43fd3d9fc77baf835a04": "Contacts Only";
    "1_1593f9d2cc4c63f196a61a70eff664cf": "Send to Group";
    "1_159aa796a642d08a85379ec9693d25c7": "Opt In";
    "1_1736f6743cf12be3ffc46cd556357e96": "Book Now";
    "1_18b8ec487f180574ad865f168eeafa70": "Content Not Found";
    "1_1905e45a72593e291dda8c774aa4caf4": "Invite People";
    "1_1ac128eda299351dc18567e7a6f31be6": "Hide Video";
    "1_1b38f249fefb0fd5ef7912a1fe615d10": "Pinned Location";
    "1_1b59f7e84dba4c8754cf60d1bafa6ae5": "Shared Stories";
    "1_1cf36465e606a10ef2a48c5dee532085": "Great Job, {user_name}!";
    "1_1d36c6e7b1a07971c84821452f9dc407": "Ignore Conversation";
    "1_1d89beed629123cabeeea834c345a7fc": "Mute Notifications";
    "1_1f209b12cabbe35509c514220825d53b": "New Story";
    "1_209b3fb19e7c487ffe3bd85b2adac6db": "Try Again";
    "1_20cec0b4386ad8555f8b619ad2c2fb81": "Single Pop";
    "1_215afaeceab4d29970af2c11221f79e3": "Web Visibility";
    "1_226d5171b148e60fe004a4f3cc53a81b": "Delete Group Chat?";
    "1_23f5a1596d301feaeb32b47f24dc73a0": "Join Call";
    "1_243d55bab0d83c72b2113bfd5ca2e194": "Membership Questions";
    "1_25589d7cb1db33911bf18252dbb5155c": "Message History in Inbox";
    "1_2745ba03fa7b9c0f59c0797fb44da204": "Showing in Chats";
    "1_27f38b56fa58a394e2d89fbf7288747b": "New Sender";
    "1_28ea9e6140b5437477564e5b21353246": "Profile Picture";
    "1_2953f6f20942da4f0593b905a4db3d90": "See Details";
    "1_2af4c8cb4d30a1aaa744a75187d6b06d": "{number} Invited By You";
    "1_2b2898b200686215c54616553499fddf": "Unread Messages";
    "1_2b406f4727fff3df7dd970cac1c41536": "Messenger Preview";
    "1_2c2ff60e8d5edccadadf61f739b6d87b": "Report Story";
    "1_3002f3a3232973642407c2e3830c10f6": "STOP SHARING LOCATION";
    "1_30ed561a77bfcadb3b66d5960c2a9e05": "Photo Reminders";
    "1_313c1c8a5025b45c60712685f0d89c6c": "App Visibility";
    "1_33886f5d4a6ede055ec28ddf69251cc5": "Life Events";
    "1_3543833b8b31fbb1561d46f2c0b266a8": "ADDED WITH THEME";
    "1_366d38e456780d92844ab4b39ac1de78": "Not Interested";
    "1_37900af383a573c0337521bca05d7955": "Respond to Event";
    "1_37ebfbfd36c55a8366f7ba9d528cf7b3": "Chats You Can Create";
    "1_39339bb4b3f3002e589625a820bf5c7a": "Learn More";
    "1_3a9a1e192465754ec4427995fe1cffb4": "Buy and Sell Groups";
    "1_3aa3f2c2971602310d482c632c086db8": "Chat Hosts";
    "1_3bc7a4f74be5e3dbfdc9b758fa779fff": "Chat Plugin";
    "1_3cee79cd9e136ffc84ccfc7082bef6c2": "{number_of_happening_now_events} Happening now, {number_of_upcoming_events} Upcoming";
    "1_3e8fba90f69e371d19c5b4f79e3f0be7": "Buy and Sell Groups";
    "1_3f4c233aac1d71d17bee559b932144d3": "See Conversation";
    "1_41446ff5d2de26a67626d2ba309c969b": "This Video Can't Be Sent";
    "1_4151657ef8e7bc03ab8169e5dcb0d675": "Cancel Request";
    "1_41eadd6427237386cc04b60a8ab94a8b": "This conversation will show as unread";
    "1_46793f5529ff4a62f831cf9218082b7f": "Unread Requests";
    "1_46879d905028aaee9f7297d27c075b50": "See Messages";
    "1_46b9f298de3c041a464dbe8ff7f3d978": "Language Settings";
    "1_46c8d595559f4232c4a7fe113aac3093": "Get Started";
    "1_475781e5e945e3d217b563d6ccd51ecd": "Create Prompt";
    "1_489630491bec0288ae7c0bef88ff5ad9": "Show Music Picker";
    "1_4ad1c9e7de7af0b7d1853ed6863469db": "Snooze for {number_of_hours} Hours";
    "1_4b56df30045efb8a5d21ec865d43ec1c": "Approved by You";
    "1_4b9736a9d6cbeb6249b0704870ec383e": "No Devices Yet";
    "1_4cf8fe13a0639e31c0d73b5aec3b8019": "Sorry, something went wrong";
    "1_4d5c8cbda9ac3dfc82b483ecf952a53c": "Open Facebook App";
    "1_4e75a018ef44c107750832d736fcce90": "Send Details";
    "1_4ee7496edd4dafc3c2b2a6225f1a6f69": "Nearby Places";
    "1_5009586cb3b7953608b1ccc56cb3e630": "See Conversation?";
    "1_50c0e7742a3eb3800f3c2fdd5bce8f3a": "Admins & Moderators";
    "1_531aa532255f18fbb4386d4ac4bf537d": "Search Emoji";
    "1_53e9c4c2a53662ab23979d6cd79d4417": "STOP SHARING";
    "1_5490d986c6908e35ac70ae79cca740fc": "Switch Account";
    "1_55c0717e522433cf319a51f6ed6d4d09": "No Messages";
    "1_55c2f7ac43fba60f684a0a0dfd01bb89": "Edit Avatar";
    "1_55e31911698e89d3b19d4c703079cdf2": "{content} Learn More";
    "1_56d2098fc23416108de3ceae0fd6c158": "See Link";
    "1_599d20d959e0009397c73fb9edb426dd": "Private Post";
    "1_5af9abe8c5f4d9bcce27117d09ca6932": "START CALL";
    "1_5e86ca443695bbd6605bcd169ee35a74": "Group Updates";
    "1_5f0a4852946206863aa44a9ec3f87708": "Send to Group";
    "1_60a7a58934bd27cbaf2058b53ff745f6": "Leave Game";
    "1_60eb52f4ce4a109523fbfa8e90244331": "Live Location";
    "1_617aeb029449c78895903ece88034b31": "Show picture in picture";
    "1_61cb9f934ffb6b5f8cc4cb95757125d4": "Invalid Time";
    "1_6315107c7594ac961c8dac9aabbb957a": "Add to Her Picture";
    "1_64b1b9a14a334d3cce48f22f2b03e7c2": "Not Now";
    "1_6544e705bd98780c45018863ca564aa1": "Block Messages";
    "1_6582285731ad9288ac97889beeca82f3": "Avatar Settings";
    "1_66402d631b18879269b46a49f95a0a4e": "Noise Suppression";
    "1_6689492f38a51b5cb39982dd8a0e7f00": "Account Details";
    "1_678bfb1d36a580695ccbb699c8fd1bd2": "Signing in\u2026";
    "1_6795cc13b37b3be61a143c35c9c65382": "RECENTLY SHARED";
    "1_6a9a0529abd169ff91b49b4022dbf5a5": "Buy and Sell Groups";
    "1_6b124b9a53cd1299ad43ceef50dcd0e2": "Unread Chats";
    "1_6d2f04c835bd2e9e555649e2f121fd5f": "Introducing AI Stickers";
    "1_6dc5cc58c44e3791e14cdb69816e8a3f": "Product Catalog Terms";
    "1_6ec9c14f5b6103937c24960c6ae37947": "SMS MESSAGES";
    "1_7008293f762c6b49632496bd6aad21ff": "Suggested Chats";
    "1_70190249ea4fa344ffbe77fd48af796f": "Pause Chat?";
    "1_701d063f9d93574540e7a4aa27d2f86d": "Message Reactions";
    "1_7052e2f38bec805609d7986562d34ed0": "Your Reactions";
    "1_72920428a45b969c9dad788a656c323c": "Skip to Details and Actions";
    "1_7341e8b3089e0af586ed3b9682c2b5cf": "View Call";
    "1_73761caf2fde503928bfdbd48c983136": "See Conversation?";
    "1_7808c5327cf430807c173fa11ac0cc26": "Learn More";
    "1_7930f1b92ced21f16265c1ab07265964": "Chats You Can Join";
    "1_7bf132b7beb84dbc96f9cc6a1caef3a3": "Last Name";
    "1_7c5789ad7c9455a96fa0b8d3edaf1dd0": "View Profile";
    "1_7e3e738782f1887fbcebca5e62902a72": "See Group";
    "1_7f626e74849fb5ad4a61825532fb6054": "Confirm Your Identity";
    "1_801af62106d995c8b376a512e2146039": "Block Messages";
    "1_806d0518a4e1e599c196185438e2b79c": "CHANGE IMAGE";
    "1_83a0754dbad2db42dcbe0e8900e6b48a": "AI Assisted Message";
    "1_84698e2e6128e955605ddff2615c2771": "In Transit";
    "1_88b60e4824d116c36468b700b6287e2f": "Your Location";
    "1_8a1749bf031ab122983b76b370a86be3": "Learn More";
    "1_8bc33223ef4caf9b437b812c2772d946": "Create Poll";
    "1_8c84ed97d7d84a31c72b1c75300a9461": "Delete Chat?";
    "1_8dea727922641bc0de681cb214274b2f": "View AR Object";
    "1_8e82c5b24398a0887342f439b66ce8c3": "{user}'s Location";
    "1_8ea29d4da797ad3ae8fa2b3626b2a50c": "Disabled Chat";
    "1_8ef9ffb962319c095470bb46de00beaa": "Current Location";
    "1_9025bb6bcf560d6de6cfd22af6eaec97": "All Chats Menu";
    "1_9050fb0878cf1e782d24779cf780114c": "Recent Calls";
    "1_91d783db2fb886ee4801ae5e0a86e04c": "Channel Admin";
    "1_92255cd3d8f183d6dcb03b606a3445c2": "Recent Searches";
    "1_925dfeb7269a4b97e5035aede422151c": "Upload Contacts";
    "1_92b1a4d18dca5da9ac47d17733885fc2": "How to Add Friends on Messenger Kids";
    "1_93183c880d14f092e5d9617d9a246a74": "Read Receipts";
    "1_939fba302a75b306e132ccb37e09a148": "Ignore Group";
    "1_944401d1748eeaa9a66e62241477695e": "View Details";
    "1_948415d2b551fa7c8b50376738732e5b": "Community Members";
    "1_9626d7ac31beaf24bbd48f4842bf4744": "{num_activities} Activities";
    "1_9645bee1f9dba4ee355d68df18cb1102": "Contact Card";
    "1_96cc0d1d8acdfbcc9fe4623a53183f99": "No More Posts";
    "1_983e4f9e7f9ecfdb8a2d0aa8247942de": "More Conversations";
    "1_99dd31ad1b3145dfb03b7b4b097f28d5": "Send Current Location";
    "1_9ed1ff8f2501b81918e505f6e17fd362": "Send Separately";
    "1_a1195adc52046789d21a0ae117244224": "Creating Poll";
    "1_a12b852de26a50e5b6986edc7fa2705e": "Account Created";
    "1_a2ed1fddb5b17414f3b7941385713361": "Suggested People";
    "1_a3d27f40032c3217f0934bcd46d52392": "Learn More";
    "1_a3f05430c2d2c4a7949a503649a0941d": "4 Things to Know About Your Information";
    "1_a4694c6ccbc990026015c70c944fe25e": "Cover Photo";
    "1_a64a04c8ea9a8cf38124918e78c71b60": "You've Blocked This Account.";
    "1_a7a430455b6aaba0be1cf776314c8e70": "Learn More";
    "1_a7e141af65d2cd2dc972d3c094d2ce4f": "Charge bluetooth keys regularly.";
    "1_a8fd7153d9fbad9cece5913d6268813c": "Voice and Video Calling";
    "1_a96a641ba1f4b43910fab6d1b55c9b17": "Not Now";
    "1_a9c08e1b18c1bceb358a7bf4a1aee0aa": "View Profile";
    "1_ab80b68f0048ce8515584d069d120405": "Submit a Report";
    "1_abd30739736c002c9a49c782066cbe86": "Save Changes";
    "1_add682c72addd3a0d8b6fcab3720aadc": "Turn On";
    "1_aeb4b99dd7b73001a4f730b4a9120e04": "Try Again";
    "1_aec2472fe4a2eaccb817d6111a4c0d39": "Video Call";
    "1_af9c98d11efedfee4f1301601a67874a": "Double Knock";
    "1_afc0eae78aa06ac4e92bf98ac3a03177": "Ignore Group";
    "1_b0308bd1c93ff21594fabd353bda0a2a": "Red \/ Green";
    "1_b14ffeb649c54cac70fe09d9f7780889": "Open sticker, emoji, and gif keyboard.";
    "1_b22b6c4a8dd3ff71f35d007751cd87b0": "Get the Messenger App";
    "1_b2cea7ff1ee86133589fc73e5f2f3f9d": "You can turn this off at any time in the Parent Dashboard.";
    "1_b32cee1f96ea285d99c5ca73d4eb725f": "Date of Birth";
    "1_b3dd269103f0d9b89d9bdb677dbd8887": "Invalid Link";
    "1_b3ecf06a63fd5147cac3c083201ac7eb": "Data Saver";
    "1_b42224e77c208d4ee532f212f5fe7a47": "Learn More";
    "1_b449f7098ace13c92ffc9bb9d5a5bb6f": "Live description (Optional)";
    "1_b45945f81d03ceaf6f9441f2eeeec891": "Contact Us";
    "1_b4c7d1e15b39ef2c3956027bb4d6cd11": "Placed on {date} \u00b7 Cancelled";
    "1_b6392edec7f022a20e9867eb0b24de7b": "Featured Facebook Photos";
    "1_b6f50b519cec90102cc5b62361a81288": "Mute Notifications";
    "1_b81d470fc8105e7a7896e7cffb0ceeed": "Add Contact";
    "1_b9143060878dce3a509e6bc2548b82f2": "Search for adults\u2026";
    "1_b997548b5fdd3a2dee73c3392135d911": "{number} Invited By You";
    "1_ba4838bc3349d125cfb867715cada2f9": "Update Build";
    "1_bbc5d4c00b66cc87bd1e6f8ab51fc102": "Call with Video";
    "1_bbd9c674819da6d44ca09fa575180083": "Videos to Send";
    "1_bc1a68f2efbc9ac36f13fe05f5d65e51": "Unmute Notifications";
    "1_bc5ed53c58ed1544e3e014e9d7dee341": "Creating Community";
    "1_bf841bb55b37d0620ef1b2bea096b95f": "You waved at {$recipient}!";
    "1_bfbf4cbd94a30fe78e2c6243fbaedb73": "No Internet Connection";
    "1_bfef0efc933e18bc735d53351af694e0": "Photos to Send";
    "1_c174849dd6b0df72ce6c611bda774209": "Add Option";
    "1_c21bf170fea995d887a6b64c13639323": "Double Pop";
    "1_c6f4d12c2c30c1986800afdd50f373cd": "Preview Chat";
    "1_c794c37e69d7f325e9a433f02ba8790b": "Message Requests";
    "1_c8077b6c0597db47a0485bc0f32e9980": "Your Avatar";
    "1_c921177d0d05ed9c9b95487f15422056": "Delete Channel";
    "1_c94482ebd9b72b746183c50a4d4208d6": "Send a Like";
    "1_cb73b265ac209451363883bed772c9bb": "Play Together";
    "1_cc78ccf039dccf8d1dea818b85eab80d": "More People";
    "1_cd6b327676433f7b3c3515f206c0b82a": "{phone_number} \u2022 Phone Contact";
    "1_cdc01fc97f5a6cf6ba07c7bcc4fe11e1": "Add Question";
    "1_cde9138094eb836637af973172431d53": "{name1} wants to add {lastPendingKifTargetName}";
    "1_ce3d72055f43aaf90d886ab0017ca08c": "Recent Articles";
    "1_cef77356ede0b83cf0465641b0719a42": "Problem with bluetooth or audio source";
    "1_d29c32cd116f7833d1f496f064788d8c": "Report Someone in This Chat";
    "1_d3e1e228c31890a4aba20db8d31fd323": "Notification Control";
    "1_d7bbd024b73557f1cf0914a38113498d": "Block Messages";
    "1_d8de8ea2ef707a7aace4a752b147d8f1": "Mark as Read";
    "1_d9f5379b09800045f33f218dc5408f64": "Welcome Message";
    "1_dbd60e7eb18c870f9603d90f44f244ab": "Group Chats";
    "1_dc6a01243c06b93a27cbe6c6d6c795f3": "Camera Roll";
    "1_dcabb4806e92c408bd735494ddd92a6c": "Draw a Necklace";
    "1_dee291c2ba2b66491a65be6138906278": "Hidden Group";
    "1_df45795d00cab7a89a5557f9a392a7b2": "You opened this conversation from {Origin Domain}";
    "1_df57e221cb0b224e5a0090f7dcef6677": "Forward Limit Reached";
    "1_df848a5c2d023027ac455f8321243645": "Report Buyer";
    "1_e11f9f6dcd24ac5786c0eb8ff1851e1b": "Update Information?";
    "1_e12cc3ec2ab93b6916804e5e1f6a336f": "Add To Story";
    "1_e146ca287d980280ff6dabc5d32b2713": "Leave Conversation?";
    "1_e250ac43039a943db6bd1855c02f6c39": "Learn More";
    "1_e27604669dde9743f8c4a735e650e5a6": "Thanks for being a superstar in this chat.";
    "1_e57e0918dc3eb089646890b6bb915dc0": "Choose Kids for {name1}, {name2} and {name count} others to Chat With";
    "1_e7861583dd9505c6c9a5dd36aca38d3b": "Unblock Messages";
    "1_e809c2825e3b050976f7ca22f1532032": "Faster Messaging";
    "1_e8d7d977b19c2aa1894496a663c986dc": "Blue \/ Yellow";
    "1_ea8ff502404e09cf262e602989d843d8": "Go to Recent Chats";
    "1_eceb9aa9398269f52436f1a1a7ee41b4": "SEND TO GROUP";
    "1_ee9abb17ff7ad017ae988a02f8f5beae": "Top Friends";
    "1_eec0e983014426e06f0c4077e7333275": "Unblock Messages?";
    "1_ef4b4300b7a1f0319566068f5568c938": "Updating Poll";
    "1_f165e0191456b0373edec046de3290d5": "Active Now";
    "1_f2010c43a90ee7c3b7d6d3cab66ef06e": "Social Networking";
    "1_f33ba2aba991e0820ccfef1ac81c4c14": "Recommended Communities";
    "1_f580546da084946da3d6f61e3cc636da": "Channel Settings";
    "1_f5d924ee511bdbc00c3dd05a10fe8260": "Please Update Your App";
    "1_f816fc32554f392be8655ee6db8f7dd5": "Continue With PayPal";
    "1_f90fb65f92ad8ac33f140b8be3c9eed1": "Invalid File Format";
    "1_f919ada00521135434fd084a87e64542": "Add Photos";
    "1_fa663c0ee32eeae58fd133765c35f905": "Learn More";
    "1_fba7ed548a73364cce9a2ad6e168b798": "Audio Call";
    "1_fd3afb0fabe31263a19dac9f61fb0d4f": "Look Up info";
    "1_fd7ada49a7f6f2ab82454ec27b9c6725": "Couldn't Remove Message";
    "1_fdf2eec743eaf4ee4b25a683f71525c6": "Add a Profile Picture";
    "1_fe84ad51b794fd555ef027662cbb6f2e": "Event Creation";
    "1_ff1c542ee2c5bb59ee27ade5e7e52cb4": "Resume Chats";
    "1_ff6b115a8a131f9f1b4b8c9c80ec38d4": "For Families";
  };
}

interface LinkshimHandlerConfig {
  supports_meta_referrer: true;
  default_meta_referrer_policy: "origin-when-crossorigin";
  switched_meta_referrer_policy: "origin";
  non_linkshim_lnfb_mode: null;
  link_react_default_hash: "AT6__s8UD5Pd7jeC0NNy5JvgM2krNBPPjORNNYEVHU5KTwG5FZI6mLv2cw8dOb3yaxShpsRgfY-jGitJ41vDNo8hPQ-IR3-dYacPkpbqZAdZEpJYfiOh7iXtUST6HOU2zxwsig";
  untrusted_link_default_hash: "AT6whKJNmDghiXVWVxb4N5smhbuMUV5aHU79f25VHAoSVpw97Ywohs5baKoAMgCyWp4x9rLfDEQseeHJy8OKIPovObix8vr9xPpusROjs8xhCoyLXpGBGXO-1gU1nqz05GFTjw";
  linkshim_host: "l.facebook.com";
  linkshim_path: "\/l.php";
  linkshim_enc_param: "h";
  linkshim_url_param: "u";
  use_rel_no_opener: true;
  use_rel_no_referrer: true;
  always_use_https: true;
  onion_always_shim: true;
  middle_click_requires_event: true;
  www_safe_js_mode: "asynclazy";
  m_safe_js_mode: "MLynx_asynclazy";
  ghl_param_link_shim: false;
  click_ids: [
    "IwZXh0bgNhZW0CMTAAYnJpZBExWVU5REZoZHhCWVN5QXJ0QXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR7ypHJxCiiYlimIoO3Bur4m_udRVEqJm6yk3XtLhWq5GL7PFiMnnE5ITjfWqg_aem_Pj548NCysaWTdJKBJxcMXw",
    "IwZXh0bgNhZW0CMTAAYnJpZBExWVU5REZoZHhCWVN5QXJ0QXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR4pI-7yyr8Bpvg56xdyL0jWp86okpqCIOhhJ5JG9945ATN6dar5wa1r9BVf9w_aem_JCNPvzHXjxCKGFAyxJm1Ng",
    "IwZXh0bgNhZW0CMTAAYnJpZBExWVU5REZoZHhCWVN5QXJ0QXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR61nMs56ZbJ5Aq42KKinXDR0p5i0nhuuHApbknS7JXM94jI5XVTMzM2a3DrJw_aem_vt-xaQRY_aunOdfUCljbww",
    "IwZXh0bgNhZW0CMTAAYnJpZBExWVU5REZoZHhCWVN5QXJ0QXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR7nOK22bzDEyVUe14iSiN6UDol-6ylhuuzjcFjfvqkyLWQgCT6sX-UIYzk5vQ_aem_sYFF0pzQUBIru8ZELOkEcg",
    "IwZXh0bgNhZW0CMTAAYnJpZBExWVU5REZoZHhCWVN5QXJ0QXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR4Jnh5mcT5iP4vr3jXAnB4sIt2e-CyonCn5ERfwfRUJ3pfhQRZV0cw0f6nKtw_aem_uqpodWh3LKy5G2iT4-aMxA",
    "IwZXh0bgNhZW0CMTAAYnJpZBExWVU5REZoZHhCWVN5QXJ0QXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR4DpwfiyT_w9fUid_q2w7dSxCu3ImJQSMLGElNTT33wC-_lvDZjGSH8OIFcgA_aem_XwJtIjRKQ9_dkv0SJa4KVQ",
    "IwZXh0bgNhZW0CMTAAYnJpZBExWVU5REZoZHhCWVN5QXJ0QXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR74MxiOTSrWpm5ecTlbfGI_jWVY15RIwd3wUAe0yJGisP0rf1TtEPUD6bxSMg_aem_LS4NVJVm9ilAirAtJVGxqA",
    "IwZXh0bgNhZW0CMTAAYnJpZBExWVU5REZoZHhCWVN5QXJ0QXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR41cXKrnIuK_t4r-brQ65dGuJ1TlLbkoXuAUERipe46QT5hFyoxjr7vLA5a_w_aem_y0e1I9LicfOEJGIMJbGFjg",
    "IwZXh0bgNhZW0CMTAAYnJpZBExWVU5REZoZHhCWVN5QXJ0QXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR5KCd-vxyw2d6j2Q9O647mBv_m6JetIHiISsEH77CEipjaSwFLWrv3ehi_F-g_aem_ETMKOWMRJvY_X2nUABeE-Q",
    "IwZXh0bgNhZW0CMTAAYnJpZBExWVU5REZoZHhCWVN5QXJ0QXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR4SyzTPW8tofqNp6xGEKVoDN_x7C49BhlLzhqEuoMTCkY1WPpvsUda5YAp1Bg_aem_-DF-1SK_hHtBDti7RgbmHg",
  ];
  aggr_ids: null;
  is_linkshim_supported: true;
  current_domain: "facebook.com";
  blocklisted_domains: [
    "ad.doubleclick.net",
    "ads-encryption-url-example.com",
    "bs.serving-sys.com",
    "ad.atdmt.com",
    "adform.net",
    "ad13.adfarm1.adition.com",
    "ilovemyfreedoms.com",
    "secure.adnxs.com",
  ];
  is_mobile_device: false;
}

interface GetAsyncParamsExtraData {
  extra_data: { __aaid: "0" };
}
interface CometHovercardSettings {
  hovercardInteractionPreference: 2;
  hovercardSettingPreference: null;
}
interface CometCustomKeyCommands {
  customCommands: {};
  areSingleKeysDisabled: null;
  modifiedKeyboardShortcutsPreference: 4;
}

interface CometDenseModeSetting {
  initialSetting: "COMPACT";
}

interface ProfilePlusMessaging {
  shouldRedirectMessagesForAP: false;
  shouldArchiveInboxForProfessionalProfile: false;
  mailboxID: "100054303594421";
  delegatePageID: null;
  businessID: null;
  shouldDirectToMBSInbox: true;
  shouldDirectToMBSInboxGK: true;
  shouldDirectToMBSInboxFromPagesManager: true;
}

interface MessengerWebInitData {
  accountKey: "a1054eeaae211230ae5ddb4ca706829f04da6ce2219f4d2c70ec7585fa92cf3c";
  accountKeyV2: "a2e0cd11127795ced5f9680bcbb524ba6ad641722f01c6e4866e2a52c3acd57a";
  activeThreadKeys: [];
  allActiveThreadKeys: [{ id: "25742992745315795"; e2ee: false }];
  appId: 2220391788200892;
  createdAt: 1775667957214;
  cryptoAuthToken: {
    encrypted_serialized_cat: "AXrRGv-4u1fBqurRCdaUyc40-E0WZsyVLwvgMsUEZ5MdnE-V935gJHMCcdtEkaR4QP9bqsqC3aCboXvNcJX-15YxpIrsPnto8i3NJ3rDw2cx16ngVDe2N33chHOKBoVGCV2NqlHTswoIubZ_L-LBEWSCqv68TYhh-vxr2eM2zEasswvTm2okzpeK2fNNivz6oIqtAvqKFjRGAbtyEYTPmSXAW00XggrqjjbZ-y_P1_yf8iBXMi02oQ12PFjqPXfvO_QuvLfJKpmeXN57N9tkFEccM5qzTQIpyd8d1PUym84frpnIdmG9nyPMfzNCfVTZE4Rsi6jrj8IElXV0ALbzjMk8vyg5uOOPV-Cdmg0IzRf24_lSO-JcHqHvJBJ49EvFOaavTjLxJwzmE3ztyyKUO0QKjebYn-XIkwSdawRicm4LLKdfdGU7qiz3QMiMRrUefbc5oYHpVrTPFoLYZsFmD3_tLHYcdWyas_5rrUzoBG3VODBJ0vP_x-p07UQsuRZw2f53NhzRQaF1XwzlBUt4bi0ZvdVyNelH09EdwmP8-vTh9pXxYZxg5cy_o7VLSPW2U8tL-bbL9OrqREaDkmGnkd4SMBC6v2u1YIy5-xnyqaSsyzVtcN4kXgbqzShRkmgLq24a7oMbgyc0zf_Yftzhp8j52Nz-jOvOQ31Sfa6ZDaRb6LTbjDYcQJes0u_FGKgkjC43DEUEQ5222_enadKVrKy5O2ggOeKeR99rjpa_arKR-2jwAz-C9vHbrIAO5mRbY3SZTZag8GHFQZgjJl6TPYWUA9Kniatoy-E1yW7WOuqqfhw6Ig1Rjeftyw7Xc50tajZlyVUMaRout4p-WH7g0bvQ77B7TrYghky4lmlaHNoJ0Hyv0fExNI0SnXOMGyyjtUG1vLS5G_zFafJza-AUdBpXMHKyboMTcHp-7iu9FYB4pwrSqnku8_R-lFJXYBqZWOO0Wf7VzAmHGahLa7MspZNB3ofrGH8VM9Uz7Sf3MHphQtdJyYsHFWVwa6Y5lPwERC1WJxFmhnt7ZaOZKiV7_ySOSAOghPYiOSNW0lKEdvcJvV_pd6fltEbHcKNWed1TqqlylUbV17snngDiP6zoHvulNta6mSUsD32n6kBkUbGZJPW5USes4blpCmeTsb1JKnp1-qBWFm4866Dx3GS4NVpwdd5kzeXSXGxU_UXzqnClAlqMUKkIkfSEUK4C8Pd2Rwudj-Wwwa6jQBIdcAWiv8-TIb7TqpyCjTr_djLAaMVj3D856OohZbeFYF6ACG1GW8S9MzSKJcL5Zg9d30Uk-Ok9HsL71XJFYxe5KhvKnrVnV9ms2Wz7-fhMMCYZF8c0tCuq3C-i2gfh46cSJyFfo_URrPq7EeHk8jvu7MFPCxCRsQ839CT41drkaZwgRRWLEgBU1aGGFrmn81UfnfLZtB7W2mG06-tCkkIHlXXfJ01pEBhCmV-ofP8mVDh90-sm3Q1KTbAFJEL8UCCk1JSWgMF7UOggWOB-4V77X_7L7NE6fyQ7hfQgYLxuwio2Q3zOBSxHgnLlUkuzNJndMMl1FJD5oLPwBao_tRbFLj4ZSUgGTvwiqhl3mwJoAQoDMUti96eKseY-5-RGJn8BD1Yuk5PpghAs06-bhFNV-klZQ5a-Egz1QrNJ0LfU0vXrhbvdI-n972gpT-eM4eDVTCJmGgT7Da7cYPxP86CtlSlb60rzp7BGE6jY9mWWMgEZPehusX2zn5MFBy4Cpdpxi6MvVUpIhc3J85921Nm1Kpgqgty_JTCpOZJEEU_F_Oq_iogiJg7MrdMjOLhUlebVVntRp7wxySBBpjr1-0NkDD9lKPQGYbfzN5aWNHDheBvHRyDt80IexhbBwlwUL74ySzwmmCp3LTvppK9mk2PYs54Ln0qwETJpTnvg3IQScAD1znSITOu4TinHB7WiNEfys0CiV2smwGOWjGn2k1lh9IxkynEl0FJFkD6LFEvspS-Xm-VbSk0nB9hRuxZnh6P-ZtR-mCx2Yxgoejfs4uNT7VUVJUzczTRLEQY2qIVr24DBodCABcOcieOiDn9aJjshavF_y7PwOM1TJe4qG16R5qD0wMtnv3hDvuqAMXRUKlLXaNVCwMqrp6-XGZ6auvyGOCaRW158PzEnYaPQVzPf01THwX1fvgIlIiZlwXhFOLfT5j1pWNWVHhFR6MSQ2LL6_3sir4DBKjFOOn7nndWq6OvIqp3kEyFR8YuaaVBwMPEZJwvVHQLvBt9AMTVtHJ-bhXqRj9hxQPb0LiDgJLKj0veLtyCZQKz7skZ8f09WsqitoGXJ0wIZ3HUpKB-2FRlVsw_-9VvxYA6vS78HAbs";
    expiration_time_in_seconds: 1776877557;
  };
  logoutToken: "Afiicc_ek78GEYgOcK0";
  sessionId: "38";
  userKeyBase: "8564ae5dec5896620afcfa0ba620ba2e850ede94cbf9fcfc3122c8dedd5f874b";
  userId: 100054303594421;
  additionalAccountKeysV1: [];
  gkInboxFollowUpEnabled: true;
}

interface PresencePrivacyInitialData {
  onlinePolicy: 1;
  privacyData: { "100038438501017": -1 };
  visibility: 1;
}
interface MessengerWebPrivacySettings {
  read_receipts_disabled: 2;
  e2ee_xma_previews_disabled: false;
  e2ee_hd_media_enabled: true;
  biim_featured_unit: 0;
}

interface AvailableListInitialData {
  activeList: ["100019901604895"];
  lastActiveTimes: {
    "100085553743428": 1775660703;
    "100042734714474": 1775665894;
    "100003621932725": 1775658758;
    "100020946608642": 1775650896;
    "61554739299349": 1775660129;
    "100043077015549": 1775662589;
    "100050749249835": 1775664207;
    "100088046124795": 1775651291;
    "100040106713843": 1775659709;
    "100039199253058": 1775664932;
    "1132372794": 1775663864;
    "100000733251253": 1775667659;
    "100055456086949": 1775666744;
    "100039142547077": 1775659545;
    "100051652422632": 1775629516;
    "100053091910093": 1775666915;
    "100019901604895": 1775667956;
    "100061773345144": 1775666897;
    "100078061633069": 1775649611;
    "100003121021010": 1775656225;
    "100075058221244": 1775660912;
    "61582667207238": 1775662641;
    "100062061853421": 1775666173;
    "100024948262329": 1775662208;
    "100053450268929": 1775655398;
    "61554256615006": 1775627161;
    "100000632830758": 1775661237;
    "100032056871226": 1775667423;
    "61554770649284": 1775667075;
    "100093099606387": 1775646599;
    "61586109985624": 1775665563;
    "100055943906136": 1775665302;
    "100054611492652": 1775657736;
    "100004543008125": 1775643031;
    "100007651807367": 1775666669;
    "100054302546655": 1775661593;
    "100062905607690": 1775649294;
    "100003748955481": 1775663176;
    "100062428534014": 1775647819;
    "100034282609124": 1775652866;
    "100054903454322": 1775648909;
    "61555527081749": 1775667383;
    "100000024300845": 1775617106;
    "100090929621761": 1775654084;
    "100000925894596": 1775625659;
    "100081144393297": 1775665662;
    "100052734823265": 1775664794;
    "100043890635852": 1775667710;
    "100074950773266": 1775666755;
    "100083671433586": 1775600235;
    "100094941387595": 1775650584;
    "61555034215595": 1775663299;
  };
  chatNotif: 0;
  playingNow: [];
}
