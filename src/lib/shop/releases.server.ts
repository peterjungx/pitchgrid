const RELEASES_REPO = 'pitchgrid-io/pitchgrid-releases';

export type Platform = 'macos' | 'windows' | 'linux';

export interface ReleaseAsset {
    platform: Platform;
    name: string;
    url: string;
    sizeMb: number;
}

export interface PluginRelease {
    version: string; // e.g. "1.2.0" (tag without leading v)
    tag: string;
    date: string; // ISO
    notes: string;
    assets: ReleaseAsset[];
}

function platformOf(assetName: string): Platform | null {
    if (assetName.endsWith('.pkg')) return 'macos';
    if (assetName.endsWith('.exe')) return 'windows';
    if (assetName.endsWith('.tar.gz')) return 'linux';
    return null;
}

interface GithubAsset {
    name: string;
    browser_download_url: string;
    size: number;
}

interface GithubRelease {
    tag_name: string;
    published_at: string;
    body: string | null;
    draft: boolean;
    prerelease: boolean;
    assets: GithubAsset[];
}

/** All published releases, newest first. */
export async function getReleases(fetchFn: typeof fetch = fetch): Promise<PluginRelease[]> {
    const res = await fetchFn(`https://api.github.com/repos/${RELEASES_REPO}/releases?per_page=100`, {
        headers: { Accept: 'application/vnd.github+json' }
    });
    if (!res.ok) {
        throw new Error(`GitHub releases API ${res.status}: ${await res.text()}`);
    }
    const releases: GithubRelease[] = await res.json();
    return releases
        .filter((r) => !r.draft && !r.prerelease)
        .map((r) => ({
            version: r.tag_name.replace(/^v/, ''),
            tag: r.tag_name,
            date: r.published_at,
            notes: r.body ?? '',
            assets: r.assets
                .map((a) => {
                    const platform = platformOf(a.name);
                    return platform
                        ? {
                              platform,
                              name: a.name,
                              url: a.browser_download_url,
                              sizeMb: Math.round((a.size / 1024 / 1024) * 10) / 10
                          }
                        : null;
                })
                .filter((a): a is ReleaseAsset => a !== null)
        }))
        .filter((r) => r.assets.length > 0);
}
