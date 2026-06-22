import { makeParsable } from "../helpers";
import formatCookie from "../formatters/value/formatCookie";

function buildUrl(req: any): string {
  return req.uri.protocol + "//" + req.uri.hostname + req.uri.pathname;
}

function parseBody(body: any): any {
  if (typeof body === "object" && body !== null) return body;
  if (typeof body === "string") {
    try {
      return JSON.parse(makeParsable(body) as string);
    } catch (e) {
      const err: any = new Error("JSON.parse error. Check the `detail` property on this error.");
      err.error = err.message;
      err.detail = e;
      err.res = body;
      throw err;
    }
  }
  throw new Error("Unknown response body type: " + typeof body);
}

function injectCookies(ctx: any, require: any[]): void {
  if (!Array.isArray(require[0]) || require[0][0] !== "Cookie") return;
  const cookie = [...require[0][3]]; // no mutation on res
  cookie[0] = cookie[0].replace("_js_", "");
  ctx.jar.setCookie(formatCookie(cookie, "facebook"), "https://www.facebook.com");
  ctx.jar.setCookie(formatCookie(cookie, "messenger"), "https://www.messenger.com");
}

function updateDTSG(ctx: any, require: any[]): void {
  for (const mod of require) {
    if (mod[0] === "DTSG" && mod[1] === "setToken") {
      ctx.fb_dtsg = mod[3][0];
      ctx.ttstamp = "2" + [...ctx.fb_dtsg].map((c: string) => c.charCodeAt(0)).join("");
    }
  }
}

export function parseAndCheckLogin(ctx: any, http: any, retryCount = 0) {
  return async (data: any): Promise<any> => {
    // 5xx retry
    if (data.statusCode >= 500 && data.statusCode < 600) {
      if (retryCount >= 5) {
        const err: any = new Error("Request retry failed. Check the `res` and `statusCode` property on this error.");
        err.statusCode = data.statusCode;
        err.res = data.body;
        err.error = err.message;
        throw err;
      }

      const retryTime = Math.floor(Math.random() * 5000);
      const url = buildUrl(data.request.uri);
      await new Promise(r => setTimeout(r, retryTime));

      const isFormData = data.request.headers["content-type"].split(";")[0] === "multipart/form-data";
      const newData = isFormData
        ? await http.postFormData(url, ctx.jar, data.request.formData, data.request.qs, ctx.globalOptions, ctx)
        : await http.post(url, ctx.jar, data.request.form, ctx.globalOptions, ctx);

      return parseAndCheckLogin(ctx, http, retryCount + 1)(newData);
    }

    if (data.statusCode === 404) return;

    if (data.statusCode !== 200) {
      throw new Error("parseAndCheckLogin got status code: " + data.statusCode + ". Bailing out of trying to parse response.");
    }

    const res = parseBody(data.body);

    if (res.redirect && data.request.method === "GET") {
      const redirectRes = await http.get(res.redirect, ctx.jar);
      return parseAndCheckLogin(ctx, http)(redirectRes);
    }

    if (res.jsmods && Array.isArray(res.jsmods.require)) {
      injectCookies(ctx, res.jsmods.require);
      updateDTSG(ctx, res.jsmods.require);
    }

    if (res.error === 1357001) {
      const err: any = new Error("Facebook blocked the login");
      err.error = "Not logged in.";
      throw err;
    }

    return res;
  };
}