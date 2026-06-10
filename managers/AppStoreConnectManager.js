const crypto = require('node:crypto');

const API_BASE = 'https://api.appstoreconnect.apple.com';
const JWT_LIFETIME_SECONDS = 20 * 60;
const TOKEN_REFRESH_MARGIN_SECONDS = 60;

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function base64url(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function normalisePrivateKey(raw) {
    if (!raw) return null;

    let key = raw.trim().replace(/^["']|["']$/g, '');
    if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');

    // Bare base64 body (pasted without the PEM header/footer) — wrap it.
    if (!key.includes('-----BEGIN')) {
        const body = key.replace(/\s+/g, '').match(/.{1,64}/g)?.join('\n') ?? '';
        key = `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----`;
    }

    return key;
}

function loadPrivateKey() {
    const keyPath = process.env.APP_STORE_CONNECT_PRIVATE_KEY_PATH;
    if (keyPath) {
        return normalisePrivateKey(require('node:fs').readFileSync(keyPath, 'utf8'));
    }
    return normalisePrivateKey(process.env.APP_STORE_CONNECT_PRIVATE_KEY);
}

function getJwt() {
    const now = Math.floor(Date.now() / 1000);
    if (cachedToken && cachedTokenExpiresAt - TOKEN_REFRESH_MARGIN_SECONDS > now) {
        return cachedToken;
    }

    const keyId = process.env.APP_STORE_CONNECT_KEY_ID;
    const issuerId = process.env.APP_STORE_CONNECT_ISSUER_ID;
    const privateKey = loadPrivateKey();

    if (!keyId || !issuerId || !privateKey) {
        throw new Error('App Store Connect credentials are not fully configured.');
    }

    const header = { alg: 'ES256', kid: keyId, typ: 'JWT' };
    const payload = {
        iss: issuerId,
        iat: now,
        exp: now + JWT_LIFETIME_SECONDS,
        aud: 'appstoreconnect-v1',
    };

    const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
    const signature = crypto
        .createSign('SHA256')
        .update(signingInput)
        .sign({ key: privateKey, dsaEncoding: 'ieee-p1363' });

    const token = `${signingInput}.${base64url(signature)}`;
    cachedToken = token;
    cachedTokenExpiresAt = payload.exp;
    return token;
}

async function apiGet(pathWithQuery) {
    const token = getJwt();
    const response = await fetch(`${API_BASE}${pathWithQuery}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`App Store Connect API ${response.status}: ${body || response.statusText}`);
    }

    return response.json();
}

class AppStoreConnectManager {
    static isConfigured() {
        return Boolean(
            process.env.APP_STORE_CONNECT_KEY_ID
            && process.env.APP_STORE_CONNECT_ISSUER_ID
            && (process.env.APP_STORE_CONNECT_PRIVATE_KEY || process.env.APP_STORE_CONNECT_PRIVATE_KEY_PATH)
            && process.env.APP_STORE_CONNECT_APP_ID,
        );
    }

    static async getLatestBuild() {
        const appId = process.env.APP_STORE_CONNECT_APP_ID;
        const query = new URLSearchParams({
            'filter[app]': appId,
            'sort': '-uploadedDate',
            'limit': '1',
            'include': 'preReleaseVersion',
            'fields[builds]': 'version,uploadedDate,processingState,expirationDate,preReleaseVersion',
            'fields[preReleaseVersions]': 'version,platform',
        });

        const payload = await apiGet(`/v1/builds?${query.toString()}`);
        const build = payload.data?.[0];
        if (!build) return null;

        const preReleaseRef = build.relationships?.preReleaseVersion?.data;
        const preReleaseVersion = preReleaseRef
            ? payload.included?.find(item => item.type === 'preReleaseVersions' && item.id === preReleaseRef.id)
            : null;

        return {
            id: build.id,
            buildNumber: build.attributes?.version ?? null,
            uploadedDate: build.attributes?.uploadedDate ?? null,
            processingState: build.attributes?.processingState ?? null,
            expirationDate: build.attributes?.expirationDate ?? null,
            marketingVersion: preReleaseVersion?.attributes?.version ?? null,
            platform: preReleaseVersion?.attributes?.platform ?? null,
        };
    }
}

module.exports = AppStoreConnectManager;
