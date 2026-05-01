export namespace SequenceID {
  type ParticipantCustomizations = {
    "participant_id": string;
    "nickname": string;
  };

  /** Can be DIFFERENT on each field in an object! NOT A CONSTANT VALUE */
  type CDN_URI = `https://scontent.fmnl9-${number}.fna.fbcdn.net/v/${string}/${string}`;

  type Participant = {
      "admin_type": null,
      "node": {
        "messaging_actor": {
          "id": string,
          "__typename": "User" | string,
          "name": string,
          "gender": "MALE" | "FEMALE" | string,
          "url": `https://www.facebook.com/${string}`,
          "big_image_src": {
            "uri": `https://scontent.fmnl9-4.fna.fbcdn.net/v/${string}/${string}`
          },
          "short_name": string,
          "username": string,
          "is_viewer_friend": boolean,
          "is_messenger_user": boolean,
          "is_message_blocked_by_viewer": boolean,
          "is_viewer_coworker": boolean,
          /** Have not discovered this data type */
          "is_employee": null,
          "is_aloha_proxy_confirmed": boolean,
          /** Have not discovered this data type */
          "scim_company_user": null,
          /** Have not discovered this data type */
          "work_info": null,
          /** Have not discovered this data type */
          "work_foreign_entity_info": null
        }
      }
  }

  type ReadReceipt = {
    "watermark": ReturnType<DateConstructor['now']>,
    "action": ReturnType<DateConstructor['now']>,
    "actor": {
      "id": string
    }
  }

  type Sticker = {
    "id": string,
    "pack": {
      "id": string
    },
    "label": string,
    "frame_count": number,
    "frame_rate": number,
    "frames_per_row": number,
    "frames_per_column": number,
    "sprite_image_2x": {
      "uri": CDN_URI,
    },
    "sprite_image": {
      "uri": CDN_URI
    },
    "padded_sprite_image": {
      "uri": CDN_URI
    },
    "padded_sprite_image_2x": {
      "uri": CDN_URI
    },
    "url": CDN_URI,
    "width": 240
  };

  type Admin = { id: string };
  type RTC_CALL_DATA = {
    "call_state": "NO_ONGOING_CALL",
    "server_info_data": "",
    "initiator": {
      "id": number
    }
  };

  type UserGroupChatsNode = {
    /** A random string like: bWVzc2FnZV90aHJlYWQ6MjgzODk4MDQ3NjQ0MDQ */
    "id": string,
    "thread_key": {
      /** Thread ID */
      "thread_fbid": `${number}`,
      /** Undiscovered */
      "other_user_id": null
    },
    /** The Group Chat's Name. */
    "name": string,
    "last_message": {
      "nodes": [
        {
          "snippet": string,
          "message_sender": {
            /** The Message Actor */
            "messaging_actor": {
              /** The UID of the Sender */
              "id": string
            }
          },
          /** Precise Timestamp */
          "timestamp_precise": ReturnType<DateConstructor['now']>,
          "commerce_message_type": null,
          "extensible_attachment": null,
          /** Sticker Metadata */
          "sticker": Sticker,
          "blob_attachments": [],
          "platform_xmd_encoded": null,
          /** Who can unsend the message */
          "message_unsendability_status": string | "deny_for_non_sender"
        }
      ]
    },
    /** Undiscovered */
    "thread_connectivity_data": null,
    "thread_associated_job_applications": {
      "nodes": []
    },
    "thread_associated_page_admin": null,
    /** Number of currently unread messages in the chat */
    "unread_count": number,
    /** Current number of messages of the group chat */
    "messages_count": number,
    "square_image": {
      "uri": CDN_URI
    },
    "image": {
      "uri": CDN_URI
    },
    /** Precise Timestampe the chat was last updated */
    "updated_time_precise": ReturnType<DateConstructor['now']>,
    /** Mute the chat until (for the user's acc, not a ban) */
    "mute_until": null,
    "is_pin_protected": boolean,
    "is_pinned": boolean,
    "is_viewer_subscribed": boolean,
    "is_other_recipient_page": boolean,
    "thread_queue_enabled": boolean,
    "folder": "INBOX",
    "has_viewer_archived": boolean,
    "is_page_follow_up": boolean,
    "is_page_unresponded_thread": null,
    "cannot_reply_reason": null,
    "can_viewer_report": boolean,
    "composer_input_disabled": null,
    "ephemeral_ttl_mode": 0,
    "customization_info": {
      /** The emoji set to the group chat */
      "emoji": "",
      /** Nicknames of the Participants */
      "participant_customizations": ParticipantCustomizations,
      "outgoing_bubble_color": "FFAF2020"
    },
    "thread_theme": {
      /** The unique ID of the theme that's been set on the group chat */
      "id": "1280698400183771",
      "fallback_color": "FFAF2020",
      "accessibility_label": string,
      "reverse_gradients_for_radial": boolean,
      "gradient_colors": [
        "FFAF2020"
      ],
      "reaction_pack": null
    },
    /** An array of objects with uids of the Group Chat's admins */
    "thread_admins": Admin[],
    /** Approval mode status of the GC: 0 disabled, 1 enabled */
    "approval_mode": 0 | 1,
    "joinable_mode": {
      /** Does the group chat have JOIN LINK enabled? */
      "mode": `${0|1}`,
      /** Group Chat Join Link */
      "link": `https://m.me/j/${string}/`
    },
    "group_approval_queue": {
      "nodes": {
        /** The user who wants to join the group chat (requester) */
        "requester": {
          /** The UID of that user (requester) */
          "id": string
        },
        /** The user who added the requested user to the group chat (inviter) */
        "inviter": {
          "id": string
        },
        "request_source": "0",
        /** The timestamp of this request to add a user was made */
        "request_timestamp": ReturnType<DateConstructor['now']>,
      }[]
    },
    "thread_queue_metadata": {
      /** ?? Idk the relation of this to group_approval_queue probably the requests themselves? */
      "approval_requests": {
        "nodes": []
      }
    },
    /** Event reminders in the group chat */
    "event_reminders": {
      "nodes": []
    },
    "montage_thread": null,
    "last_read_receipt": {
      "nodes": { "timestamp_precise": ReturnType<DateConstructor['now']> }[]
    },
    "related_page_thread": null,
    "rtc_call_data": RTC_CALL_DATA,
    "marketplace_thread_data": {
      "for_sale_item": null,
      "rating_state": null,
      "buyer": null,
      "seller": null,
      "eligible_profile_selling_invoice_actions": []
    },
    "associated_object": null,
    "privacy_mode": 1,
    "reactions_mute_mode": "REACTIONS_NOT_MUTED",
    "mentions_mute_mode": "MENTIONS_NOT_MUTED",
    "customization_enabled": boolean,
    "thread_type": "GROUP",
    "group_thread_subtype": "ADMIN_MODEL_V2_THREAD",
    "participant_add_mode_as_string": "ADD",
    "is_canonical_neo_user": boolean,
    "participants_event_status": [],
    "page_comm_item": null,
    "admin_model_status_string": "required",
    "groups_sync_status_string": "UNSET",
    "groups_sync_metadata": null,
    /** Pinned messages of the group chat */
    "pinned_messages": [],
    "work_groups_sync_metadata": null,
    "saved_messages": [],
    "description": null,
    "joinable_link": null,
    "is_fuss_red_page": boolean,
    "linked_mentorship_programs": {
      "nodes": []
    },
    "thread_unsendability_status": "can_unsend",
    "thread_pin_timestamp": 0,
    "is_business_page_active": boolean,
    "conversion_detection_data": null,
    "all_participants": {
      "edges": Participant[]
    },
    "read_receipts": {
      "nodes": ReadReceipt[]
    }
  };

  export type ResponseData = [
    {
      "o0": {
        "data": {
          "viewer": {
            "message_threads": {
              "sync_sequence_id": number,
              "nodes": UserGroupChatsNode[]
            },
            /** Pending group chats in the user's message request */
            "pending_threads": {
              /** Number of pending chats the user has not read/viewed */
              "unseen_count": number
            }
          }
        }
      }
    },
    {
      "successful_results": 1,
      "error_results": 0,
      "skipped_results": 0
    }
  ];
}

