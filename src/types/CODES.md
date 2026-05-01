# CODES

```js
const form = {
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
//  before
const resData = await defaultFuncs.post("https://www.facebook.com", jar, form)
.then(utils.parseAndCheckLogin(ctx, defaultFuncs));
// after
const resData = await apiClient.post('/api/graphqlbatch/' { jar, formData: form }).then(utils.parseAndCheckLogin(ctx, defaultFuncs));
```
