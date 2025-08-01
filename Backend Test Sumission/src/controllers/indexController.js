import Url from '../models/Url.js';
import shortid from 'shortid';
import validUrl from 'valid-url';
import geoip from 'geoip-lite';

export const createShortUrl = async (req, res) => {
    try {
        const { url, validity, shortcode } = req.body;

        if (!validUrl.isUri(url)) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        const validityMinutes = validity || 30;
        const expiryDate = new Date(Date.now() + validityMinutes * 60000);

        let finalShortcode = shortcode;
        if (!finalShortcode) {
            finalShortcode = shortid.generate();
        } else if (await Url.findOne({ shortCode: finalShortcode })) {
            return res.status(409).json({ error: 'Shortcode already in use' });
        }

        const shortUrl = new Url({
            originalUrl: url,
            shortCode: finalShortcode,
            expiryDate
        });

        try {
            await shortUrl.save();
        } catch (dbError) {
            throw dbError;
        }

        res.status(201).json({
            shortLink: `http://localhost:5000/${finalShortcode}`,
            expiry: expiryDate.toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const redirectToUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        
        let url;
        try {
            url = await Url.findOne({ shortCode });
            if (!url) {
                return res.status(404).json({ error: 'URL not found' });
            }
        } catch (dbError) {
            throw dbError;
        }

        if (url.expiryDate < new Date()) {
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
        } catch (dbError) {
            // Don't throw here - we can still do the redirect even if analytics fails
        }

        res.redirect(url.originalUrl);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getUrlStats = async (req, res) => {
    try {
        const { shortCode } = req.params;
        
        let url;
        try {
            url = await Url.findOne({ shortCode });
            if (!url) {
                return res.status(404).json({ error: 'URL not found' });
            }
        } catch (dbError) {
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
   

        res.json(stats);
    } catch (error) {
        
        res.status(500).json({ error: 'Server error' });
    }
};