/**
 * @example
 * mqttClient.publish('/message_sync_create_queue', JSON.stringify({
    "sync_api_version": 10,
    "max_deltas_able_to_process": 1000,
    "delta_batch_size": 500,
    "encoding": "JSON",
    "entity_fbid": "<ACCOUNT_UID>",
    "initial_titan_sequence_id": "<LAST_SEQUENCE_ID>",
    "device_params": null
 * }), { qos: 1, retain: false });
 */
export interface MessageSyncCreateQueue {
  "sync_api_version": 10,
  "max_deltas_able_to_process": 1000,
  "delta_batch_size": 500,
  "encoding": "JSON",
  "entity_fbid": string,
  "initial_titan_sequence_id": number,
  "device_params": null
}

/** MQTT Topic: /t_ms */
export namespace T_MS {
  /** First thing they send */
  export interface FirstLoginSequenceID {
    "firstDeltaSeqId": number,
    "queueEntityId": number,
    "syncToken": "1"
  }

  /** Second message */
  export interface MarkRead {
    "deltas": [
      {
        "actionTimestamp": ReturnType<DateConstructor['now']>,
        "breadcrumbs": {},
        "folderId": {
          "systemFolderId": "INBOX"
        },
        "irisSeqId": `${number}`,
        "irisTags": [
          "did_not_update_iris_checkpoint",
          "IS_VALIDATED"
        ],
        "threadKeys": [
          {
            "threadFbId": `${number}`
          }
        ],
        "tqSeqId": `${number}`,
        "watermarkTimestamp": ReturnType<DateConstructor['now']>,
        "class": "MarkRead"
      },
      {
        "actionTimestamp": ReturnType<DateConstructor['now']>,
        "breadcrumbs": {},
        "folderId": {
          "systemFolderId": "INBOX"
        },
        "irisSeqId": `${number}`,
        "irisTags": [
          "did_not_update_iris_checkpoint",
          "strict_user_privacy_enforcement",
          "iris_post_process",
          "strict_user_privacy_enforcement_logging_block",
          "strict_user_privacy_enforcement_feature_block",
          "IS_VALIDATED"
        ],
        "threadKeys": [
          {
            "threadFbId": `${number}`
          }
        ],
        "tqSeqId": `${number}`,
        "watermarkTimestamp": ReturnType<DateConstructor['now']>,
        "class": "MarkRead"
      }
    ],
    "firstDeltaSeqId": number,
    "lastIssuedSeqId": number,
    /** Account User ID */
    "queueEntityId": number
  };

