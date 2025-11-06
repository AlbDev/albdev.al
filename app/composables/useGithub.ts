export const useGithub = () => {
  const fetchRepo = async (owner: string, repo: string) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      if (!response.ok) throw new Error('Failed to fetch repository')
      return await response.json()
    } catch (error) {
      console.error('GitHub API error:', error)
      return null
    }
  }

  const fetchUserRepos = async (username: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
      if (!response.ok) throw new Error('Failed to fetch user repositories')
      return await response.json()
    } catch (error) {
      console.error('GitHub API error:', error)
      return []
    }
  }

  const parseGithubUrl = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) return null
    return { owner: match[1], repo: match[2].replace('.git', '') }
  }

  return {
    fetchRepo,
    fetchUserRepos,
    parseGithubUrl,
  }
}
