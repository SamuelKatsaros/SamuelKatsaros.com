import { GITHUB_ACCESS_TOKEN } from 'astro:env/server'

interface LastUpdatedTimeData {
  lastUpdatedTime: string
  latestCommitUrl: string
}

const getLastUpdatedTimeByFile = async (
  filePath: string
): Promise<LastUpdatedTimeData> => {
  const API_URL = `https://api.github.com/repos/samuelkatsaros/SamuelKatsaros.com/commits?`

  const params = new URLSearchParams({
    path: `src/content/${filePath}`,
    per_page: '1'
  }).toString()

  try {
    console.log('Token exists:', !!GITHUB_ACCESS_TOKEN)
    console.log('Making request to:', API_URL + params)
    
    const response = await fetch(API_URL + params, {
      headers: { 
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        'User-Agent': 'samuelkatsaros-website'
      }
    })

    if (!response.ok) {
      console.error('GitHub API Error:', response.status)
      return {
        lastUpdatedTime: new Date().toISOString(),
        latestCommitUrl: ''
      }
    }

    const [data] = await response.json()
    return {
      lastUpdatedTime: data.commit.committer.date,
      latestCommitUrl: data.html_url
    }
  } catch (error) {
    console.error('Failed to fetch from GitHub:', error)
    return {
      lastUpdatedTime: new Date().toISOString(),
      latestCommitUrl: ''
    }
  }
}

export default getLastUpdatedTimeByFile
