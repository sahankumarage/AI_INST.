import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://aiinst.io'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/portal/', '/api/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
