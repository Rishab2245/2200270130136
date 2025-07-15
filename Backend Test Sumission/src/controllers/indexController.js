import Url from '../models/Url.js';
import shortid from 'shortid';
import validUrl from 'valid-url';
import geoip from 'geoip-lite';
import logger from '../utils/logger.js';

export const createShortUrl = async (req, res) => {
    try {
        const { url, validity, shortcode } = req.body;
        await logger.log('backend', 'info', 'handler', `URL shortening request received. URL: ${url}, Validity: ${validity || 30}min, Custom code: ${shortcode || 'auto-generate'}`);

        if (!validUrl.isUri(url)) {
            await logger.log('backend', 'error', 'handler', `URL validation failed. Received invalid URL format: ${url}`);
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        const validityMinutes = validity || 30;
        const expiryDate = new Date(Date.now() + validityMinutes * 60000);

        let finalShortcode = shortcode;
        if (!finalShortcode) {
            finalShortcode = shortid.generate();
            await logger.log('backend', 'debug', 'service', `Generated shortcode: ${finalShortcode} for URL: ${url}`);
        } else if (await Url.findOne({ shortCode: finalShortcode })) {
            await logger.log('backend', 'error', 'handler', `Custom shortcode conflict. Code ${finalShortcode} is already in use`);
            return res.status(409).json({ error: 'Shortcode already in use' });
        }

        const shortUrl = new Url({
            originalUrl: url,
            shortCode: finalShortcode,
            expiryDate
        });

        try {
            await shortUrl.save();
            await logger.log('backend', 'info', 'db', `URL document created. Shortcode: ${finalShortcode}, Expiry: ${expiryDate.toISOString()}`);
        } catch (dbError) {
            await logger.log('backend', 'fatal', 'db', `Failed to save URL document: ${dbError.message}. URL: ${url}, Shortcode: ${finalShortcode}`);
            throw dbError;
        }

        res.status(201).json({
            shortLink: `http://localhost:5000/${finalShortcode}`,
            expiry: expiryDate.toISOString()
        });
    } catch (error) {
        await logger.log('backend', 'error', 'handler', `URL shortening operation failed. Error: ${error.message}. Stack: ${error.stack}`);
        res.status(500).json({ error: 'Server error' });
    }
};

export const redirectToUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        await logger.log('backend', 'debug', 'handler', `URL redirect request received. Shortcode: ${shortCode}`);
        
        let url;
        try {
            url = await Url.findOne({ shortCode });
            if (!url) {
                await logger.log('backend', 'error', 'handler', `URL lookup failed. Shortcode not found: ${shortCode}`);
                return res.status(404).json({ error: 'URL not found' });
            }
        } catch (dbError) {
            await logger.log('backend', 'fatal', 'db', `Database query failed during URL lookup. Error: ${dbError.message}`);
            throw dbError;
        }

        if (url.expiryDate < new Date()) {
            await logger.log('backend', 'warn', 'service', `Expired URL access attempt. Shortcode: ${shortCode}, Expiry: ${url.expiryDate}, Current time: ${new Date()}`);
            return res.status(410).json({ error: 'URL has expired' });
        }

        const ip = req.ip || req.connection.remoteAddress;
        const geo = geoip.lookup(ip) || { country: 'Unknown' };
        const referrer = req.get('Referer') || 'Direct';
        
        try {
            url.clicks.push({
                referrer,
                location: geo.country
            });
            await url.save();
            await logger.log('backend', 'info', 'db', `Analytics data saved. Shortcode: ${shortCode}, IP: ${ip}, Country: ${geo.country}, Referrer: ${referrer}`);
        } catch (dbError) {
            await logger.log('backend', 'error', 'db', `Failed to save analytics data. Shortcode: ${shortCode}, Error: ${dbError.message}`);
            // Don't throw here - we can still do the redirect even if analytics fails
        }

        await logger.log('backend', 'info', 'service', `Redirecting user. Shortcode: ${shortCode}, Original URL: ${url.originalUrl}`);
        res.redirect(url.originalUrl);
    } catch (error) {
        await logger.log('backend', 'fatal', 'handler', `Critical error during URL redirect. Shortcode: ${shortCode}, Error: ${error.message}, Stack: ${error.stack}`);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getUrlStats = async (req, res) => {
    try {
        const { shortCode } = req.params;
        await logger.log('backend', 'debug', 'handler', `Analytics request received. Shortcode: ${shortCode}`);
        
        let url;
        try {
            url = await Url.findOne({ shortCode });
            if (!url) {
                await logger.log('backend', 'error', 'handler', `Analytics lookup failed. Shortcode not found: ${shortCode}`);
                return res.status(404).json({ error: 'URL not found' });
            }
        } catch (dbError) {
            await logger.log('backend', 'fatal', 'db', `Database query failed during analytics lookup. Error: ${dbError.message}`);
            throw dbError;
        }

        const stats = {
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            createdAt: url.createdAt,
            expiryDate: url.expiryDate,
            totalClicks: url.clicks.length,
            clicks: url.clicks
        };

        const isExpired = url.expiryDate < new Date();
        await logger.log('backend', 'info', 'service', 
            `Analytics retrieved. Shortcode: ${shortCode}, Status: ${isExpired ? 'Expired' : 'Active'}, ` +
            `Created: ${stats.createdAt}, Expires: ${stats.expiryDate}, Total Clicks: ${stats.totalClicks}`
        );

        res.json(stats);
    } catch (error) {
        await logger.log('backend', 'fatal', 'handler', 
            `Analytics retrieval failed. Shortcode: ${shortCode}, ` +
            `Error: ${error.message}, Stack: ${error.stack}`
        );
        res.status(500).json({ error: 'Server error' });
    }
};