  export interface NewMessage {
    "deltas": [
      {
        "attachments": [
          {
            /** User ID */
            "fbid": `${number}`,
            "fileSize": "212073",
            /** User ID */
            "id": `${number}`,
            "mercury": {
              "blob_attachment": {
                "__typename": "MessageImage",
                "__isMessageBlobAttachment": "MessageImage",
                "attribution_app": null,
                "attribution_metadata": null,
                "filename": "image-1219299826757716",
                "preview": {
                  "uri": "https://scontent.xx.fbcdn.net/v/t1.15752-9/679985615_1219299830091049_3851174262484994075_n.png?stp=dst-png_p280x280&_nc_cat=110&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHbJpTVbPuHKgImUQlBa78d5KuHHyg9Fzvkq4cfKD0XO2w8FuOfRzsQ0xkxl8xDaYRpe_wr4sMkIUZ1yifZrRiY&_nc_ohc=T_Q4GaCMHOIQ7kNvwHeWyMz&_nc_oc=AdqIcatDcx67wr4T6gLTDma1s5Mk52vSzfGZJHm0d7sbJEZORRMncGqVzNwVVXmyQ9U&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD5AEsUN9AyUfL0Nd9uiJCslL6eILJ5ifC2C2UE6zPOoHU3w&oe=6A18664A",
                  "height": 280,
                  "width": 517
                },
                "large_preview": {
                  "uri": "https://scontent.xx.fbcdn.net/v/t1.15752-9/679985615_1219299830091049_3851174262484994075_n.png?stp=dst-png_p480x480&_nc_cat=110&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHbJpTVbPuHKgImUQlBa78d5KuHHyg9Fzvkq4cfKD0XO2w8FuOfRzsQ0xkxl8xDaYRpe_wr4sMkIUZ1yifZrRiY&_nc_ohc=T_Q4GaCMHOIQ7kNvwHeWyMz&_nc_oc=AdqIcatDcx67wr4T6gLTDma1s5Mk52vSzfGZJHm0d7sbJEZORRMncGqVzNwVVXmyQ9U&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD5AGV8MtCMWIqPICTUQgBF-0VzGdPl8HsrAjLS9eb2PalwA&oe=6A18664A",
                  "height": 480,
                  "width": 887
                },
                "thumbnail": {
                  "uri": "https://scontent.xx.fbcdn.net/v/t1.15752-9/679985615_1219299830091049_3851174262484994075_n.png?stp=cp0_dst-png_s64x64&_nc_cat=110&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHbJpTVbPuHKgImUQlBa78d5KuHHyg9Fzvkq4cfKD0XO2w8FuOfRzsQ0xkxl8xDaYRpe_wr4sMkIUZ1yifZrRiY&_nc_ohc=T_Q4GaCMHOIQ7kNvwHeWyMz&_nc_oc=AdqIcatDcx67wr4T6gLTDma1s5Mk52vSzfGZJHm0d7sbJEZORRMncGqVzNwVVXmyQ9U&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD5AGslBJcTwtGGF4ItkKdRAH4mpUBwWxJ0Sd3EPTJdmuvag&oe=6A18664A"
                },
                "photo_encodings": [],
                "legacy_attachment_id": "1219299826757716",
                "original_dimensions": {
                  "x": 2042,
                  "y": 1105
                },
                "original_extension": "png",
                "render_as_sticker": false,
                "blurred_image_uri": null,
                "id": "bWVzc2FnZV9ibG9iX2F0dGFjaG1lbnQ6MTIxOTI5OTgyNjc1NzcxNg"
              }
            },
            "titanType": 4,
            "useRefCounting": true
          }
        ],
        "breadcrumbs": {},
        "contentSubtype": 300,
        "data": {
          "eitm_timestamp": "1777392389837"
        },
        "irisSeqId": "213819",
        "irisTags": [
          "did_not_update_iris_checkpoint",
          "IS_VALIDATED"
        ],
        "messageMetadata": {
          "actorFbId": "100054303594421",
          "cid": {
            "conversationFbid": "1698860234131025"
          },
          "data": {
            "data": {
              "KO": {
                "asLong": "0"
              }
            }
          },
          "folderId": {
            "systemFolderId": "INBOX"
          },
          "messageId": "mid.$gAAYJGrjHRlGkBjX-O2d1PCw4hgAi",
          "offlineThreadingId": "7454930918806257698",
          "tags": [
            "source:chat:light_speed",
            "app_id:2220391788200892"
          ],
          "threadKey": {
            "threadFbId": "1698860234131025"
          },
          "threadReadStateEffect": "MARK_UNREAD",
          "threadSubtype": 1,
          "timestamp": "1777394038331",
          "unsendType": "deny_for_non_sender",
          "skipBumpThread": false
        },
        "participants": [
          "100078061633069",
          "100094971380416",
          "100054303594421",
          "100095227895318",
          "100013036275290",
          "61566984747506",
          "61575823096770",
          "100081144393297",
          "100090794779367",
          "100055943906136",
          "100037363620456",
          "100051724779220",
          "100088309851834",
          "100075058221244",
          "61578362916559",
          "61565349431613",
          "61568848874249",
          "61571838202955",
          "100057460711194",
          "100082770721408",
          "502275138",
          "61562509957497",
          "100081852204977",
          "100091575503341",
          "100088046124795",
          "100090434559735",
          "61581631452429",
          "100076001623455",
          "100040253298048",
          "100043629273574",
          "61569198136653",
          "100023119327716",
          "61581963846496",
          "100057648637336",
          "100081308427535",
          "61556329084955",
          "100000793548228",
          "100003632922834",
          "61566890456383",
          "61559656755735",
          "61551832761590",
          "100067098717022",
          "100092626989627",
          "61562374663521",
          "100029544710738",
          "61581135412496",
          "100004067322959",
          "1164038524",
          "61583301520124",
          "100071632934357",
          "61579252886225",
          "61580433922084",
          "100085898449586",
          "100082377980115",
          "100040643049702",
          "100005232486082",
          "61575634184224",
          "100094685130765",
          "100058594941918",
          "100052865062393",
          "100052144353544",
          "61586437481052",
          "61588062534281",
          "100041435831605",
          "61582182943866",
          "61576050553170",
          "61576525404021",
          "100014260212229",
          "100061265983963",
          "61550042344280",
          "61567608864230",
          "61554222594723",
          "61583865901061",
          "61583412103018",
          "100081351407817",
          "61555836246766",
          "61582740845935",
          "100067554161622",
          "100001071473697",
          "100015168369582",
          "100086949742761",
          "100076408339207",
          "100022836064213",
          "100050635086635",
          "100070373179566",
          "61581385337960",
          "100051698454006",
          "61588523180948",
          "61578798203236",
          "100092580180477",
          "100004863192574",
          "61567556002763",
          "100033808762431",
          "61568710102403",
          "61581260288910",
          "61585233555488",
          "61552887944867",
          "100094202834302",
          "61576279185929",
          "100090979539274",
          "100092225192213",
          "61588874734034"
        ],
        "requestContext": {
          "apiArgs": {}
        },
        "tqSeqId": "312134",
        "class": "NewMessage"
      }
    ],
    "firstDeltaSeqId": 213819,
    "lastIssuedSeqId": 213819,
    "queueEntityId": 61581385337960
  }
}

/** MQTT Topic: /orca_presence */
export namespace OrcaPresence {
  export interface ActiveList {
    "list_type": "full",
    "list": {
        /** Account UID */
        "u": number,
        /** ??? Usually 0 or 2 */
        "p": number,
        /** A Date.now() timestamp */
        "l": ReturnType<DateConstructor['now']>
        /** Unclear */
        "c"?: number
    }[]
  }
}

/** MQTT Topic: /thread_typing */
export namespace ThreadTyping {
  export interface TypingIndicator {
    /** UID of the Sender */
    "sender_fbid": number,
    /** Is user typing? 1 is true, 0 is false */
    "state": 0 | 1,
    /** Response Type */
    "type": "typ",
    /** Thread ID */
    "thread": `${number}`
  }
  export interface TypingIndicatorNormalized {
    "type": "typ",
    /** Is user typing? */
    "isTyping": boolean,
    /** Sender UID */
    "from": `${number}`,
    /** Thread ID */
    "threadID": `${number}`
  }

}