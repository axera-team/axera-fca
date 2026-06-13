import { CookieJar } from "tough-cookie";

class FacebookCookieManager {
    jar: CookieJar;

    constructor() {
        this.jar = new CookieJar();
    }

    /**
     * Convert a single cookie object to a cookie string
     */
    cookieObjectToString(cookieData): string {
        // Start with name=value
        let cookieString = `${cookieData.name}=${cookieData.value}`;
        
        // Add path (default to '/')
        cookieString += `; Path=${cookieData.path || '/'}`;
        
        // Handle domain (remove leading dot for compatibility)
        if (cookieData.domain) {
            let domain = cookieData.domain.replace(/^\./, '');
            cookieString += `; Domain=${domain}`;
        }
        
        // Add Secure flag
        if (cookieData.secure === true) {
            cookieString += '; Secure';
        }
        
        // Add HttpOnly flag
        if (cookieData.httpOnly === true) {
            cookieString += '; HttpOnly';
        }
        
        // Handle SameSite
        if (cookieData.sameSite) {
            let sameSite = cookieData.sameSite;
            // Convert 'no_restriction' to 'None' (standard SameSite value)
            if (sameSite === 'no_restriction') {
                sameSite = 'None';
            }
            // Capitalize first letter if needed
            sameSite = sameSite.charAt(0).toUpperCase() + sameSite.slice(1).toLowerCase();
            cookieString += `; SameSite=${sameSite}`;
        }
        
        // Handle expiration (if not a session cookie)
        if (!cookieData.session && cookieData.expirationDate) {
            const expDate = new Date(cookieData.expirationDate * 1000);
            cookieString += `; Expires=${expDate.toUTCString()}`;
        }
        
        return cookieString;
    }

    /**
     * Load multiple cookies from appstate array
     */
    async loadCookies(appstate, url = 'https://facebook.com') {
        for (const cookieData of appstate) {
            try {
                const cookieString = this.cookieObjectToString(cookieData);
                await this.jar.setCookie(cookieString, url);
            } catch (error) {
                console.error(`Failed to set cookie ${cookieData.name}:`, error.message);
            }
        }
    }

    /**
     * Get all cookies for a specific URL
     */
    async getCookies(url = 'https://facebook.com') {
        return await this.jar.getCookies(url);
    }

    /**
     * Get cookie string for a specific URL (useful for headers)
     */
    async getCookieString(url = 'https://facebook.com') {
        const cookies = await this.getCookies(url);
        return cookies.map(cookie => `${cookie.key}=${cookie.value}`).join('; ');
    }

    /**
     * Export current cookies back to appstate format
     */
    async exportToAppstate(url = 'https://facebook.com') {
        const cookies = await this.getCookies(url);
        
        return cookies.map(cookie => ({
            domain: cookie.domain ? cookie.domain : '.facebook.com',
            expirationDate: cookie.expires ? Number(cookie.expires) / 1000 : null,
            hostOnly: cookie.hostOnly,
            httpOnly: cookie.httpOnly,
            name: cookie.key,
            path: cookie.path,
            sameSite: cookie.sameSite === 'none' ? 'no_restriction' : cookie.sameSite?.toLowerCase(),
            secure: cookie.secure,
            session: !cookie.expires,
            storeId: null,
            value: cookie.value
        }));
    }
}

// If you just want a simple function to convert appstate to cookie jar
async function createCookieJarFromAppstate(appstate) {
    const manager = new FacebookCookieManager();
    await manager.loadCookies(appstate);
    return manager;
}

export { FacebookCookieManager, createCookieJarFromAppstate };