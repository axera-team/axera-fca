"use strict";
import { NUM_TO_MONTH, NUM_TO_DAY } from "../../constants.js";

/**
 * Formats a Date object into a GMT string.
 * @param {Date} date The date to format.
 */
export default function formatDate(date) {
    let d = date.getUTCDate();
    d = d >= 10 ? d : Number("0" + d);
    let h = date.getUTCHours();
    h = h >= 10 ? h : Number("0" + h);
    let m = date.getUTCMinutes();
    m = m >= 10 ? m : Number("0" + m);
    let s = date.getUTCSeconds();
    s = s >= 10 ? s : Number("0" + s);
    return (
        NUM_TO_DAY[date.getUTCDay()] +
        ", " +
        d +
        " " +
        NUM_TO_MONTH[date.getUTCMonth()] +
        " " +
        date.getUTCFullYear() +
        " " +
        h +
        ":" +
        m +
        ":" +
        s +
        " GMT"
    );
}